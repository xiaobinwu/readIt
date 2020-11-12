/**
 * Common bussniss state types
 * @file 通用业务数据状态模型
 * @module types/state
 * @author twenty-four K <https://github.com/xiaobinwu>
 */

 export enum EOriginState {
    Original = 0, // 原创
    Reprint = 1, // 转载
    Hybrid = 2, // 混合
 }

 export enum ETodoIconType {
    Meeting = 0, // 会议
    Learning = 1, // 学习
    Plan = 2, // 计划
    Matter = 3, // 事项
    Remind = 4, // 提醒
    Work = 5, // 工作
 }
 
 export enum ETodoPriority {
    None = 0,
    First = 1,
    Second = 2,
    Third = 3
 }
