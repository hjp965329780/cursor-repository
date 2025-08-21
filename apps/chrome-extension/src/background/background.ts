// Background Service Worker for Text Translation Chrome Extension

class TextTranslationBackground {
  constructor() {
    this.init()
  }

  private init() {
    this.setupMessageListeners()
    this.setupContextMenus()
    this.setupKeyboardShortcuts()
    this.handleInstall()
  }

  private setupMessageListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Background received message:', request)
      
      switch (request.type) {
        case 'TRANSLATE_TEXT':
          this.handleTranslateRequest(request, sendResponse)
          return true // 保持消息通道开放
          
        case 'GET_SETTINGS':
          this.handleGetSettings(sendResponse)
          return true
          
        case 'UPDATE_SETTINGS':
          this.handleUpdateSettings(request.settings, sendResponse)
          return true
          
        default:
          console.log('Unknown message type:', request.type)
          sendResponse({ success: false, error: 'Unknown message type' })
      }
    })
  }

  private setupContextMenus() {
    try {
      // 检查contextMenus权限是否可用
      if (!chrome.contextMenus) {
        console.warn('contextMenus permission not available')
        return
      }

      // 创建右键菜单
      chrome.contextMenus.create({
        id: 'translate-selection',
        title: '翻译选中文本',
        contexts: ['selection']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to create context menu:', chrome.runtime.lastError)
        } else {
          console.log('Context menu created successfully')
        }
      })

      // 监听右键菜单点击
      chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === 'translate-selection' && info.selectionText && tab?.id) {
          this.translateSelectedText(info.selectionText, tab.id)
        }
      })
    } catch (error) {
      console.error('Failed to setup context menus:', error)
    }
  }

  private setupKeyboardShortcuts() {
    // 设置键盘快捷键
    chrome.commands.onCommand.addListener((command) => {
      console.log('Command received:', command)
      
      if (command === 'translate-selection') {
        this.translateCurrentTabSelection()
      }
    })
  }

  private handleInstall() {
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Extension installed:', details.reason)
      
      if (details.reason === 'install') {
        // 设置默认配置
        chrome.storage.sync.set({
          userSettings: {
            targetLanguage: 'zh',
            autoTranslate: false,
            theme: 'light',
            fontSize: 'medium'
          }
        })
      }
    })
  }

  private async handleTranslateRequest(request: any, sendResponse: (response: any) => void) {
    try {
      const { text, targetLang = 'zh' } = request
      
      if (!text) {
        sendResponse({ success: false, error: 'No text provided' })
        return
      }

      const translatedText = await this.callTranslationAPI(text, targetLang)
      sendResponse({ success: true, translatedText })
      
    } catch (error) {
      console.error('Translation request error:', error)
      sendResponse({ success: false, error: error.message })
    }
  }

  private async handleGetSettings(sendResponse: (response: any) => void) {
    try {
      const result = await chrome.storage.sync.get('userSettings')
      sendResponse({ success: true, settings: result.userSettings || {} })
    } catch (error) {
      console.error('Get settings error:', error)
      sendResponse({ success: false, error: 'Failed to get settings' })
    }
  }

  private async handleUpdateSettings(settings: any, sendResponse: (response: any) => void) {
    try {
      await chrome.storage.sync.set({ userSettings: settings })
      sendResponse({ success: true })
    } catch (error) {
      console.error('Update settings error:', error)
      sendResponse({ success: false, error: 'Failed to update settings' })
    }
  }

  private async translateSelectedText(text: string, tabId: number) {
    try {
      // 向内容脚本发送消息
      await chrome.tabs.sendMessage(tabId, {
        type: 'SHOW_TRANSLATION_POPUP',
        text: text
      })
    } catch (error) {
      console.error('Failed to send message to tab:', error)
    }
  }

  private async translateCurrentTabSelection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TRANSLATE_CURRENT_SELECTION'
        })
      }
    } catch (error) {
      console.error('Failed to translate current selection:', error)
    }
  }

  private async callTranslationAPI(text: string, targetLang: string): Promise<string> {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      return data.translatedText || text
    } catch (error) {
      console.error('Translation API error:', error)
      throw new Error('翻译服务暂时不可用')
    }
  }
}

// 初始化后台脚本
new TextTranslationBackground()
