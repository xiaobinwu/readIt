/* eslint-disable react-native/no-inline-styles */
/**
 * Detail
 * @file 内容块显示（富文本显示、markdown解析）
 * @module app/components/common/richcontent
 * @author twenty-four K <https://github.com/xiaobinwu>
 */
import marked from 'marked';
import Hljs from 'highlight.js';
import React, { Component } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { webUrl } from '@app/config';
import { ArticleRoutes } from '@app/constants/routes';
import { NavigationProps } from '@app/types/props';
import { LANGUAGE_KEYS } from '@app/constants/language';
import { AutoActivityIndicator } from '@app/components/common/activity-indicator';
import i18n from '@app/services/i18n';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { ImageViewerModal } from '@app/components/common/image-viewer';
import * as contentMarkdownStyles from './markdown-styles';

enum WebViewEventAction {
    Image = 'image',
    Url = 'url'
}

export interface IRichContentProps extends NavigationProps {
    content: string | null; // 内容
    padding: number; // 边距
    sanitize?: boolean; // markDown是否清洗html， isMarkdown必须为true
    indicator?: boolean; // 是否渲染内容
    style?: ViewStyle; // 内容区容器样式
    isMarkdown?: boolean | null; // 是否为markdown  
}

@observer
export class RichContent extends Component<IRichContentProps> {

    private images: string[] = [];
    private renderer: marked.Renderer = new marked.Renderer();

    // 自定义javascript片段，定义dispatchMessage全局方法，用于与ReactNativeWebView（rn）交互
    private htmlScript: string = `
    ;window.dispatchMessage = function(action, data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ action, data }));
    };
  `
    @observable private htmlReadied: boolean = false;
    @observable private imageModalVisible: boolean = false;
    @observable private imageModalIndex: number = 0;

    constructor(props: IRichContentProps) {
        super(props);
        this.initMarked();
        this.initRenderer();
    }

    private initMarked() {
        marked.setOptions({
            renderer: new marked.Renderer(),
            sanitize: this.props.sanitize == null ? true : this.props.sanitize,
            smartLists: true,
            // 自动检测code语言
            highlight(code: string) {
                return Hljs.highlightAuto(code).value;
            }
        });
    }

    private initRenderer() {
        this.renderer.link = this.linkRender;
        this.renderer.code = this.codeRender;
        this.renderer.image = this.imageRender;
        this.renderer.heading = this.headingRender;
        this.renderer.paragraph = this.paragraphRender;
    }

    // 段落解析
    private paragraphRender(text: string): string {
        return `<p>${text}</p>`;
    }

    // 标题解析
    private headingRender(text: string, level: number, raw: string): string {
        const id = raw.toLowerCase().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-');
        return `<h${level} id=${id}>${text}</h${level}>`;
    }

    // 图片解析
    @boundMethod
    private imageRender(src: string, title: string, alt: string): string {
        this.images.push(src); // 存储markdown图片信息
        // 如何做到H5与react通讯
        return  `
          <img
            src="${src}"
            onclick="window.dispatchMessage('${WebViewEventAction.Image}', '${src}')"
          />`;
    }

    // 代码解析
    private codeRender(code: string, lang: string, escaped: boolean): string {
        const { options } = this as any;
        if (options.highlight) {
          const out = options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }
        return `<pre><code>${(escaped ? code : escape(code))}\n</code></pre>`;
    }

    // 链接解析
    private linkRender(href: string, title: string, text: string): string {
        return `
        <a
          href="${href}"
          onclick="window.dispatchMessage('${WebViewEventAction.Url}', '${href}');return false;"
        >${text}</a>`;
    }

    // html是否准备好
    @action
    private updateHtmlReadied(readied: boolean) {
        this.htmlReadied = readied;
    }

    // 点击图片的索引值
    @action
    private updateImageModalIndex(index: number) {
        this.imageModalIndex = index;
    }

    // 图片播放弹框显示
    @action updateImageModalVisible(visible: boolean) {
        this.imageModalVisible = visible;
    }

    // 是否启动渲染动画
    @computed
    private get isIndicatorEnabled(): boolean {
        const { indicator } = this.props;
        return indicator == null ? true : indicator;
    }

    // 内容块
    @computed
    private get htmlContent(): string {
        const { renderer, props } = this;
        const { content, isMarkdown } = props;
        if (!content) {
            return '';
        }
        return `<div id="content">${isMarkdown ? marked(content, {renderer}) : content}</div>`;
    }

    // 样式
    @computed
    private get htmlStyle(): string {
        const { padding } = this.props;
        return `${contentMarkdownStyles.ocean}${contentMarkdownStyles.content.styles} #content { padding: 0 ${padding || 0}px }`;
    }

    // H5与RN交互函数
    @boundMethod
    private handleWebViewEvent(event: any) {
        const json = event.nativeEvent.data; // 接收emit数据
        const eventData = json ? JSON.parse(json) : null;
        if (eventData) {
            // 图片弹窗
            if (eventData.action === WebViewEventAction.Image) {
                this.updateImageModalIndex(this.images.indexOf(eventData.data));
                this.updateImageModalVisible(true);
            }
            // 打开链接
            if (eventData.action === WebViewEventAction.Url) {
                const url: string = eventData.data;
                const articleUrlPrefix = `${webUrl}/article/`; // todo
                const isArticleUrl = url.startsWith(articleUrlPrefix);
                if (isArticleUrl) {
                    const articleId = url.replace(articleUrlPrefix, '');
                    this.props.navigation.dispatch(
                        CommonActions.navigate({
                            key: articleId,
                            name: ArticleRoutes.ArticleDetail,
                            params: { articleId }
                        })
                    );
                } else {
                    this.props.navigation.dispatch(
                        CommonActions.navigate({
                            name: ArticleRoutes.ArticleWebview,
                            params: { url }
                        })
                    );
                }
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    (!this.htmlReadied && this.isIndicatorEnabled) ? (
                        <View style={[{ flex: 1, zIndex: 1 }, StyleSheet.absoluteFill]}>
                            <AutoActivityIndicator style={{ flex: 1 }} text={i18n.t(LANGUAGE_KEYS.RENDERING)} />
                        </View>
                    ) : null
                }
                <AutoHeightWebView
                    style={{
                        flex: 1,
                        ...this.props.style,
                        opacity: this.htmlReadied ? 1 : 0
                    }}
                    customScript={this.htmlScript}
                    customStyle={this.htmlStyle}
                    scrollEnabled={false}
                    originWhitelist={['*']}
                    source={{ html: `<style>${this.htmlStyle}</style>` + this.htmlContent }}
                    viewportContent={'width=device-width, user-scalable=no'}
                    onMessage={this.handleWebViewEvent}
                    onSizeUpdated={() => this.updateHtmlReadied(true)}
                />
                <ImageViewerModal
                    images={this.images}
                    index={this.imageModalIndex}
                    visible={this.imageModalVisible}
                    onClose={() => this.updateImageModalVisible(false)}
                />
            </View>
        );
    }

}

