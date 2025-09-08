# 图标文件说明

Chrome插件需要以下尺寸的图标文件：

## 必需的图标尺寸

- `icon16.png` - 16x16 像素
- `icon32.png` - 32x32 像素  
- `icon48.png` - 48x48 像素
- `icon128.png` - 128x128 像素

## 图标位置

将图标文件放置在 `public/icons/` 目录下：

```
public/
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 图标要求

- 格式：PNG（推荐）或SVG
- 背景：透明背景
- 设计：简洁明了，在小尺寸下清晰可辨
- 颜色：与插件主题色调一致

## 临时图标

在开发阶段，你可以：

1. 使用在线图标生成器创建临时图标
2. 从图标库下载合适的图标
3. 使用简单的文字或符号作为占位符

## 推荐图标资源

- [Material Icons](https://fonts.google.com/icons)
- [Feather Icons](https://feathericons.com/)
- [Heroicons](https://heroicons.com/)
- [Font Awesome](https://fontawesome.com/)

## 注意事项

- 图标文件大小应控制在合理范围内
- 确保图标在不同背景下都有良好的可见性
- 遵循Chrome插件的设计规范
