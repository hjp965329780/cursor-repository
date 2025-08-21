// Content Script for Text Translation Chrome Extension
import './content.css'

interface TranslationPopup {
  element: HTMLDivElement
  show: (text: string, event: Event) => void
  hide: () => void
  translate: (text: string) => Promise<void>
}

class TextTranslationContent {
  private popup: TranslationPopup | null = null
  private selectedText = ''
  private isPopupVisible = false

  constructor() {
    this.init()
  }

  private init() {
    try {
      this.createTranslationPopup()
      this.bindEvents()
      this.setupMessageListener()
      console.log('TextTranslationContent initialized successfully')
    } catch (error) {
      console.error('Failed to initialize TextTranslationContent:', error)
    }
  }

  private createTranslationPopup() {
    const popup = document.createElement('div')
    popup.id = 'text-translator-popup'
    popup.className = 'text-translator-popup'

    popup.innerHTML = `
      <div class="popup-header">
        <span>文本翻译</span>
        <button class="close-btn">×</button>
      </div>
      <div class="popup-content">
        <div class="original-text"></div>
        <div class="translation-result"></div>
        <div class="popup-actions">
          <button class="translate-btn">翻译</button>
          <button class="copy-btn">复制</button>
        </div>
        <div class="loading">翻译中...</div>
      </div>
    `

    document.body.appendChild(popup)

    // 绑定弹窗事件
    const closeBtn = popup.querySelector('.close-btn') as HTMLButtonElement
    const translateBtn = popup.querySelector('.translate-btn') as HTMLButtonElement
    const copyBtn = popup.querySelector('.copy-btn') as HTMLButtonElement

    closeBtn.addEventListener('click', () => this.hidePopup())
    translateBtn.addEventListener('click', () => this.translateSelectedText())
    copyBtn.addEventListener('click', () => this.copyTranslation())

    this.popup = {
      element: popup,
      show: this.showPopup.bind(this),
      hide: this.hidePopup.bind(this),
      translate: this.translateSelectedText.bind(this)
    }
  }

  private setupMessageListener() {
    // 监听来自background script的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Content script received message:', message)
      
      try {
        switch (message.type) {
          case 'SHOW_TRANSLATION_POPUP':
            if (message.text) {
              this.selectedText = message.text
              // 创建一个模拟的Event对象
              const mockEvent = {
                target: document.body
              } as unknown as Event
              this.showPopup(message.text, mockEvent)
            }
            sendResponse({ success: true })
            break
            
          case 'TRANSLATE_CURRENT_SELECTION':
            const selection = window.getSelection()
            if (selection && selection.toString().trim()) {
              this.selectedText = selection.toString().trim()
              this.translateSelectedText()
            }
            sendResponse({ success: true })
            break
            
          default:
            console.log('Unknown message type:', message.type)
            sendResponse({ success: false, error: 'Unknown message type' })
        }
      } catch (error) {
        console.error('Message handling error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        sendResponse({ success: false, error: errorMessage })
      }
      
      return true // 保持消息通道开放
    })
  }

  private bindEvents() {
    // 监听文本选择事件
    document.addEventListener('mouseup', this.handleTextSelection.bind(this))
    document.addEventListener('keyup', this.handleTextSelection.bind(this))
    
    // 监听点击事件，隐藏弹窗
    document.addEventListener('click', this.handleDocumentClick.bind(this))
    
    // 监听键盘事件
    document.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  private handleTextSelection(event: Event) {
    try {
      const selection = window.getSelection()
      if (!selection) return

      const selectedText = selection.toString().trim()
      
      if (selectedText && selectedText.length > 0) {
        this.selectedText = selectedText
        this.showPopup(selectedText, event)
      } else {
        this.hidePopup()
      }
    } catch (error) {
      console.error('Text selection handling error:', error)
    }
  }

  private handleDocumentClick(event: Event) {
    try {
      const target = event.target as HTMLElement
      if (target && !target.closest('#text-translator-popup')) {
        this.hidePopup()
      }
    } catch (error) {
      console.error('Document click handling error:', error)
    }
  }

  private handleKeydown(event: KeyboardEvent) {
    try {
      // ESC键隐藏弹窗
      if (event.key === 'Escape') {
        this.hidePopup()
      }
      
      // Ctrl+T 快速翻译选中的文本
      if (event.ctrlKey && event.key === 't') {
        event.preventDefault()
        const selection = window.getSelection()
        if (selection && selection.toString().trim()) {
          this.translateSelectedText()
        }
      }
    } catch (error) {
      console.error('Keydown handling error:', error)
    }
  }

  private showPopup(text: string, event: Event) {
    try {
      if (!this.popup || !text) return

      const popup = this.popup.element
      const originalText = popup.querySelector('.original-text') as HTMLElement
      const translationResult = popup.querySelector('.translation-result') as HTMLElement
      const loading = popup.querySelector('.loading') as HTMLElement

      // 设置原文
      originalText.textContent = text
      
      // 隐藏翻译结果和加载状态
      translationResult.style.display = 'none'
      loading.style.display = 'none'

      // 计算弹窗位置
      let x = 100, y = 100
      if (event.target && (event.target as HTMLElement).getBoundingClientRect) {
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        x = Math.min(rect.left, window.innerWidth - 320)
        y = rect.bottom + 10
      }

      // 显示弹窗
      popup.style.left = `${x}px`
      popup.style.top = `${y}px`
      popup.style.display = 'block'
      
      this.isPopupVisible = true
    } catch (error) {
      console.error('Show popup error:', error)
    }
  }

  private hidePopup() {
    try {
      if (!this.popup) return
      
      this.popup.element.style.display = 'none'
      this.isPopupVisible = false
      this.selectedText = ''
    } catch (error) {
      console.error('Hide popup error:', error)
    }
  }

  private async translateSelectedText() {
    try {
      if (!this.popup || !this.selectedText) return

      const popup = this.popup.element
      const translationResult = popup.querySelector('.translation-result') as HTMLElement
      const loading = popup.querySelector('.loading') as HTMLElement
      const translateBtn = popup.querySelector('.translate-btn') as HTMLButtonElement

      // 显示加载状态
      loading.style.display = 'block'
      translationResult.style.display = 'none'
      translateBtn.disabled = true

      try {
        // 获取用户设置
        const settings = await chrome.storage.sync.get('userSettings')
        const targetLanguage = settings.userSettings?.targetLanguage || 'zh'

        // 调用翻译API
        const translatedText = await this.callTranslationAPI(this.selectedText, targetLanguage)
        
        // 显示翻译结果
        translationResult.textContent = translatedText
        translationResult.style.display = 'block'
        
      } catch (error) {
        console.error('Translation error:', error)
        translationResult.textContent = '翻译失败，请重试'
        translationResult.style.display = 'block'
      } finally {
        loading.style.display = 'none'
        translateBtn.disabled = false
      }
    } catch (error) {
      console.error('Translate selected text error:', error)
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

  private async copyTranslation() {
    try {
      if (!this.popup) return

      const translationResult = this.popup.element.querySelector('.translation-result') as HTMLElement
      const text = translationResult.textContent

      if (text && text !== '翻译失败，请重试') {
        try {
          await navigator.clipboard.writeText(text)
          this.showCopySuccess()
        } catch (error) {
          console.error('Copy failed:', error)
          this.showCopyError()
        }
      }
    } catch (error) {
      console.error('Copy translation error:', error)
    }
  }

  private showCopySuccess() {
    try {
      const copyBtn = this.popup?.element.querySelector('.copy-btn') as HTMLButtonElement
      if (copyBtn) {
        const originalText = copyBtn.textContent
        copyBtn.textContent = '已复制!'
        copyBtn.style.background = '#28a745'
        
        setTimeout(() => {
          copyBtn.textContent = originalText
          copyBtn.style.background = '#6c757d'
        }, 2000)
      }
    } catch (error) {
      console.error('Show copy success error:', error)
    }
  }

  private showCopyError() {
    try {
      const copyBtn = this.popup?.element.querySelector('.copy-btn') as HTMLButtonElement
      if (copyBtn) {
        const originalText = copyBtn.textContent
        copyBtn.textContent = '复制失败'
        copyBtn.style.background = '#dc3545'
        
        setTimeout(() => {
          copyBtn.textContent = originalText
          copyBtn.style.background = '#6c757d'
        }, 2000)
      }
    } catch (error) {
      console.error('Show copy error error:', error)
    }
  }
}

// 初始化内容脚本
try {
  new TextTranslationContent()
} catch (error) {
  console.error('Failed to create TextTranslationContent instance:', error)
}
