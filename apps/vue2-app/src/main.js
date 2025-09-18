import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import { vueModel } from '@hjp/vue-model'
const { createModel, routerPlugin, plugin } = vueModel
Vue.use(plugin)
routerPlugin(router)
window.createModel = createModel

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
