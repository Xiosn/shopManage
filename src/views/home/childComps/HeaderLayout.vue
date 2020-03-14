<template>
  <el-header>
    <div>
      <img src="~assets/img/XH.jpg" alt />
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
export default {
    name: 'HeaderLayout',
    methods: {
        logout() {
        //清空token
        window.sessionStorage.clear();
        //重定向到登录页
        this.$router.push("/login");
        this.$message("您已退出登录");
      }
    }
}
</script>

<style lang='less' scoped>
.el-header {
  background-color: var(--header-tint);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text);
  font-size: 22px;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }
  span {
    margin-left: 15px;
  }
}
</style>