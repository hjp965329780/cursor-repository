<template>
  <div id="app">
    <h1>Vue2 App with Monorepo Packages</h1>
    <BaseButton @click="onClick">点我</BaseButton>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { BaseButton } from '@repo/ui-components'
import { greet } from '@repo/utils'

export default {
  name: 'App',
  components: { BaseButton },
  data() {
    return { message: '' }
  },
  mounted() {
    this.message = greet('Monorepo')
  },
  methods: {
    onClick() { this.message = greet('Clicked') }
  }
}
</script>

<style>
#app { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; padding: 24px; }
</style>
