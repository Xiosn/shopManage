<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="商品管理" bread2="编辑商品" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 返回按钮 -->
      <el-row style="margin-bottom: 20px;">
        <el-col>
          <el-button @click="$router.replace('/goods')" type="primary">返回商品列表</el-button>
        </el-col>
      </el-row>
      <!-- 信息展示 -->
      <el-alert :closable="false" center show-icon title="编辑商品信息" type="info" />

      <!-- 步骤条 -->
      <el-steps :active="Number(activeIndex)" align-center finish-status="success">
        <el-step title="基本信息" />
        <el-step title="商品参数" />
        <el-step title="商品属性" />
        <el-step title="商品图片" />
        <el-step title="商品内容" />
        <el-step title="完成" />
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
        label-width="100px"
        ref="addFormRef"
      >
        <el-tabs
          :before-leave="beforeLeave"
          @tab-click="tabClick"
          tab-position="left"
          v-model="activeIndex"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input placeholder="请输入商品名称" v-model.trim="addForm.goods_name" />
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input-number :min="1" v-model="addForm.goods_price" />
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input-number :min="1" v-model="addForm.goods_weight" />
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input-number :min="1" v-model="addForm.goods_number" />
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                :props="cateProps"
                :show-all-levels="false"
                @change="handleChange"
                clearable
                placeholder="请选择商品分类"
                v-model="addForm.goods_cat"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :key="index"
              :label="item.attr_name"
              v-for="(item, index) in manyTableList"
              v-if="manyTableList.length !== 0"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :key="index2"
                  :label="item2"
                  border
                  v-for="(item2, index2) in item.attr_vals"
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in onlyTableList"
              v-if="item.attr_vals"
            >
              <el-input v-model="item.attr_vals" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :before-upload="beforeUpload"
              :file-list="fileList"
              :headers="headersObj"
              :limit="5"
              :on-exceed="onExceed"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              action="http://111.229.67.82:8888/api/private/v1/upload"
              class="upload-demo"
              list-type="picture"
              ref="upload"
            >
              <el-button type="primary">点击上传图片</el-button>
            </el-upload>
            <el-dialog
              :visible.sync="picDialog"
              @close="previewPath = ''"
              title="图片预览"
              width="500px"
            >
              <img :src="previewPath" alt="" style="width:100%;" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="editProduct" class="btn-add" type="primary">修改商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import { editGoodsDataRequest, getAllGoodsRequest, searchGoodsByIdRequest } from "@/network/goods";
import _ from "lodash";
import { goodsMixins } from "@/mixins/goods";

export default {
  name: "Edit",
  components: { MyBread },
  mixins: [goodsMixins],
  data() {
    return {
      // 图片数组
      fileList: []
    };
  },
  computed: {
    editId() {
      return Number(this.$route.params.id);
    }
  },
  methods: {
    // 获取所有商品数据
    async getCateData() {
      const { data: cate } = await getAllGoodsRequest();
      // console.log(cate)
      if (!cate) return this.$message.error("获取商品分类数据失败");
      this.cateList = cate.data;
      const { data: res } = await searchGoodsByIdRequest(this.editId);
      console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取商品数据失败");
      // 给表单赋值
      this.addForm.goods_name = res.data.goods_name;
      this.addForm.goods_price = res.data.goods_price;
      this.addForm.goods_weight = res.data.goods_weight;
      this.addForm.goods_number = res.data.goods_number;
      this.addForm.goods_introduce = res.data.goods_introduce;
      // 给商品分类赋值
      const goods_cat = res.goods_cat ? res.goods_cat.split(",") : [];
      for (let i = 0; i < goods_cat.length; i++) {
        goods_cat[i] = Number(goods_cat[i]);
      }
      this.addForm.goods_cat = goods_cat;
    },
    // 修改商品
    editProduct() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请填写必要的表单项");
        // 执行添加修改逻辑 对this.addForm进行深拷贝 调用lodash的cloneDeep()方法
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableList.forEach(many => {
          const manyInfo = {
            attr_id: many.attr_id,
            attr_value: many.attr_vals.join(" ")
          };
          this.addForm.attrs.push(manyInfo);
        });
        // 处理静态属性
        this.onlyTableList.forEach(only => {
          const onlyInfo = {
            attr_id: only.attr_id,
            attr_value: only.attr_vals
          };
          this.addForm.attrs.push(onlyInfo);
        });
        form.attrs = this.addForm.attrs;

        // 发起请求 添加商品 商品的名称必须是唯一的
        const res = await editGoodsDataRequest(this.editId, form);
        console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("修改商品成功")
          this.$router.replace("/goods");
      });
    }
  }
};
</script>

<style scoped>
.el-alert__icon {
    font-size: 18px;
    width: 18px;
  }

.el-alert__title {
  font-size: 14px;
}

::v-deep .el-tabs__item {
  user-select: none;
}

::v-deep .el-checkbox {
  margin: 0 10px 10px 0;
}

::v-deep .el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0;
}

::v-deep .el-upload-list__item-thumbnail {
  cursor: pointer;
  object-fit: cover;
}

::v-deep .el-upload-list__item-name {
  user-select: none;
}

::v-deep .ql-editor {
  min-height: 300px;
}

.btn-add {
  margin-top: 20px;
}

::v-deep .ql-snow .ql-tooltip {
  left: 30px;
}
</style>
