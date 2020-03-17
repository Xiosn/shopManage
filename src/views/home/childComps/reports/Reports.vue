<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="数据统计" bread2="数据报表"></my-bread>

    <!-- 卡片视图 -->
    <el-card>
      <div id="main"></div>
    </el-card>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import { getReportsRequest } from "network/reports";
import echarts from 'echarts';
import _ from "lodash";

export default {
  name: "Reports",
  components: { MyBread },
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#e9eef3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  mounted() {
    // 初始化Echarts
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("main"));

      // 发送网络请求
      const { data: res } = await getReportsRequest();
      // console.log(res)
      if (!res) return this.$message.error("获取图表数据失败");
      const result = _.merge(res, this.options);
      // console.log(result);

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result.data);
    }
  }
};
</script>

<style scoped>
#main {
  width: 600px;
  height: 400px;
}
</style>
