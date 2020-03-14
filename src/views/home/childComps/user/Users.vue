<template>
  <div>
    <!-- 面包屑导航 -->
    <my-bread bread="用户管理" bread2="用户列表"></my-bread>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            @clear="getUserList"
            clearable
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
          >
            <el-button
              :disabled="searchDisabled"
              @click="handleSearch"
              icon="el-icon-search"
              slot="append"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button @click="addUser" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column align="center" label="#" type="index"></el-table-column>
        <el-table-column align="center" label="姓名" prop="username"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="email"></el-table-column>
        <el-table-column align="center" label="电话" prop="mobile"></el-table-column>
        <el-table-column align="center" label="角色" prop="role_name"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              @click="editUser(scope.row.id)"
              icon="el-icon-edit"
              size="small"
              type="primary"
            />
            <!-- 删除按钮 -->
            <el-button
              @click="deleteUser(scope.row.id)"
              icon="el-icon-delete"
              size="small"
              type="danger"
            />
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top">
              <!-- 分配角色按钮 -->
              <el-button
                @click="setRole(scope.row)"
                icon="el-icon-setting"
                size="small"
                type="warning"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog :title="userTitle" :visible.sync="addDialog" @close="clearFormRules" width="700px">
      <!-- 对话框主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-position="left"
        label-width="64px"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            :disabled="isEdit"
            clearable
            maxlength="10"
            placeholder="请输入用户名"
            show-word-limit
            v-model="addForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            clearable
            maxlength="15"
            placeholder="请输入密码"
            show-password
            type="password"
            v-model="addForm.password"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            clearable
            maxlength="20"
            placeholder="请输入邮箱"
            show-word-limit
            v-model="addForm.email"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            clearable
            maxlength="11"
            placeholder="请输入手机号"
            show-word-limit
            v-model="addForm.mobile"
          />
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span class="dialog-footer" slot="footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button @click="correctBtnClick" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog :visible.sync="rolesDialog" @close="roleId = ''" title="分配角色" width="700px">
      <p>当前的用户：{{ userInfo.username }}</p>
      <p>当前的角色：{{ userInfo.role_name }}</p>
      <p>
        分配新角色：
        <el-select placeholder="请选择角色" v-model="roleId">
          <el-option
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            v-for="item in rolesList"
          />
        </el-select>
      </p>
      <span class="dialog-footer" slot="footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button @click="saveRoleInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import {
  addUserRequest,
  usersRequest,
  userStateRequest,
  searchUserRequest,
  editUserRequest,
  deleteUserRequest,
  getRolesListRequest,
  setRoleRequest
} from "network/users";

export default {
  name: "Users",
  data() {
    // 自定义验证手机号的校验规则
    const checkMobile = (rule, value, callback) => {
      const pattern = /^1[3-9]\d{9}$/;
      if (!value) return callback(new Error("请输入手机号"));
      if (!pattern.test(value)) return callback(new Error("请输入正确的手机号"));
      return callback();
    };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 是否禁用搜索按钮
      searchDisabled: false,
      // 添加/修改 用户对话框
      addDialog: false,
      // 分配角色对话框
      rolesDialog: false,
      // 添加/修改 用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加/修改 用户的表单验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3-10个字符之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度在6-15个字符之间", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        mobile: [{ required: true, trigger: "blur", validator: checkMobile }]
      },
      // 是否修改用户
      isEdit: false,
      // 编辑用户的临时表单数据
      editForm: {},
      // 用户ID
      userId: "",
      // 需要被分配权限的用户信息
      userInfo: {
        username: "",
        role_name: "",
        id: ""
      },
      // 分配的角色列表
      rolesList: [],
      // 选中的角色ID
      roleId: ""
    };
  },
  components: { MyBread },
  created() {
    this.getUserList();
  },
  watch: {
    // 当输入框数据变化的时候恢复点击按钮
    "queryInfo.query"() {
      this.searchDisabled = false;
    }
  },
  computed: {
    // 动态设置弹框标题
    userTitle() {
      if (!this.isEdit) return "添加用户信息";
      return "修改用户信息";
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await usersRequest(this.queryInfo);
      if (!res) return this.$message.error("获取用户列表数据失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 每页显示条数事件
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getUserList();
    },
    // 分页事件
    handleCurrentChange(page) {
      this.queryInfo.pagenum = page;
      this.getUserList();
    },
    // 更改用户状态
    async userStateChange(userInfo) {
      const { data: res } = await userStateRequest(userInfo);
      if (!res) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更改用户状态失败");
      }
      this.$message.success("更改用户状态成功");
    },
    // 搜索完成禁用按钮,防止多次触发请求
    handleSearch() {
      if (!this.queryInfo.query) return;
      this.getUserList();
      this.searchDisabled = true;
    },
    // 重置表单数据
    clearFormRules() {
      this.$nextTick(() => {
        this.$refs.addFormRef.resetFields();
      });
      // 清空用户ID
      this.userId = "";
      // 清空编辑的表单数据
      this.editForm = {};
    },
    // 添加用户按钮
    addUser() {
      this.isEdit = false;
      this.addDialog = true;
    },
    // 修改用户按钮
    async editUser(id) {
      this.isEdit = true;
      this.addDialog = true;
      const { data: res } = await searchUserRequest(id);
      const data = res.data;
      if (!res) return this.$message.error("获取用户数据失败");
      this.addForm.username = data.username;
      this.addForm.email = data.email;
      this.addForm.mobile = data.mobile;
      this.userId = id;
      this.editForm = data;
    },
    // 删除用户按钮
    async deleteUser(id) {
      const result = await this.$boxConfirm("您确定要永久删除该用户吗？");
      if (result) {
        const res = await deleteUserRequest(id);
        // console.log(res);
        if (res.data.meta.status === 400) return this.$message.error(res.data.meta.msg);
        this.$message.success("删除用户成功")
          this.getUserList();
      }
    },
    // 弹框确定按钮
    correctBtnClick() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false;
        // 发起添加用户请求
        if (!this.isEdit) return this._addUserRequest();
        // 发起修改用户请求
        this._editUserRequest();
      });
    },
    // 添加用户请求
    async _addUserRequest() {
      const { data: res } = await addUserRequest(this.addForm);
      // console.log(res);
      if (!res) return this.$message.error("添加用户失败");
      this.$message.success("添加用户成功");
        this.getUserList();
        this.addDialog = false;
    },
    // 修改用户请求
    async _editUserRequest() {
      // 修改之前判断用户有没有修改内容
      if (
        this.addForm.mobile === this.editForm.mobile &&
        this.addForm.email === this.editForm.email
      )
        return this.$message.error("您没有做任何修改");
      // 修改数据
      const { data: res } = await editUserRequest(this.userId, this.addForm);
      console.log(res);
      if (!res) return this.$message.error("修改用户信息失败");
      this.$message.success("修改用户信息成功")
        this.getUserList();
        this.addDialog = false;
    },
    // 分配角色按钮
    async setRole(userInfo) {
      this.userInfo.username = userInfo.username;
      this.userInfo.role_name = userInfo.role_name;
      this.userInfo.id = userInfo.id;
      // 获取所有角色列表
      const { data: res } = await getRolesListRequest();
      // console.log(res);
      if (!res) return this.$message.error("获取分配角色列表失败");
      this.rolesList = res;
      this.rolesDialog = true;
    },
    // 确定分配角色
    async saveRoleInfo() {
      if (!this.roleId) return this.$message.error("请选择要分配的用户角色");
      const res = await setRoleRequest(this.userInfo.id, this.roleId);
      // console.log(res);
      if (res.meta.status === 400) return this.$alertError(res.meta.msg);
      this.$message.success("分配用户角色成功")
        this.getUserList();
        this.rolesDialog = false;
    }
  }
};
</script>

<style lang="lass" scoped>
/* p {
  margin: 20px 0;
} */
</style>