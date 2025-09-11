<template>
  <el-select
    v-model="selectedValues"
    multiple
    placeholder="请选择"
    @change="handleChange"
    @remove-tag="handleRemoveTag"
    @clear="handleClear"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  computed: {
    selectedValues: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit('input', newVal)
        this.$emit('change', newVal)
      }
    }
  },
  methods: {
    handleChange(value) {
      this.selectedValues = [...value]
    },
    handleRemoveTag(value) {
      const index = this.selectedValues.indexOf(value)
      if (index > -1) {
        const newValues = [...this.selectedValues]
        newValues.splice(index, 1)
        this.selectedValues = newValues
      }
    },
    handleClear() {
      this.selectedValues = []
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
