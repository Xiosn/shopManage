import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    defaultOpens: []
  },
  getters: {
    defaultOpens: state => state.defaultOpens
  },
  mutations: {
    setDefaultOpens(state, val) {
      state.defaultOpens = val;
    }
  },
  actions: {}
});
