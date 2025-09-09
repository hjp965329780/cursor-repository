import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/counter',
    name: 'Counter',
    component: () => import('@/views/CounterView.vue')
  },
  {
    path: '/todos',
    name: 'Todos',
    component: () => import('@/views/TodosView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
