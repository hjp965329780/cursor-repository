<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      这是一个使用 <strong>Vue 2.7.16</strong> 和 <strong>Vite</strong> 构建的简单示例应用。
    </p>
    <h3>快速开始</h3>
    <ul>
      <li>
        <a href="https://v2.vuejs.org" target="_blank" rel="noopener">Vue 2 官方文档</a>
      </li>
      <li>
        <a href="https://vitejs.dev" target="_blank" rel="noopener">Vite 官方文档</a>
      </li>
      <li>
        <a href="https://github.com/underfin/vite-plugin-vue2" target="_blank" rel="noopener">
          vite-plugin-vue2
        </a>
      </li>
    </ul>
    <h3>功能特点</h3>
    <div class="features">
      <div class="feature-item">
        <span class="icon">⚡️</span>
        <p>极速的热模块替换（HMR）</p>
      </div>
      <div class="feature-item">
        <span class="icon">📦</span>
        <p>优化的构建打包</p>
      </div>
      <div class="feature-item">
        <span class="icon">🛠️</span>
        <p>丰富的插件生态</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.hello {
  padding: 20px;
}

h1 {
  color: #42b983;
  margin-bottom: 20px;
}

h3 {
  margin: 30px 0 15px;
  color: #2c3e50;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
}

.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.feature-item {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  min-width: 150px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 36px;
  display: block;
  margin-bottom: 10px;
}

.feature-item p {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>


