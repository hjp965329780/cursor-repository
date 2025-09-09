import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const step = ref(1)

  // 计算属性
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)

  // 动作
  const increment = () => {
    count.value += step.value
  }

  const decrement = () => {
    count.value -= step.value
  }

  const reset = () => {
    count.value = 0
  }

  const setStep = (newStep: number) => {
    step.value = newStep
  }

  return {
    count,
    step,
    doubleCount,
    isEven,
    increment,
    decrement,
    reset,
    setStep
  }
})
