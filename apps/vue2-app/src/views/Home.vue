<template>
  <div class="home">
    <h1>欢迎来到首页</h1>
    <p>这是Vue2应用的主页</p>
    
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
    
    <div style="margin-top: 20px;">
      <BaseButton @click="onClick">点击我</BaseButton>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { BaseButton } from '@repo/ui-components'
import { greet } from '@repo/utils'
import MultiSelect from '../components/MultiSelect.vue'
import model from './model'

export default {
  name: 'Home',
  models: {model},
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
    this.message = greet('首页')
  },
  methods: {
    onClick() { 
      console.log('onClick', this.model)
      this.message = greet('点击了按钮') 
    },
    onSelectChange(value) {
      console.log('选择发生变化:', value)
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

h3 {
  color: #34495e;
  margin-bottom: 15px;
}
</style>
