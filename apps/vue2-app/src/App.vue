<template>
  <div id="app">
    <nav style="background: #f5f5f5; padding: 10px 20px; margin-bottom: 20px;">
      <router-link to="/home" style="margin-right: 20px; text-decoration: none; color: #2c3e50;">
        首页
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; padding: 24px; }
</style>
