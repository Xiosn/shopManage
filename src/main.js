import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 全局弹框
import "./utils/alert";

Vue.use(ElementUI)

// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
