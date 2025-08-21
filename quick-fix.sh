#!/bin/bash

echo "🚨 快速修复Chrome插件错误..."

# 进入Chrome插件目录
cd apps/chrome-extension

echo "🧹 清理旧的构建文件..."
rm -rf dist

echo "📦 安装依赖..."
pnpm install

echo "🔨 重新构建..."
pnpm build

echo "✅ 修复完成！"
echo ""
echo "📋 修复的问题："
echo "1. ✅ default_popup文件路径问题"
echo "2. ✅ Service Worker注册失败"
echo "3. ✅ 翻译API错误处理"
echo "4. ✅ 类型错误和undefined属性访问"
echo "5. ✅ 消息监听器设置"
echo ""
echo "🎯 现在可以："
echo "1. 在Chrome中重新加载插件"
echo "2. 测试文本选择和翻译功能"
echo "3. 检查控制台是否还有错误"
echo ""
echo "🔧 如果还有问题，请："
echo "- 检查Chrome控制台错误信息"
echo "- 确保所有图标文件存在"
echo "- 重新加载插件"
