<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="权限管理" bread2="权限列表"></my-bread>
     <!-- 卡片视图 -->
    <el-card>
      <!-- 表格数据 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column align="center" label="#" type="index" />
        <el-table-column align="center" label="权限名称" prop="authName" />
        <el-table-column align="center" label="路径" prop="path" />
        <el-table-column align="center" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import { getRightsRequest } from 'network/power';

export default {
    name: 'Rights',
    components: {
        MyBread
    },
    data() {
        return {
            //权限列表
            rightsList: []
        }
    },
    created() {
        //获取所有的权限
        this.getRightsData()
    },
    methods: {
        async getRightsData() {
            const {data: res} = await getRightsRequest();
            if(res.meta.status != 200) return this.$message.error('获取权限列表失败！');
            this.rightsList = res.data
            console.log(res)
        }
    }
}
</script>

<style lang='less' scoped>

</style>