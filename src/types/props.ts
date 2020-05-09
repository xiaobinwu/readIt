
/**
 * Bussniss types
 * @file 通用props模型
 * @module types/props
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { Route } from '@react-navigation/native';

// react node 子节点接口定义
export interface IChildrenProps {
    children: React.ReactNode | React.ReactNode[];
}

// react-navigation 中 navigation参数接口定义
export interface Navigation {
    addListener(...addListener: any): any;
    canGoBack(...canGoBack: any): any;
    dangerouslyGetParent(...dangerouslyGetParent: any): any;
    dangerouslyGetState(...anonymous: any): any;
    dispatch(...dispatch: any): any;
    goBack(...anonymous: any): any;
    isFocused(...isFocused: any): any;
    jumpTo(...anonymous: any): any;
    navigate(...anonymous: any): any;
    pop(...anonymous: any): any;
    popToTop(...anonymous: any): any;
    push(...anonymous: any): any;
    removeListener(...removeListener: any): any;
    replace(...anonymous: any): any;
    reset(...anonymous: any): any;
    setOptions(...setOptions: any): any;
    setParams(...anonymou: any): any;
}

export interface NavigationProps {
    navigation: Navigation;
    route: Route<string> & {
        params: any
    };
}

// 路由页面的接口定义
export interface IPageProps extends NavigationProps {}

