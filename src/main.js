import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 全局引入element
import "./utils/element";
// 全局弹框
import "./utils/alert";
// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/base.css'
// 全局引入富文本编辑器
import "./utils/editor";

Vue.config.productionTip = false
// 全局时间过滤器
Vue.filter("dateFormat", val => {
  const date = new Date(val * 1000);
  // 年月日
  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + "").padStart(2, "0");
  const d = (date.getDate() + "").padStart(2, "0");
  // 时分秒
  const hh = (date.getHours() + "").padStart(2, "0");
  const mm = (date.getMinutes() + "").padStart(2, "0");
  const ss = (date.getSeconds() + "").padStart(2, "0");
  // 返回时间格式
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
