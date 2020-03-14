<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse" >|||</div>
    <el-menu
    background-color="var(--aside-tint)"
    text-color="#fff"
    active-text-color="var(--menuItem-text)"
    unique-opened
    :collapse="isCollapse"
    :collapse-transition='false'
    :router='true'
    :default-active="activePath">
    <!-- 一级菜单 -->
    <el-submenu 
    :index="item.id + ''" 
    v-for="item in menulist" 
    :key="item.id">
      <!-- 菜单模板 -->
      <template slot="title">
        <!-- 图标 -->
        <i :class="iconsObj[item.id]"></i>
        <!-- 文本 -->
        <span>{{item.authName}}</span>
      </template>

      <!-- 二级菜单 -->
      <el-menu-item 
      :index="'/' + subItem.path" 
      v-for="subItem in item.children" 
      :key="subItem.id"
      @click="saveNavState('/' + subItem.path)">
        <!-- 二级菜单模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "AsideMenuLayout",
  props: {
    menulist: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
};
</script>

<style lang='less' scoped>
// .content {
//   .el-menu {
//     border-right: none;
//   }
// }

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: var(--toggle-button);
  font-size: 10px;
  line-height: 24px;
  color: var(--color-text);
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-aside {
  background-color: var(--aside-tint);
   .el-menu {
    border-right: none;
  }
}
</style>