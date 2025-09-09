// 全局类型定义

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
