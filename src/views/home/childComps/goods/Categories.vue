<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="商品管理" bread2="商品分类" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button @click="showCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table
        :data="cateList"
        :tree-props="{ children: 'children' }"
        border
        row-key="cat_id"
        stripe
      >
        <el-table-column align="center" label="#" type="index"></el-table-column>
        <el-table-column align="center" label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column align="center" label="是否有效">
          <template slot-scope="scope">
            <i class="el-icon-success color-icon" v-if="scope.row.cat_deleted === false"></i>
            <i class="el-icon-error color-icon" v-else></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="small" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="small" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row.cat_id)" icon="el-icon-edit" type="primary">
              编辑
            </el-button>
            <el-button @click="deleteCate(scope.row.cat_id)" icon="el-icon-delete" type="danger">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog :title="setTitle" :visible.sync="cateDialog" @close="clearCateForm" width="700px">
      <!-- 添加分类的表单 -->
      <el-form :model="cateForm" :rules="cateFormRules" label-width="100px" ref="cateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            clearable
            maxlength="10"
            minlength="2"
            placeholder="请输入分类名称"
            v-model="cateForm.cat_name"
          />
        </el-form-item>
        <el-form-item label="父级分类" v-if="!editId">
          <el-cascader
            :options="parentCateList"
            :props="parentProps"
            @change="handleChange"
            clearable
            placeholder="如不选择默认为一级分类"
            v-model="selectedKeys"
          />
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="cateDialog = false">取 消</el-button>
        <el-button @click="handleCateClick" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import {
  getGoodsRequest,
  getCateRequest,
  addCateRequest,
  searchCateRequest,
  editCateRequest,
  deleteCateRequest
} from "network/goods";
export default {
  name: "Categories",
  components: { MyBread },
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 分类对话框
      cateDialog: false,
      // 表单数据
      cateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 表单校验
      cateFormRules: {
        cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类id
      selectedKeys: [],
      // props配置
      parentProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      // 是否编辑
      editId: ""
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    setTitle() {
      if (!this.editId) return "添加分类";
      return "修改分类";
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await getGoodsRequest(this.queryInfo);
    //   console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取商品分类数据失败");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 每页显示条数事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getCateList();
    },
    // 分页事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getCateList();
    },
    // 获取父级分类数据列表
    async getParentCateData() {
      const { data: res } = await getCateRequest();
    //   console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取父级分类数据失败");
      this.parentCateList = res.data;
    },
    // 级联选择框change事件
    handleChange(arr) {
      // arr.length > 0证明选中了父级分类 反之没有选中任何父级分类
      if (arr.length > 0) {
        this.cateForm.cat_pid = arr[arr.length - 1];
        // 为当前分类的等级分类
        this.cateForm.cat_level = arr.length;
      } else {
        this.cateForm.cat_pid = 0;
        this.cateForm.cat_level = 0;
      }
      // console.log(this.selectedKeys);
    },
    // 添加分类按钮
    showCateDialog() {
      this.editId = "";
      this.getParentCateData();
      this.cateDialog = true;
    },
    // 添加分类请求
    async addCate() {
      const res = await addCateRequest(this.cateForm);
    //   console.log(res);
      if (res.data.meta.status != 201) return this.$message.error("添加分类数据失败");
      this.$message.success("添加分类数据成功")
        this.getCateList();
        this.cateDialog = false;
    },
    // 编辑分类按钮
    async editCate(id) {
      this.editId = id;
      const res = await searchCateRequest(id);
    //   console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("查询分类数据失败");
      this.cateForm.cat_name = res.data.cat_name;
      this.cateDialog = true;
    },
    // 修改分类请求
    async _editCateRequest() {
      const res = await editCateRequest(this.editId, this.cateForm.cat_name);
    //   console.log(res)
      if (res.data.meta.status !== 200) return this.$message.error("修改分类数据失败");
      this.$message.success("修改分类数据成功")
        this.getCateList();
        this.cateDialog = false;
    },
    // 删除分类按钮
    async deleteCate(id) {
      const result = await this.$boxConfirm("您确定要删除该分类吗?");
      if (!result) return;
      const res = await deleteCateRequest(id);
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("删除分类失败");
      this.$message.success("删除分类成功")
        this.getCateList();
    },
    // 确定按钮事件
    async handleCateClick() {
      this.$refs.cateFormRef.validate(async valid => {
        if (!valid) return;
        // 添加分类
        if (!this.editId) return this.addCate();
        this._editCateRequest();
      });
    },
    // 清空表单数据
    clearCateForm() {
      this.$refs.cateFormRef.resetFields();
      // 清空分类等级和ID
      this.cateForm.cat_pid = 0;
      this.cateForm.cat_level = 0;
      // 清空的绑定的数组
      this.selectedKeys = [];
      this.cateForm.cat_name = "";
    }
  }
};
</script>

<style scoped>
.color-icon {
   font-size: 20px;
   color: #90ee90;
 }
 ::v-deep .el-cascader {
   width: 100%;
 } 
</style>