#!/bin/bash

echo "🎨 创建Chrome插件图标..."

# 检查是否安装了ImageMagick
if command -v convert &> /dev/null; then
    echo "✅ 检测到ImageMagick，开始生成图标..."
    
    # 创建临时SVG图标
    cat > temp_icon.svg << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#667eea" rx="20"/>
  <text x="64" y="80" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">T</text>
  <circle cx="64" cy="40" r="8" fill="white"/>
</svg>
EOF
    
    # 生成不同尺寸的图标
    echo "🔧 生成16x16图标..."
    convert temp_icon.svg -resize 16x16 apps/chrome-extension/public/icons/icon16.png
    
    echo "🔧 生成32x32图标..."
    convert temp_icon.svg -resize 32x32 apps/chrome-extension/public/icons/icon32.png
    
    echo "🔧 生成48x48图标..."
    convert temp_icon.svg -resize 48x48 apps/chrome-extension/public/icons/icon48.png
    
    echo "🔧 生成128x128图标..."
    convert temp_icon.svg -resize 128x128 apps/chrome-extension/public/icons/icon128.png
    
    # 清理临时文件
    rm temp_icon.svg
    
    echo "✅ 图标生成完成！"
    
else
    echo "⚠️  未检测到ImageMagick"
    echo "📋 请选择以下方案之一："
    echo ""
    echo "方案1：安装ImageMagick"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: 下载并安装ImageMagick"
    echo ""
    echo "方案2：手动创建图标"
    echo "  1. 使用在线工具：https://www.favicon-generator.org/"
    echo "  2. 使用设计软件：Figma, Photoshop, GIMP"
    echo "  3. 下载免费图标：https://www.flaticon.com/"
    echo ""
    echo "方案3：使用占位符图标"
    echo "  运行: ./use-placeholder-icons.sh"
fi

echo ""
echo "🎯 下一步："
echo "1. 确保所有图标文件都存在"
echo "2. 运行: cd apps/chrome-extension && pnpm build"
echo "3. 在Chrome中加载插件"
