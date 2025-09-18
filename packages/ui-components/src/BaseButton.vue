<template>
  <button class="repo-btn" @click="$emit('click', $event)"><slot>按钮</slot></button>
</template>

<script>

export default {
  name: 'RepoBaseButton'
}
</script>

<style scoped>
.repo-btn {
  padding: 6px 12px;
  border: 1px solid #409eff;
  background: #409eff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.repo-btn:hover { opacity: 0.92 }
</style>
