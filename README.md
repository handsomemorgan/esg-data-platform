# Green Life - 供应链ESG数据监测平台

> Supply Chain ESG Data Monitoring Platform

基于 React + TypeScript + Vite + ECharts 构建的供应链ESG（环境、社会、治理）数据监测平台。

## 在线访问

| 语言 | 地址 |
|------|------|
| 中文版 | [https://handsomemorgan.github.io/esg-data-platform/](https://handsomemorgan.github.io/esg-data-platform/) |
| English | [https://handsomemorgan.github.io/esg-data-platform/](https://handsomemorgan.github.io/esg-data-platform/) （进入后点击右上角 **EN** 按钮切换） |

> 中英文版本共用同一地址，通过右上角语言切换按钮进行切换。

## 平台架构

按照 **"供应链层 → 数据链层 → 监测平台层 → 披露输出层"** 四层架构建设。

### 核心功能

| 模块 | 说明 |
|------|------|
| 平台总览 | 关键指标概览、碳排放趋势、风险分布 |
| 供应链地图 | Tier 1-3 供应商分布、桑基图流向 |
| 供应商ESG档案 | 一企一档、雷达图画像、审计得分对比 |
| 碳排放仪表盘 | Scope 1/2/3 趋势图、碳强度排名、排放结构 |
| 环境绩效看板 | 水耗/能耗/固废/化学品排名、层级雷达图 |
| 风险热力图 | ESG风险矩阵、旭日图、红黄绿预警名单 |
| CAP整改追踪 | 整改状态分布、完成率仪表盘、时间线详情 |
| 披露输出模块 | 年度报告/投资者/消费者三种视图 |

## 本地运行

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build
npm run deploy
```
