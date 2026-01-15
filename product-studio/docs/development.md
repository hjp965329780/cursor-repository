# 开发与测试指南

## 1. 开发环境搭建

### 前置要求
- Node.js >= 18
- pnpm (推荐) 或 npm

### 一键启动
在 `product-studio` 根目录下（如果配置了 workspace 脚本）或分别进入各目录启动：

1. **启动后端**:
   ```bash
   cd backend
   npm run dev
   ```

2. **启动管理台**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **SDK 开发与调试**:
   ```bash
   cd sdk
   npm run dev
   ```
   SDK 的 dev 模式会启动一个包含宿主环境演示的 Playground 页面。

## 2. 测试策略

### 单元测试
- **SDK**: 使用 Vitest 进行组件和工具函数的测试。
- **Backend**: 使用 Jest 或 Supertest 测试 API 接口逻辑。

### 集成测试
- 在 Playground 中模拟完整用户流程：初始化 -> 编辑 -> 保存 -> 刷新 -> 预览。

### 自动化测试 (规划中)
- 引入 Cypress 或 Playwright 进行 E2E 测试，覆盖从管理台创建应用到 SDK 渲染的全流程。

## 3. 性能优化建议

1. **SDK 体积优化**: 
   - 确保 `dependencies` 和 `devDependencies` 正确分离。
   - 使用 Rollup/Vite 的 Tree Shaking 功能。
2. **资源加载**: 
   - 考虑将 SDK 样式内联或作为单独 CSS 文件异步加载。
3. **API 缓存**: 
   - 后端可对 `GET /api/config/:appId` 接口增加 Redis 缓存或 HTTP 缓存头 (`Cache-Control`)。

## 4. 安全合规要求

1. **数据传输**: 所有 API 调用必须通过 HTTPS。
2. **API Key 验证**: 未来版本应增加 API Key 校验机制，防止未授权的配置修改。
3. **XSS 防护**: SDK 在渲染用户配置的内容（如引导文字）时，需进行 HTML 转义，防止 XSS 攻击。
4. **权限控制**: 管理平台应增加用户登录与角色管理（RBAC）。
