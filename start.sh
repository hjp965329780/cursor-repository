#!/bin/bash

echo "🚀 启动 Text Translator Chrome Extension 项目..."

# 检查是否安装了pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装..."
    npm install -g pnpm
fi

echo "📦 安装项目依赖..."
pnpm install

echo "🔨 构建Chrome插件..."
cd apps/chrome-extension
pnpm build

echo "✅ 项目启动完成！"
echo ""
echo "📋 下一步操作："
echo "1. 打开Chrome浏览器"
echo "2. 访问 chrome://extensions/"
echo "3. 开启'开发者模式'"
echo "4. 点击'加载已解压的扩展程序'"
echo "5. 选择 apps/chrome-extension/dist 目录"
echo ""
echo "🎯 开发模式：pnpm dev"
echo "🔨 重新构建：pnpm build"
echo "🧹 清理构建：pnpm clean"
