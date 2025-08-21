#!/bin/bash

echo "🔧 修复Chrome插件构建问题..."

# 进入Chrome插件目录
cd apps/chrome-extension

echo "📦 安装依赖..."
pnpm install

echo "🧹 清理旧的构建文件..."
rm -rf dist

echo "🔨 重新构建..."
pnpm build

echo "✅ 修复完成！"
echo ""
echo "📋 现在可以："
echo "1. 在Chrome中加载 dist 目录"
echo "2. 或者运行 pnpm dev 进行开发"
echo ""
echo "🎯 如果还有问题，请检查："
echo "- 所有依赖是否正确安装"
echo "- TypeScript编译是否成功"
echo "- 文件路径是否正确"
