# 🌍 Text Translator Chrome Extension

一个功能强大的Chrome浏览器扩展，支持选中网页文本并翻译成中文。

[![Build Status](https://github.com/YOUR_USERNAME/cursor-repository/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/YOUR_USERNAME/cursor-repository/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.0-green.svg)](https://chrome.google.com/webstore/detail/text-translator)
[![pnpm](https://img.shields.io/badge/pnpm-8.15.0-orange.svg)](https://pnpm.io/)

## ✨ 功能特性

- 🎯 **智能文本选择** - 选中任意网页文本进行翻译
- 🌍 **多语言支持** - 支持多种语言翻译成中文
- 🚀 **快速翻译** - 右键菜单和快捷键支持
- 💾 **翻译历史** - 保存翻译记录，方便查看
- ⚙️ **个性化设置** - 自定义翻译语言和界面主题
- 📱 **响应式设计** - 适配不同屏幕尺寸

## 🏗️ 项目架构

```
cursor-repository/
├── apps/
│   └── chrome-extension/          # Chrome扩展主项目
│       ├── src/
│       │   ├── popup/            # 弹窗界面
│       │   ├── content/          # 内容脚本
│       │   ├── background/       # 后台脚本
│       │   └── stores/           # 状态管理
│       ├── public/               # 静态资源
│       └── dist/                 # 构建输出
├── packages/                      # 共享包（预留）
├── .github/                       # GitHub配置
├── docs/                          # 文档
└── scripts/                       # 构建脚本
```

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- pnpm 8.15.0 或更高版本
- Chrome 88+ 浏览器

### 安装依赖

```bash
# 安装pnpm（如果未安装）
npm install -g pnpm@8.15.0

# 安装项目依赖
pnpm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 清理构建文件
pnpm clean
```

### 安装扩展

1. 构建扩展：`pnpm build`
2. 打开Chrome，访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `apps/chrome-extension/dist` 目录

## 📖 使用说明

### 基本翻译

1. **选择文本** - 在任意网页上选中要翻译的文本
2. **自动弹窗** - 翻译弹窗会自动显示
3. **点击翻译** - 点击"翻译"按钮获取结果
4. **复制结果** - 点击"复制"按钮复制翻译结果

### 快捷键

- `Ctrl+T` - 翻译当前选中的文本
- `ESC` - 关闭翻译弹窗

### 右键菜单

- 选中文本后右键，选择"翻译选中文本"

## 🔧 配置选项

### 翻译设置

- **目标语言** - 设置翻译目标语言（默认：中文）
- **自动翻译** - 启用/禁用自动翻译功能
- **翻译服务** - 选择翻译API服务商

### 界面设置

- **主题** - 选择浅色/深色主题
- **字体大小** - 调整界面字体大小
- **弹窗位置** - 自定义弹窗显示位置

## 🛠️ 技术栈

- **前端框架** - Vue 3 + TypeScript
- **构建工具** - Vite
- **包管理** - pnpm + Monorepo
- **状态管理** - Pinia
- **样式** - CSS3 + 响应式设计
- **API** - LibreTranslate / Google Translate

## 📁 项目结构

```
src/
├── popup/                 # 弹窗界面
│   ├── App.vue           # 主组件
│   ├── main.ts           # 入口文件
│   └── style.css         # 样式文件
├── content/               # 内容脚本
│   ├── content.ts        # 主要逻辑
│   └── content.css       # 弹窗样式
├── background/            # 后台脚本
│   └── background.ts     # 服务工作者
└── stores/                # 状态管理
    ├── translation.ts     # 翻译状态
    └── settings.ts        # 设置状态
```

## 🧪 测试

### 手动测试

```bash
# 构建扩展
pnpm build

# 在Chrome中加载并测试
# 测试不同网站的文本选择
# 测试各种文本长度
# 测试错误场景
```

### 自动化测试

```bash
# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint

# 运行测试（如果配置了）
pnpm test
```

## 📦 构建和部署

### 开发构建

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 发布到Chrome Web Store

1. 构建生产版本：`pnpm build`
2. 打包扩展：`pnpm package`
3. 上传到Chrome Web Store开发者控制台

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

### 贡献方式

- 🐛 报告Bug
- 💡 请求新功能
- 📝 改进文档
- 🔧 提交代码
- 🧪 编写测试

### 开发流程

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [LibreTranslate](https://libretranslate.com/) - 开源翻译服务
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - Chrome扩展开发文档

## 📞 联系我们

- 🐛 问题反馈：[GitHub Issues](https://github.com/YOUR_USERNAME/cursor-repository/issues)
- 💬 讨论交流：[GitHub Discussions](https://github.com/YOUR_USERNAME/cursor-repository/discussions)
- 📧 邮件联系：[your-email@example.com]

## 🌟 支持我们

如果这个项目对你有帮助，请给我们一个 ⭐️ Star！

---

**Made with ❤️ by the Text Translator Team**
