/**
 * Bussniss types
 * @file 业务数据模型
 * @module types/business
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

import { EOriginState } from './state';

// 分类模型，后面待修改
export interface ICategory {
  id: number;
  _id: string;
  pid: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  description: string;
  update_at: string;
  create_at: string;
}

// 标签模型，后面待修改
export interface ITag {
  id: number;
  _id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  description: string;
  update_at: string;
  create_at: string;
}

// 文章模型，后面待修改
export interface IArticle {
  id: number;
  _id: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
  thumb: string;
  isMarkDown: boolean;
  meta: {
    likes: number,
    views: number,
    comments: number,
  };
  origin: EOriginState;
  update_at: string;
  create_at: string;
  tag: ITag[];
  category: ICategory[];
  related: IArticle[];
}
