#!/bin/bash

echo "🚀 准备推送到GitHub..."

# 检查Git状态
if ! git status --porcelain | grep -q .; then
    echo "✅ 工作目录是干净的，没有未提交的更改"
else
    echo "📝 检测到未提交的更改，请先提交或暂存更改"
    git status --short
    echo ""
    echo "请选择操作："
    echo "1. 提交所有更改"
    echo "2. 暂存所有更改"
    echo "3. 退出"
    read -p "请输入选择 (1-3): " choice
    
    case $choice in
        1)
            echo "📝 提交所有更改..."
            git add .
            read -p "请输入提交信息: " commit_message
            git commit -m "$commit_message"
            ;;
        2)
            echo "📦 暂存所有更改..."
            git add .
            ;;
        3)
            echo "❌ 退出操作"
            exit 0
            ;;
        *)
            echo "❌ 无效选择，退出"
            exit 1
            ;;
    esac
fi

# 检查远程仓库
if ! git remote | grep -q origin; then
    echo "❌ 未找到远程仓库 'origin'"
    echo "请先添加远程仓库："
    echo "git remote add origin <your-github-repo-url>"
    exit 1
fi

# 获取当前分支
current_branch=$(git branch --show-current)
echo "📍 当前分支: $current_branch"

# 检查是否需要设置上游分支
if ! git branch -vv | grep -q "origin/$current_branch"; then
    echo "🔗 设置上游分支..."
    git push --set-upstream origin "$current_branch"
else
    echo "✅ 上游分支已设置"
fi

# 推送到GitHub
echo "🚀 推送到GitHub..."
if git push origin "$current_branch"; then
    echo "✅ 推送成功！"
    echo ""
    echo "🎉 你的代码已经成功推送到GitHub！"
    echo "🔗 查看仓库: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')"
    
    # 检查是否需要创建Pull Request
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
        echo ""
        echo "📋 检测到你在功能分支上，是否需要创建Pull Request？"
        read -p "创建Pull Request? (y/n): " create_pr
        
        if [[ $create_pr =~ ^[Yy]$ ]]; then
            echo "🔗 创建Pull Request..."
            base_branch=$(git remote show origin | grep 'HEAD branch' | cut -d' ' -f5)
            repo_url=$(git config --get remote.origin.url | sed 's/\.git$//')
            pr_url="$repo_url/compare/$base_branch...$current_branch"
            echo "📝 请访问以下链接创建Pull Request:"
            echo "$pr_url"
        fi
    fi
else
    echo "❌ 推送失败！"
    echo "请检查："
    echo "1. 网络连接"
    echo "2. GitHub认证"
    echo "3. 远程仓库权限"
    exit 1
fi

echo ""
echo "🎯 下一步建议："
echo "1. 在GitHub上查看推送的代码"
echo "2. 创建Issue报告问题或请求功能"
echo "3. 创建Pull Request贡献代码"
echo "4. 添加项目描述和标签"
echo "5. 设置GitHub Pages（如果需要）"
