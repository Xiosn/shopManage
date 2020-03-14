<template>
  <el-container class="home-container" direction="vertical">
    <header-layout/>

    <el-container>
      <aside-menu-layout :menulist="menulist"/>
      <el-main><router-view/></el-main>
    </el-container>

  </el-container>
</template>

<script>
import HeaderLayout from 'views/home/childComps/HeaderLayout'
import AsideMenuLayout from 'views/home/childComps/AsideMenuLayout'

import { getMenuList } from 'network/asideMenu'

export default {
  name: "Home",
  components: {
    HeaderLayout,
    AsideMenuLayout
  },
  data() {
    return {
      menulist: []
    }
  },
  created() {
    this._getMenuList()
  },
  methods: {
    _getMenuList() {
      getMenuList().then(res => {
        if(res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.menulist = res.data.data;
        // console.log(this.menulist)
    })
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100vh;
}

.el-main {
  background-color: var(--main-tint);
}
</style>