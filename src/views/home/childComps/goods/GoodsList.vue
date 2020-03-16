<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="商品管理" bread2="商品列表" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 上面区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            @clear="getGoodsData"
            @keyup.enter.native="searchGoodsData"
            clearable
            placeholder="请输入要搜索的内容"
            v-model.lazy.trim="queryInfo.query"
          >
            <el-button
              :disabled="searchDisabled"
              @click="searchGoodsData"
              icon="el-icon-search"
              slot="append"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column align="center" label="#" type="index" />
        <el-table-column align="center" label="商品名称" prop="goods_name" />
        <el-table-column align="center" label="商品价格(元)" prop="goods_price" width="120px" />
        <el-table-column align="center" label="商品重量" prop="goods_weight" width="100px" />
        <el-table-column align="center" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              @click="editGoods(scope.row.goods_id)"
              icon="el-icon-edit"
              size="small"
              type="primary"
            >
              编辑
            </el-button>
            <el-button
              @click="deleteGoods(scope.row.goods_id)"
              icon="el-icon-delete"
              size="small"
              type="danger"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[10, 15, 20, 25, 30]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import { getGoodsListRequest, deleteGoodsDataRequest } from "network/goods";

export default {
  name: "GoodsList",
  components: { MyBread },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      total: 0,
      searchDisabled: false
    };
  },
  created() {
    this.getGoodsData();
  },
  watch: {
    // 当输入框数据变化的时候恢复点击按钮
    "queryInfo.query"() {
      this.searchDisabled = false;
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsData() {
      const { data: res } = await getGoodsListRequest(this.queryInfo);
      console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取商品列表数据失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页显示条数事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getGoodsData();
    },
    // 分页事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getGoodsData();
    },
    // 搜索完成禁用按钮,防止多次触发请求
    searchGoodsData() {
      if (!this.queryInfo.query) return;
      this.getGoodsData();
      this.searchDisabled = true;
    },
    // 删除商品数据
    async deleteGoods(id) {
      const result = await this.$boxConfirm("您确定要删除该商品吗？");
      if (!result) return;
      const res = await deleteGoodsDataRequest(id);
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("删除商品失败");
      this.$message.success("删除商品成功")
        this.getGoodsData();
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.replace("/goods/add");
      // 同时关闭左侧菜单栏
    //   this.$store.commit("setDefaultOpens", []);
    },
    // 跳转到编辑商品界面
    editGoods(id) {
      this.$router.replace("/goods/edit/" +id);
      // 同时关闭左侧菜单栏
    //   this.$store.commit("setDefaultOpens", []);
    }
  }
};
</script>
