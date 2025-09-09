import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodosStore = defineStore('todos', () => {
  // 状态
  const todos = ref<Todo[]>([])
  const filter = ref<'all' | 'active' | 'completed'>('all')

  // 计算属性
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(todo => !todo.completed)
      case 'completed':
        return todos.value.filter(todo => todo.completed)
      default:
        return todos.value
    }
  })

  const activeTodosCount = computed(() => 
    todos.value.filter(todo => !todo.completed).length
  )

  const completedTodosCount = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )

  // 动作
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    }
    todos.value.unshift(newTodo)
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id: number) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  const setFilter = (newFilter: 'all' | 'active' | 'completed') => {
    filter.value = newFilter
  }

  return {
    todos,
    filter,
    filteredTodos,
    activeTodosCount,
    completedTodosCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter
  }
})
