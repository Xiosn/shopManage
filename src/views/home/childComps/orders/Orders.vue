<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="订单管理" bread2="订单列表"></my-bread>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column align="center" label="#" type="index"></el-table-column>
        <el-table-column align="center" label="订单编号" prop="order_number"></el-table-column>
        <el-table-column align="center" label="订单价格" prop="order_price"></el-table-column>
        <el-table-column align="center" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否发货" prop="is_send"></el-table-column>
        <el-table-column align="center" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              @click="editAddress(scope.row.order_id)"
              icon="el-icon-edit"
              size="small"
              type="primary"
            >
              编辑
            </el-button>
            <el-button @click="showProgressBox" icon="el-icon-location" size="small" type="success">
              物流
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

    <!-- 编辑地址对话框 -->
    <el-dialog :visible.sync="dialogVisible" @close="clearForm" title="修改地址" width="700px">
      <el-form :model="addressForm" :rules="addressRules" label-width="100px" ref="addressRef">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="CityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input placeholder="请填写详细地址" v-model="addressForm.address2"></el-input>
        </el-form-item>
        <el-form-item label="订单价格" prop="order_price">
          <el-input-number :min="1" v-model="addressForm.order_price"></el-input-number>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="editOrders" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog :visible.sync="dialogVisible2" title="物流进度" width="700px">
      <el-timeline>
        <el-timeline-item :key="index" :timestamp="item.time" v-for="(item, index) in progressList">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button @click="dialogVisible2 = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import CityData from "@/utils/citydata";
import {
  getOrdersRequest,
  getProgressRequest,
  getOrdersByIdRequest,
  editOrdersRequest
} from "network/orders";

export default {
  name: "Orders",
  components: { MyBread },
  data() {
    return {
      queryInfo: {
        query: "8049",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      dialogVisible2: false,
      addressForm: {
        address1: [],
        address2: "",
        order_price: 1
      },
      addressRules: {
        address1: [{ required: true, message: "请选择省市区", trigger: "change" }],
        address2: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        order_price: [{ required: true, message: "请填写订单价格", trigger: "change" }]
      },
      // 城市数据
      CityData: CityData,
      // 物流数据
      progressList: [],
      // 订单ID
      orderId: 0
    };
  },
  created() {
    this.getOrderData();
  },
  methods: {
    // 获取订单数据
    async getOrderData() {
      const { data: res } = await getOrdersRequest(this.queryInfo);
      if (!res) return this.$message.error("获取订单列表失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 获取物流数据
    async getProgressData() {
      const res = await getProgressRequest("/kuaidi/804909574412544580");
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("获取物流数据失败");
      this.progressList = res.data.data;
    },
    // 每页显示条数事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getOrderData();
    },
    // 分页事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getOrderData();
    },
    // 编辑订单
    async editAddress(id) {
      // 给订单ID赋值
      this.orderId = id;
      const res = await getOrdersByIdRequest(id);
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("获取订单数据失败");
      // 给表单赋值
      this.addressForm.order_price = res.data.data.order_price;
      this.dialogVisible = true;
    },
    // 确定修改订单
    editOrders() {
      this.$refs.addressRef.validate(async valid => {
        if (!valid) return;
        const res = await editOrdersRequest(this.orderId, this.addressForm);
        console.log(res);
        if (res.data.meta.status !== 201) return this.$message.error("修改订单数据失败");
        this.$message.success("修改订单数据成功")
          this.getOrderData();
          this.dialogVisible = false;
        });
    },
    // 展示物流进度
    showProgressBox() {
      this.dialogVisible2 = true;
      this.getProgressData();
    },
    // 清空表单数据
    clearForm() {
      this.$refs.addressRef.resetFields();
      this.orderId = 0;
      this.addressForm = {
        address1: [],
        address2: "",
        order_price: 1
      };
    }
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
