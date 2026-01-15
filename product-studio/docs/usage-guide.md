# 使用指南

## 1. SDK 集成指南

### 1.1 引入 SDK

在您的 HTML 文件中引入 SDK（开发环境下可直接引用构建产物，生产环境建议使用 CDN）。

```html
<script type="module">
  import { init } from 'path/to/product-studio.js';
  
  init({
    appId: 'YOUR_APP_ID',
    apiEndpoint: 'http://localhost:3000/api' // 可选，默认为生产环境 API 地址
  });
</script>
```

### 1.2 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `appId` | string | 是 | 在管理平台申请的应用唯一标识 |
| `apiEndpoint` | string | 否 | 后端 API 地址 |
| `containerId` | string | 否 | SDK 挂载的 DOM 容器 ID |

### 1.3 开启编辑模式
SDK 默认加载配置并展示。若配置为空，或处于开发环境，SDK 可能会显示编辑入口（取决于具体实现逻辑，目前逻辑为：有配置则进入预览，否则进入编辑模式）。

## 2. 前端管理平台使用

### 2.1 部署与启动
```bash
cd frontend
npm install
npm run dev
```
访问地址：`http://localhost:5173` (或 Vite 分配的端口)

### 2.2 功能操作
1. **创建应用**: 点击 "Create App"，输入应用名称。
2. **获取 AppId**: 在应用列表中复制 App ID。
3. **集成代码**: 点击 "Details" 查看集成代码片段。

## 3. 后端服务配置与运维

### 3.1 安装与配置
```bash
cd backend
npm install
# 初始化数据库
npx prisma generate
npx prisma db push
```

### 3.2 启动服务
```bash
npm run dev
```
API 服务默认运行在 `http://localhost:3000`。

### 3.3 常见问题排查

- **Q: SDK 无法加载配置？**
  - A: 检查 Network 面板，确认 `apiEndpoint` 是否正确，以及是否存在跨域 (CORS) 问题。

- **Q: 数据库连接失败？**
  - A: 检查 `prisma/schema.prisma` 中的数据库路径配置，确保存储目录有写入权限。
