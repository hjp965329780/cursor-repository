<template>
  <div class="counter">
    <div class="counter-card">
      <h2>Pinia 计数器示例</h2>
      
      <div class="counter-display">
        <div class="count">{{ count }}</div>
        <div class="count-info">
          <p>双倍值: {{ doubleCount }}</p>
          <p>是否为偶数: {{ isEven ? '是' : '否' }}</p>
        </div>
      </div>

      <div class="step-control">
        <label for="step">步长:</label>
        <input 
          id="step"
          v-model.number="step" 
          type="number" 
          min="1" 
          max="10"
          class="step-input"
        >
      </div>

      <div class="counter-actions">
        <button @click="decrement" class="btn btn-danger">-{{ step }}</button>
        <button @click="reset" class="btn btn-secondary">重置</button>
        <button @click="increment" class="btn btn-primary">+{{ step }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { count, step, doubleCount, isEven } = storeToRefs(counterStore)
const { increment, decrement, reset } = counterStore
</script>

<style scoped>
.counter {
  max-width: 600px;
  margin: 0 auto;
}

.counter-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.counter-card h2 {
  margin-bottom: 2rem;
  color: #2d3748;
}

.counter-display {
  margin-bottom: 2rem;
}

.count {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
}

.count-info {
  color: #718096;
}

.count-info p {
  margin: 0.5rem 0;
}

.step-control {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.step-control label {
  font-weight: 600;
  color: #2d3748;
}

.step-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
}

.step-input:focus {
  outline: none;
  border-color: #667eea;
}

.counter-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
}

.btn-danger:hover {
  box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}
</style>
