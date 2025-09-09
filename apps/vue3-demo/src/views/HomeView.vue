<template>
  <div class="home">
    <div class="hero">
      <h2>欢迎使用 Vue3 + TypeScript + Vite + Pinia</h2>
      <p class="subtitle">这是一个现代化的 Vue3 演示项目</p>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>🚀 Vite</h3>
        <p>极速的开发服务器和构建工具</p>
      </div>
      <div class="feature-card">
        <h3>📘 TypeScript</h3>
        <p>类型安全的 JavaScript 超集</p>
      </div>
      <div class="feature-card">
        <h3>🍍 Pinia</h3>
        <p>Vue 的现代状态管理库</p>
      </div>
      <div class="feature-card">
        <h3>🎯 Vue 3</h3>
        <p>渐进式 JavaScript 框架</p>
      </div>
    </div>

    <div class="actions">
      <router-link to="/counter" class="action-btn primary">
        查看计数器示例
      </router-link>
      <router-link to="/todos" class="action-btn secondary">
        查看待办事项示例
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页逻辑
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #718096;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}
</style>
