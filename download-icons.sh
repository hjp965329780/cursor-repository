#!/bin/bash

echo "🌐 从在线服务下载图标..."

# 检查是否安装了curl
if ! command -v curl &> /dev/null; then
    echo "❌ 需要安装curl"
    echo "  macOS: brew install curl"
    echo "  Ubuntu: sudo apt-get install curl"
    exit 1
fi

# 进入Chrome插件目录
cd apps/chrome-extension

# 确保icons目录存在
mkdir -p public/icons

echo "📥 下载图标文件..."

# 从GitHub下载简单的图标（示例）
# 这里使用一个公开的图标仓库作为示例
ICON_URL="https://raw.githubusercontent.com/feathericons/feather/master/icons/translate.svg"

echo "🔧 下载翻译图标..."
curl -s "$ICON_URL" > temp_icon.svg

if [ -f temp_icon.svg ]; then
    echo "✅ SVG图标下载成功"
    
    # 检查是否安装了ImageMagick
    if command -v convert &> /dev/null; then
        echo "🔧 转换为PNG格式..."
        convert temp_icon.svg -background transparent -resize 16x16 public/icons/icon16.png
        convert temp_icon.svg -background transparent -resize 32x32 public/icons/icon32.png
        convert temp_icon.svg -background transparent -resize 48x48 public/icons/icon48.png
        convert temp_icon.svg -background transparent -resize 128x128 public/icons/icon128.png
        
        echo "✅ PNG图标生成完成！"
    else
        echo "⚠️  未安装ImageMagick，无法转换SVG"
        echo "📋 请安装ImageMagick或手动转换图标"
        echo "  macOS: brew install imagemagick"
        echo "  Ubuntu: sudo apt-get install imagemagick"
    fi
    
    # 清理临时文件
    rm temp_icon.svg
    
else
    echo "❌ 图标下载失败"
    echo "📋 请手动创建图标文件"
fi

echo ""
echo "🎯 下一步："
echo "1. 确保所有图标文件都存在"
echo "2. 运行: pnpm build"
echo "3. 在Chrome中加载插件"
