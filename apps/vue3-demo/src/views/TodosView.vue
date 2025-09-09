<template>
  <div class="todos">
    <div class="todos-card">
      <h2>待办事项管理</h2>
      
      <!-- 添加新待办 -->
      <div class="add-todo">
        <input 
          v-model="newTodoText"
          @keyup.enter="addTodo"
          type="text" 
          placeholder="输入新的待办事项..."
          class="todo-input"
        >
        <button @click="addTodo" class="btn btn-primary" :disabled="!newTodoText.trim()">
          添加
        </button>
      </div>

      <!-- 过滤器 -->
      <div class="filters">
        <button 
          v-for="filterType in filterTypes" 
          :key="filterType.value"
          @click="setFilter(filterType.value)"
          :class="['filter-btn', { active: filter === filterType.value }]"
        >
          {{ filterType.label }}
        </button>
      </div>

      <!-- 统计信息 -->
      <div class="stats">
        <span>总计: {{ todos.length }}</span>
        <span>待完成: {{ activeTodosCount }}</span>
        <span>已完成: {{ completedTodosCount }}</span>
        <button 
          v-if="completedTodosCount > 0"
          @click="clearCompleted" 
          class="clear-btn"
        >
          清除已完成
        </button>
      </div>

      <!-- 待办列表 -->
      <div class="todo-list">
        <div 
          v-for="todo in filteredTodos" 
          :key="todo.id"
          :class="['todo-item', { completed: todo.completed }]"
        >
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
            class="todo-checkbox"
          >
          <span class="todo-text">{{ todo.text }}</span>
          <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
          <button @click="deleteTodo(todo.id)" class="delete-btn">删除</button>
        </div>
        
        <div v-if="filteredTodos.length === 0" class="empty-state">
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodosStore } from '@/stores/todos'
import { storeToRefs } from 'pinia'

const todosStore = useTodosStore()
const { todos, filter, filteredTodos, activeTodosCount, completedTodosCount } = storeToRefs(todosStore)
const { addTodo: addTodoAction, toggleTodo, deleteTodo, clearCompleted, setFilter } = todosStore

const newTodoText = ref('')

const filterTypes = [
  { value: 'all' as const, label: '全部' },
  { value: 'active' as const, label: '待完成' },
  { value: 'completed' as const, label: '已完成' }
]

const addTodo = () => {
  if (newTodoText.value.trim()) {
    addTodoAction(newTodoText.value)
    newTodoText.value = ''
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getEmptyMessage = () => {
  switch (filter.value) {
    case 'active':
      return '没有待完成的事项'
    case 'completed':
      return '没有已完成的事项'
    default:
      return '还没有待办事项，添加一个吧！'
  }
}
</script>

<style scoped>
.todos {
  max-width: 800px;
  margin: 0 auto;
}

.todos-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.todos-card h2 {
  margin-bottom: 2rem;
  color: #2d3748;
  text-align: center;
}

.add-todo {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.clear-btn {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-btn:hover {
  background: #e53e3e;
}

.todo-list {
  space-y: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  background: #f0fff4;
  border-color: #9ae6b4;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #718096;
}

.todo-date {
  font-size: 0.875rem;
  color: #a0aec0;
}

.delete-btn {
  background: #f56565;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.delete-btn:hover {
  background: #e53e3e;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}
</style>
