import { vueModel } from '@hjp/vue-model'
const { createModel } = vueModel
class Model {
  constructor() {
    this.state = {
      count: 0
    }
  }

  increment() {
    this.state.count++
  }

  decrement() {
    this.state.count--
  }
}

export default createModel(Model)