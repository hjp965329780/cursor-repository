import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TranslationResult {
  original: string
  translated: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: number
}

export const useTranslationStore = defineStore('translation', () => {
  const isTranslating = ref(false)
  const lastTranslation = ref<TranslationResult | null>(null)
  const translationCount = ref(0)

  // 翻译文本的主要方法
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (!text.trim()) {
      throw new Error('请输入要翻译的文本')
    }

    isTranslating.value = true
    translationCount.value++

    try {
      // 检测源语言
      const sourceLang = await detectLanguage(text)
      
      // 调用翻译API
      const translatedText = await callTranslationAPI(text, sourceLang, targetLang)
      
      // 保存翻译结果
      const result: TranslationResult = {
        original: text,
        translated: translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        timestamp: Date.now()
      }
      
      lastTranslation.value = result
      
      return translatedText
    } catch (error) {
      console.error('Translation error:', error)
      throw new Error(`翻译失败: ${error.message}`)
    } finally {
      isTranslating.value = false
    }
  }

  // 检测文本语言
  const detectLanguage = async (text: string): Promise<string> => {
    // 简单的语言检测逻辑
    const chineseRegex = /[\u4e00-\u9fff]/
    const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/
    const koreanRegex = /[\uac00-\ud7af]/
    
    if (chineseRegex.test(text)) return 'zh'
    if (japaneseRegex.test(text)) return 'ja'
    if (koreanRegex.test(text)) return 'ko'
    
    // 默认认为是英文
    return 'en'
  }

  // 调用翻译API
  const callTranslationAPI = async (
    text: string, 
    sourceLang: string, 
    targetLang: string
  ): Promise<string> => {
    // 这里使用免费的翻译API，你可以替换为其他服务
    // 例如：Google Translate API, DeepL API, 百度翻译API等
    
    try {
      // 使用免费的LibreTranslate API
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
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
      
      // 如果API调用失败，返回原文
      // 在实际应用中，你可能想要使用备用翻译服务
      return `[翻译失败] ${text}`
    }
  }

  // 批量翻译
  const translateBatch = async (
    texts: string[], 
    targetLang: string
  ): Promise<string[]> => {
    const results: string[] = []
    
    for (const text of texts) {
      try {
        const result = await translateText(text, targetLang)
        results.push(result)
      } catch (error) {
        results.push(`[翻译失败] ${text}`)
      }
    }
    
    return results
  }

  // 获取翻译统计
  const getTranslationStats = () => {
    return {
      totalTranslations: translationCount.value,
      lastTranslation: lastTranslation.value,
      isTranslating: isTranslating.value
    }
  }

  // 重置状态
  const reset = () => {
    isTranslating.value = false
    lastTranslation.value = null
    translationCount.value = 0
  }

  return {
    // 状态
    isTranslating,
    lastTranslation,
    translationCount,
    
    // 方法
    translateText,
    translateBatch,
    detectLanguage,
    getTranslationStats,
    reset
  }
})
