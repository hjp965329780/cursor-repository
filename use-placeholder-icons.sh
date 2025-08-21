#!/bin/bash

echo "🔄 使用占位符图标..."

# 进入Chrome插件目录
cd apps/chrome-extension

# 确保icons目录存在
mkdir -p public/icons

echo "📝 创建简单的PNG图标文件..."

# 使用base64编码创建简单的PNG图标
# 这是一个1x1像素的透明PNG文件
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/icons/icon16.png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/icons/icon32.png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/icons/icon48.png
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/icons/icon128.png

echo "✅ 占位符图标创建完成！"
echo ""
echo "⚠️  注意：这些是1x1像素的透明图标，仅用于测试"
echo "🎨 建议后续替换为正式的图标文件"
echo ""
echo "🔧 现在可以构建插件了："
echo "pnpm build"
