<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="商品管理" bread2="参数列表" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 温馨提示 -->
      <el-alert
        :closable="false"
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
      />
      <!-- 选择商品分类区域 -->
      <el-row class="cate-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader
            :options="cateList"
            :props="cateProps"
            :show-all-levels="false"
            @change="handleChange"
            clearable
            placeholder="请选择内容"
            v-model="selectedKeys"
          />
        </el-col>
      </el-row>
      <!-- 选项卡 -->
      <el-tabs @tab-click="tabClick" type="border-card" v-model="activeName">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 只有选中三级分类才能使用按钮 -->
          <el-button
            :disabled="selectedKeys.length !== 3"
            @click="dialogVisible = true"
            type="primary"
          >
            添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableList" border stripe>
            <el-table-column align="center" type="expand">
              <!-- 循环渲染tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  :disable-transitions="false"
                  :key="index"
                  @close="deleteTag(scope.row, index)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  maxlength="50"
                  ref="saveTagInput"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                />
                <el-button @click="showInput(scope.row)" class="button-new-tag" size="small" v-else>
                  + 新标签
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="#" type="index" />
            <el-table-column align="center" label="参数名称" prop="attr_name" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row)" icon="el-icon-edit" type="primary">
                  编辑
                </el-button>
                <el-button
                  @click="delParams(scope.row.attr_id)"
                  icon="el-icon-delete"
                  type="danger"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 只有选中三级分类才能使用按钮 -->
          <el-button
            :disabled="selectedKeys.length !== 3"
            @click="dialogVisible = true"
            type="primary"
          >
            添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableList" border stripe>
            <el-table-column align="center" type="expand">
              <!-- 循环渲染tag标签 -->
              <template slot-scope="scope">
                <el-tag
                  :disable-transitions="false"
                  :key="index"
                  @close="deleteTag(scope.row, index)"
                  closable
                  v-for="(item, index) in scope.row.attr_vals"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  @blur="handleInputConfirm(scope.row)"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  class="input-new-tag"
                  maxlength="50"
                  ref="saveTagInput"
                  size="small"
                  v-if="scope.row.inputVisible"
                  v-model.trim="scope.row.inputValue"
                />
                <el-button @click="showInput(scope.row)" class="button-new-tag" size="small" v-else>
                  + 新标签
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="#" type="index" />
            <el-table-column align="center" label="属性名称" prop="attr_name" />
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button @click="editParams(scope.row)" icon="el-icon-edit" type="primary">
                  编辑
                </el-button>
                <el-button
                  @click="delParams(scope.row.attr_id)"
                  icon="el-icon-delete"
                  type="danger"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="setTitle + titleText"
      :visible.sync="dialogVisible"
      @close="dialogClose"
      width="700px"
    >
      <el-form :model="addForm" :rules="addFormRules" label-width="100px" ref="addFormRef">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input placeholder="请输入参数名称" v-model="addForm.attr_name" />
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="setParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';

import {
  getAllGoodsRequest,
  getPanelRequest,
  realAddParamsRequest,
  realEditParamsRequest,
  deleteParams,
  editTagRequest
} from "network/goods";

export default {
  name: "Params",
  components: { MyBread },
  data() {
    return {
      // 分类数据
      cateList: [],
      // 级联选择框双向绑定的值
      selectedKeys: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // tab默认选中
      activeName: "many",
      // 动态参数列表
      manyTableList: [],
      // 静态属性列表
      onlyTableList: [],
      // 对话框
      dialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      // 表单验证
      addFormRules: {
        attr_name: [{ required: true, message: "请输入参数名称", trigger: "blur" }]
      },
      // 属性ID
      attrId: ""
    };
  },
  computed: {
    // 三级分类的ID
    catId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return null;
    },
    // 动态标题
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
    // 添加或者编辑
    setTitle() {
      if (this.attrId) return "修改";
      return "添加";
    }
  },
  created() {
    this.getCateData();
  },
  methods: {
    // 获取所有商品分类
    async getCateData() {
      const { data: res } = await getAllGoodsRequest();
    //   console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取分类数据失败");
      this.cateList = res.data;
    },
    // 级联选择框change事件
    handleChange() {
      // 选中的不是三级分类清空数组
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableList = [];
        this.onlyTableList = [];
        return false;
      }
      this.getArrData();
    },
    // tab标签点击事件
    tabClick() {
      this.getArrData();
    },
    // 根据所选分类的ID跟当前所处的面板获取对应的数据
    async getArrData() {
      // 只有选中三级分类才发起数据请求
      if (this.selectedKeys.length === 3) {
        const res = await getPanelRequest(this.catId, this.activeName);
        // console.log(res.data);
        if (res.data.meta.status != 200) return this.$message.error("获取数据失败");
        // 将数据按照空格拆分成数组
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 动态添加输入框布尔值和输入内容字段
          item.inputVisible = false;
          item.inputValue = "";
        });
        if (this.activeName === "many") {
          this.manyTableList = res.data.data;
        } else {
          this.onlyTableList = res.data.data;
        }
      }
    },
    // 对话框关闭事件
    dialogClose() {
      this.attrId = "";
      this.$refs.addFormRef.resetFields();
      this.addForm.attr_name = "";
    },
    // 确定按钮事件
    setParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        if (this.attrId) {
          this.realEditParams();
        } else {
          this.addParams();
        }
      });
    },
    // 确定添加参数
    async addParams() {
      const res = await realAddParamsRequest(this.catId, this.addForm.attr_name, this.activeName);
      console.log(res);
      if (res.data.meta.status !== 201) return this.$message.error("添加参数失败");
      this.$message.success("添加参数成功")
        this.getArrData();
        this.dialogVisible = false;
    },
    // 修改参数按钮
    editParams(obj) {
      this.dialogVisible = true;
      this.addForm.attr_name = obj.attr_name;
      this.attrId = obj.attr_id;
    },
    // 确定修改参数
    async realEditParams() {
      const res = await realEditParamsRequest(
        this.catId,
        this.attrId,
        this.addForm.attr_name,
        this.activeName
      );
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error("修改参数失败");
      this.$message.success("修改参数成功")
        this.getArrData();
        this.dialogVisible = false;
    },
    // 删除参数
    async delParams(id) {
      const result = await this.$boxConfirm("您确定要删除该参数吗？");
      if (!result) return;
      const res = await deleteParams(this.catId, id);
      console.log(res);
      if (res.data.meta.status != 200) return this.$message.error("删除参数失败");
      this.$message.success("删除参数成功")
        this.getArrData();
    },
    // 显示新增标签input框
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点或者按下回车键都会触发新增标签
    async handleInputConfirm(obj) {
      if (obj.inputValue) {
        obj.attr_vals.push(obj.inputValue);
        // 只有在有值的情况下发送添加标签请求
        this.saveTagValues(obj, "添加标签失败", "添加标签成功");
      }
      // 没有值的情况下隐藏输入框并且清空输入框值
      obj.inputValue = "";
      obj.inputVisible = false;
    },
    // 删除标签
    deleteTag(row, index) {
      row.attr_vals.splice(index, 1);
      this.saveTagValues(row, "删除标签失败", "删除标签成功");
    },
    // 添加修改标签请求
    async saveTagValues(obj, errText, successText) {
      const res = await editTagRequest(
        this.catId,
        obj.attr_id,
        obj.attr_name,
        obj.attr_sel,
        obj.attr_vals
      );
      console.log(res);
      if (res.data.meta.status !== 200) return this.$message.error(errText);
      this.$message.success(successText);
    }
  }
};
</script>

<style scoped>
.cate-opt {
  margin: 20px 0;
}

::v-deep .el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 150px;
}

.el-alert__icon {
    font-size: 18px;
    width: 18px;
    height: 20px;
  }

.el-alert__title {
font-size: 14px;
}
</style>
