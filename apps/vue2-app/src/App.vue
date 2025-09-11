<template>
  <div id="app">
    <h1>Vue2 App with Monorepo Packages</h1>
    <BaseButton @click="onClick">点我</BaseButton>
    <p>{{ message }}</p>
    
    <div style="margin-top: 20px;">
      <h3>多选组件示例</h3>
      <MultiSelect 
        v-model="selectedItems" 
        :options="selectOptions"
        placeholder="请选择多个选项"
        @change="onSelectChange"
      />
      <p style="margin-top: 10px;">
        已选择: {{ selectedItems.join(', ') || '无' }}
      </p>
    </div>
  </div>
</template>

<script>
import { BaseButton } from '@repo/ui-components'
import { greet } from '@repo/utils'
import { vueModel } from '@hjp/vue-model'
import MultiSelect from './components/MultiSelect.vue'

export default {
  name: 'App',
  components: { 
    BaseButton,
    MultiSelect
  },
  data() {
    return { 
      message: '',
      selectedItems: [],
      selectOptions: [
        { value: 'option1', label: '选项一' },
        { value: 'option2', label: '选项二' },
        { value: 'option3', label: '选项三' },
        { value: 'option4', label: '选项四' },
        { value: 'option5', label: '选项五' }
      ]
    }
  },
  mounted() {
    console.log(vueModel)
    this.message = greet('Monorepo')
  },
  methods: {
    onClick() { 
      this.message = greet('Clicked') 
    },
    onSelectChange(value) {
      console.log('选择发生变化:', value)
    }
  }
}
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; padding: 24px; }
</style>
