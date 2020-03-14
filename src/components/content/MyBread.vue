<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="path">{{ name }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ bread }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ bread2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "MyBread",
  props: {
    path: {
      type: String,
      default: "/home"
    },
    name: {
      type: String,
      default: "首页"
    },
    bread: String,
    bread2: String
  }
};
</script>