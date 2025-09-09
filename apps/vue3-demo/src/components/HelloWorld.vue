<template>
  <div class="hello-world">
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button @click="increment" class="btn">
      点击次数: {{ count }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Hello World',
  message: '这是一个 Vue3 + TypeScript 组件示例'
})

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
.hello-world {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  background: white;
}

.hello-world h3 {
  color: #2d3748;
  margin-bottom: 1rem;
}

.hello-world p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}
</style>
