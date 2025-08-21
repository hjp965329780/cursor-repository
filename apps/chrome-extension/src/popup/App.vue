<template>
  <div class="app">
    <header class="header">
      <h1>文本翻译器</h1>
      <div class="language-selector">
        <select v-model="targetLanguage" @change="onLanguageChange">
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>
    </header>

    <main class="main">
      <div class="input-section">
        <textarea
          v-model="inputText"
          placeholder="输入要翻译的文本..."
          class="input-textarea"
          @input="onInputChange"
        ></textarea>
        <div class="button-group">
          <button @click="translateText" :disabled="!inputText.trim()" class="translate-btn">
            翻译
          </button>
          <button @click="clearText" class="clear-btn">清空</button>
        </div>
      </div>

      <div class="result-section" v-if="translationResult">
        <h3>翻译结果:</h3>
        <div class="result-text">{{ translationResult }}</div>
        <div class="result-actions">
          <button @click="copyResult" class="copy-btn">复制</button>
          <button @click="speakResult" class="speak-btn">朗读</button>
        </div>
      </div>

      <div class="history-section" v-if="translationHistory.length > 0">
        <h3>翻译历史:</h3>
        <div class="history-list">
          <div
            v-for="(item, index) in translationHistory"
            :key="index"
            class="history-item"
            @click="loadHistoryItem(item)"
          >
            <div class="history-original">{{ item.original }}</div>
            <div class="history-translated">{{ item.translated }}</div>
            <div class="history-time">{{ formatTime(item.timestamp) }}</div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="status">{{ status }}</div>
      <button @click="openOptions" class="options-btn">设置</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTranslationStore } from '@/stores/translation'
import { useSettingsStore } from '@/stores/settings'

const translationStore = useTranslationStore()
const settingsStore = useSettingsStore()

const inputText = ref('')
const targetLanguage = ref('zh')
const translationResult = ref('')
const status = ref('准备就绪')
const translationHistory = ref<Array<{
  original: string
  translated: string
  timestamp: number
}>>([])

onMounted(async () => {
  await settingsStore.loadSettings()
  targetLanguage.value = settingsStore.targetLanguage
  await loadHistory()
})

const onLanguageChange = async () => {
  await settingsStore.updateTargetLanguage(targetLanguage.value)
}

const onInputChange = () => {
  if (inputText.value.trim()) {
    status.value = '输入中...'
  } else {
    status.value = '准备就绪'
  }
}

const translateText = async () => {
  if (!inputText.value.trim()) return

  status.value = '翻译中...'
  try {
    const result = await translationStore.translateText(
      inputText.value,
      targetLanguage.value
    )
    translationResult.value = result
    
    // 保存到历史记录
    await saveToHistory(inputText.value, result)
    await loadHistory()
    
    status.value = '翻译完成'
  } catch (error) {
    status.value = '翻译失败: ' + error.message
  }
}

const clearText = () => {
  inputText.value = ''
  translationResult.value = ''
  status.value = '准备就绪'
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(translationResult.value)
    status.value = '已复制到剪贴板'
  } catch (error) {
    status.value = '复制失败'
  }
}

const speakResult = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(translationResult.value)
    utterance.lang = targetLanguage.value === 'zh' ? 'zh-CN' : targetLanguage.value
    speechSynthesis.speak(utterance)
    status.value = '正在朗读...'
  } else {
    status.value = '浏览器不支持语音朗读'
  }
}

const saveToHistory = async (original: string, translated: string) => {
  const historyItem = {
    original,
    translated,
    timestamp: Date.now()
  }
  
  const history = await chrome.storage.local.get('translationHistory')
  const historyList = history.translationHistory || []
  historyList.unshift(historyItem)
  
  // 只保留最近50条记录
  if (historyList.length > 50) {
    historyList.splice(50)
  }
  
  await chrome.storage.local.set({ translationHistory: historyList })
}

const loadHistory = async () => {
  const history = await chrome.storage.local.get('translationHistory')
  translationHistory.value = history.translationHistory || []
}

const loadHistoryItem = (item: any) => {
  inputText.value = item.original
  translationResult.value = item.translated
  status.value = '已加载历史记录'
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

const openOptions = () => {
  chrome.runtime.openOptionsPage()
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.language-selector select {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.main {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.input-section {
  margin-bottom: 20px;
}

.input-textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.translate-btn, .clear-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.translate-btn {
  background: #007bff;
  color: white;
}

.translate-btn:hover:not(:disabled) {
  background: #0056b3;
}

.translate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
}

.clear-btn:hover {
  background: #545b62;
}

.result-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.result-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #495057;
}

.result-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  min-height: 20px;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.copy-btn, .speak-btn {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover, .speak-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.history-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.history-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #495057;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  padding: 8px;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f8f9fa;
}

.history-item:last-child {
  border-bottom: none;
}

.history-original {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

.history-translated {
  font-size: 14px;
  color: #495057;
  margin-bottom: 4px;
}

.history-time {
  font-size: 10px;
  color: #adb5bd;
}

.footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  font-size: 12px;
  color: #6c757d;
}

.options-btn {
  background: none;
  border: 1px solid #dee2e6;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.options-btn:hover {
  background: #e9ecef;
}
</style>
