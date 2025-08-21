import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserSettings {
  targetLanguage: string
  autoTranslate: boolean
  showTranslationPopup: boolean
  translationService: string
  apiKey?: string
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
  enableHistory: boolean
  maxHistoryItems: number
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<UserSettings>({
    targetLanguage: 'zh',
    autoTranslate: false,
    showTranslationPopup: true,
    translationService: 'libretranslate',
    theme: 'auto',
    fontSize: 'medium',
    enableHistory: true,
    maxHistoryItems: 50
  })

  const isLoading = ref(false)

  // 加载设置
  const loadSettings = async () => {
    isLoading.value = true
    try {
      const result = await chrome.storage.sync.get('userSettings')
      if (result.userSettings) {
        settings.value = { ...settings.value, ...result.userSettings }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 保存设置
  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      settings.value = { ...settings.value, ...newSettings }
      await chrome.storage.sync.set({ userSettings: settings.value })
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw new Error('保存设置失败')
    }
  }

  // 更新目标语言
  const updateTargetLanguage = async (language: string) => {
    await saveSettings({ targetLanguage: language })
  }

  // 切换自动翻译
  const toggleAutoTranslate = async () => {
    await saveSettings({ autoTranslate: !settings.value.autoTranslate })
  }

  // 切换翻译弹窗显示
  const toggleTranslationPopup = async () => {
    await saveSettings({ showTranslationPopup: !settings.value.showTranslationPopup })
  }

  // 更新翻译服务
  const updateTranslationService = async (service: string) => {
    await saveSettings({ translationService: service })
  }

  // 更新API密钥
  const updateApiKey = async (apiKey: string) => {
    await saveSettings({ apiKey })
  }

  // 切换主题
  const toggleTheme = async () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(settings.value.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    await saveSettings({ theme: themes[nextIndex] })
  }

  // 更新字体大小
  const updateFontSize = async (size: 'small' | 'medium' | 'large') => {
    await saveSettings({ fontSize: size })
  }

  // 切换历史记录功能
  const toggleHistory = async () => {
    await saveSettings({ enableHistory: !settings.value.enableHistory })
  }

  // 更新最大历史记录数量
  const updateMaxHistoryItems = async (max: number) => {
    await saveSettings({ maxHistoryItems: max })
  }

  // 重置所有设置
  const resetSettings = async () => {
    const defaultSettings: UserSettings = {
      targetLanguage: 'zh',
      autoTranslate: false,
      showTranslationPopup: true,
      translationService: 'libretranslate',
      theme: 'auto',
      fontSize: 'medium',
      enableHistory: true,
      maxHistoryItems: 50
    }
    
    await saveSettings(defaultSettings)
  }

  // 导出设置
  const exportSettings = (): string => {
    return JSON.stringify(settings.value, null, 2)
  }

  // 导入设置
  const importSettings = async (settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson)
      await saveSettings(importedSettings)
    } catch (error) {
      console.error('Failed to import settings:', error)
      throw new Error('导入设置失败：无效的JSON格式')
    }
  }

  // 获取当前主题
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (settings.value.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return settings.value.theme
  }

  // 获取字体大小CSS类
  const getFontSizeClass = (): string => {
    return `font-size-${settings.value.fontSize}`
  }

  return {
    // 状态
    settings,
    isLoading,
    
    // 计算属性
    targetLanguage: () => settings.value.targetLanguage,
    autoTranslate: () => settings.value.autoTranslate,
    showTranslationPopup: () => settings.value.showTranslationPopup,
    translationService: () => settings.value.translationService,
    theme: () => settings.value.theme,
    fontSize: () => settings.value.fontSize,
    enableHistory: () => settings.value.enableHistory,
    maxHistoryItems: () => settings.value.maxHistoryItems,
    
    // 方法
    loadSettings,
    saveSettings,
    updateTargetLanguage,
    toggleAutoTranslate,
    toggleTranslationPopup,
    updateTranslationService,
    updateApiKey,
    toggleTheme,
    updateFontSize,
    toggleHistory,
    updateMaxHistoryItems,
    resetSettings,
    exportSettings,
    importSettings,
    getCurrentTheme,
    getFontSizeClass
  }
})
