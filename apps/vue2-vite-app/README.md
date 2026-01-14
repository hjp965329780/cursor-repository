# Vue 2 + Vite 应用

这是一个使用 Vue 2.7.16 和 Vite 构建的简单示例应用。

## 特性

- ⚡️ 极速的热模块替换（HMR）
- 📦 优化的构建打包
- 🛠️ 简洁的配置

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 自动打开。

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 项目结构

```
vue2-vite-app/
├── src/
│   ├── components/
│   │   └── HelloWorld.vue    # 示例组件
│   ├── assets/
│   │   └── logo.png          # Vue logo
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── index.html                # HTML 模板
├── vite.config.js            # Vite 配置
└── package.json              # 项目配置
```

## 技术栈

- Vue 2.7.16
- Vite 5.0.0
- vite-plugin-vue2 2.0.3

## 参考文档

- [Vue 2 官方文档](https://v2.vuejs.org)
- [Vite 官方文档](https://vitejs.dev)
- [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)


