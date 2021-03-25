/**
 * Text
 * @file 头像组件
 * @module app/components/common/gravatar
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, ImageProps, } from 'react-native';
import { observable, action } from 'mobx';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import mixins from '@app/style/mixins';
import { TouchableView } from '@app/components/common/touchable-view';
import { Iconfont } from '@app/components/common/iconfont';
import { ImageViewerModal } from '@app/components/common/image-viewer';
import { launchImageLibrary } from 'react-native-image-picker';
import request from '@app/services/request';


export interface IGravatar extends ImageProps {
    picker?: boolean;
    preview?: boolean;
    onPress?(): void;
    onSuccess?(data: any, url: any): void;
}

interface IGravatarProps extends IGravatar {}


const DEFAULT_WH = 50;
const DEFAULT_WH_SCALE = DEFAULT_WH * 0.5;



@observer export class Gravatar extends PureComponent<IGravatarProps> {
    @observable private imageModalVisible: boolean = false;

    @boundMethod
    private onGravatarPress() {
        const { preview, picker, onSuccess } = this.props;
        if (preview) {
            this.updateImageModalVisible(true);
        }
        if (picker) {
            launchImageLibrary({
                mediaType: 'photo'
            }, async (res: any) => {
                // 图片上传
                const uploadedUrl = await request.uploadFile(res);
                onSuccess && onSuccess(res.uri, uploadedUrl);
            });
        }
    }

    // 图片播放弹框显示
    @action updateImageModalVisible(visible: boolean) {
        this.imageModalVisible = visible;
    }

    render() {
        const { source, style, picker = false, preview = false } = this.props;
        const { styles } = obStyles;
        
        return (
            <>
                <TouchableView
                    accessibilityLabel="上传头像"
                    disabled={picker ? !picker : (preview ? !preview : true)}
                    style={[styles.container, { width: style?.width || DEFAULT_WH, height: style?.height || DEFAULT_WH }]}
                    onPress={this.onGravatarPress}
                >
                    <Image
                        source={source} 
                        style={style}
                    />
                    {
                        picker ? (
                            <View style={styles.icon}>
                                <Iconfont name="changyongicon" size={style?.width * 0.5 || DEFAULT_WH_SCALE} />
                            </View>
                        ) : null
                    }
                </TouchableView>
                <ImageViewerModal
                    images={[source.uri]}
                    index={0}
                    visible={this.imageModalVisible}
                    onClose={() => this.updateImageModalVisible(false)}
                />
            </>
        );
    }
}


const obStyles = observable({
    get styles() {
        return StyleSheet.create({
            container: {
                position: 'relative'
            },
            icon: {
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 2,
                ...mixins.center
            }
        });
    }
});
