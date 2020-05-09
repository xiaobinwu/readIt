import { ICategory, ITag } from '@app/types/business';

// 过滤类型枚举，标签、分类、搜索
export enum EFilterType {
    Tag = 'Tag',
    Category = 'Category',
    Search = 'Search'
}

// filter store 过滤值模型
export interface IFilterValues {
    [EFilterType.Tag]: ITag | null
    [EFilterType.Category]: ICategory | null
    [EFilterType.Search]: string | null
}


export type TFilterValue = ITag | ICategory | string;


