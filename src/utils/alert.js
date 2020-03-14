import Vue from "vue";

// 成功弹框
// export function alertSuccess(msg, fn) {
//   Vue.prototype.$message({
//     message: msg,
//     type: "success",
//     duration: 2000,
//     onClose: () => {
//       return fn && fn.call(this);
//     }
//   });
// }

// 失败弹框
// export function alertError(msg, fn) {
//   Vue.prototype.$message({
//     message: msg,
//     type: "error",
//     duration: 2000,
//     onClose: () => {
//       return fn && fn.call(this);
//     }
//   });
// }

// 确定弹框
export function boxConfirm(msg) {
  return new Promise(resolve => {
    Vue.prototype.$msgbox.confirm(msg, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      resolve(true);
    })
    .catch(err => err);
  });
}

// // 将element弹框挂载到Vue原型上
// Vue.prototype.$alertSuccess = alertSuccess;
// Vue.prototype.$alertError = alertError;
Vue.prototype.$boxConfirm = boxConfirm;