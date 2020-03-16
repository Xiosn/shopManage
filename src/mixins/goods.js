import { getPanelRequest } from "network/goods";

export const goodsMixins = {
  data() {
    return {
      activeIndex: "0",
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: []
      },
      // 添加商品表单验证
      addFormRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "change" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "change" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "change" }]
      },
      // 分类数据
      cateList: [],
      // 动态参数数据
      manyTableList: [],
      // 静态属性数据
      onlyTableList: [],
      // 图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token') || ""
      },
      // 图片对话框
      picDialog: false,
      // 预览大图的url
      previewPath: "",
      // props配置
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      }
    };
  },
  created() {
    this.getCateData();
  },
  computed: {
    catId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  },
  methods: {
    // 级联选择器change事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return false;
      }
    },
    // tabs离开之前的事件,只有选中三级分类才能切换
    beforeLeave(val, oldVal) {
      if (oldVal === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择三级分类");
        return false;
      }
      return true;
    },
    // tabs点击事件
    tabClick() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        this.getParamsData();
      } else if (this.activeIndex === "2") {
        this.getStaticData();
      }
    },
    // 获取动态参数数据
    async getParamsData() {
      const { data: res } = await getPanelRequest(this.catId, "many");
      console.log(res)
      if (res.meta.status != 200) return this.$message.error("获取动态参数失败");
      // 将数据按照空格拆分成数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
      });
      this.manyTableList = res.data;
    },
    // 获取静态属性数据
    async getStaticData() {
      const { data: res } = await getPanelRequest(this.catId, "only");
      if (res.meta.status != 200) return this.$messgae.error("获取静态属性失败");
      this.onlyTableList = res.data;
    },
    // 限制图片上传大小和格式
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error("上传的图片只能是 JPG、JPEG、PNG、GIF 格式");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB");
        return false;
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    // 文件超过上传个数
    onExceed() {
      this.$message.error("最多只能上传 5 张图片");
      return false;
    },
    // 图片删除
    handleRemove(file) {
      if (file.status === "success") {
        // 1.获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path;
        // 2.获取当前要删除的图片的索引值
        const picIndex = this.addForm.pics.findIndex(item => {
          return item.pic === filePath;
        });
        // 3.调用splice方法删除图片
        this.addForm.pics.splice(picIndex, 1);
      }
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url;
      this.picDialog = true;
    },
    // 图片上传成功事件
    handleSuccess(res) {
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error("图片上传失败");
        return false;
      }
      const filePath = res.data.tmp_path;
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: filePath
      };
      // 2.将图片信息对象push到数组中
      this.addForm.pics.push(picInfo);

      // 3.通过ref动态给img标签添加点击事件
      const picIndex = this.addForm.pics.findIndex(item => {
        return item.pic === filePath;
      });
      this.$nextTick(() => {
        this.$refs.upload.$el
          .getElementsByClassName("el-upload-list__item-thumbnail")
          [picIndex].addEventListener("click", () => {
            this.previewPath = res.data.url.replace(
              "http://127.0.0.1:8888",
              "http://111.229.67.82:8888"
            );
            this.picDialog = true;
          });
      });
    }
  }
};
