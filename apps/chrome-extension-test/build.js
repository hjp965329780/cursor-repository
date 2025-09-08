import { copyFile, mkdir, readdir, stat } from 'fs/promises'
import { resolve, join } from 'path'

async function copyDirectory(src, dest) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await copyFile(srcPath, destPath)
    }
  }
}

async function build() {
  try {
    console.log('🔨 开始构建Chrome插件...')
    
    // 确保dist目录存在
    await mkdir('dist', { recursive: true })
    
    // 复制manifest.json
    await copyFile(
      resolve('public/manifest.json'),
      resolve('dist/manifest.json')
    )
    console.log('✅ 复制 manifest.json')
    
    // 复制图标目录（如果存在）
    try {
      await copyDirectory(
        resolve('public/icons'),
        resolve('dist/icons')
      )
      console.log('✅ 复制图标文件')
    } catch (error) {
      console.log('⚠️  图标目录不存在，跳过')
    }
    
    console.log('')
    console.log('🎉 构建完成！')
    console.log('📁 文件已复制到 dist/ 目录')
    console.log('🔧 现在可以在Chrome中加载插件了')
    console.log('')
    console.log('📋 下一步：')
    console.log('1. 打开Chrome浏览器')
    console.log('2. 访问 chrome://extensions/')
    console.log('3. 开启"开发者模式"')
    console.log('4. 点击"加载已解压的扩展程序"')
    console.log('5. 选择 dist 目录')
    
  } catch (error) {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  }
}

build()
