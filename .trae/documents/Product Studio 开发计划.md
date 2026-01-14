# Product Studio 开发计划

将在 `packages/product-studio` 目录下开发面向非技术用户的产品助手 SDK。

## 1. 项目初始化与架构搭建
- [ ] 创建 `packages/product-studio` 目录结构
- [ ] 初始化 `package.json`，配置 TypeScript 和 Vite 构建环境
- [ ] 安装 React、ReactDOM 及相关开发依赖
- [ ] 配置 `pnpm` 工作区依赖

## 2. 核心功能开发
### 2.1 可视化元素选择器 (Inspector)
- [ ] 实现 DOM 元素悬停高亮（Mask Overlay）
- [ ] 实现点击元素锁定，并生成唯一 CSS 选择器路径
- [ ] 阻止宿主页面原生点击事件（在编辑模式下）

### 2.2 引导提示配置系统 (Guide Builder)
- [ ] 开发引导气泡（Popover）组件
- [ ] 实现配置表单：标题、内容、位置（上/下/左/右）、触发条件
- [ ] 实现步骤管理器：支持添加/删除/排序引导步骤

### 2.3 顶部通知条管理 (Banner Manager)
- [ ] 开发顶部通知条 UI 组件
- [ ] 实现通知条配置面板：内容编辑、样式模板选择（Info/Warning/Success）、显隐控制

## 3. 用户界面与交互 (Editor UI)
- [ ] 开发主控制面板（Dock/Sidebar），用于切换模式（预览/编辑）和管理配置列表
- [ ] 实现拖拽式操作体验
- [ ] 添加实时保存反馈机制

## 4. 数据存储与兼容性 (Core)
- [ ] 实现 `ConfigManager`：管理配置数据的读取与写入
- [ ] 实现 `LocalStorageAdapter`：本地持久化存储（模拟后端）
- [ ] 封装 SDK 入口 `init({ ... })`，支持自定义配置

## 5. 验证与演示
- [ ] 在 `packages/product-studio/playground` 或根目录创建一个 Demo 页面
- [ ] 引入编译后的 SDK，验证非技术用户的操作流程（点击、配置、保存、预览）
- [ ] 进行跨浏览器基础兼容性检查
