<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="100" />
    <HelloWorld msg="欢迎使用 Vue 2 + Vite" />
    <div class="counter-section">
      <h3>计数器示例</h3>
      <p>当前计数: {{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.counter-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.counter-section h3 {
  margin-bottom: 15px;
  color: #42b983;
}

.counter-section p {
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0;
}

.counter-section button {
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.counter-section button:hover {
  background-color: #35a372;
}

.counter-section button:active {
  transform: scale(0.98);
}
</style>


