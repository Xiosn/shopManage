<template>
<div>
    <!-- 面包屑导航 -->
    <my-bread bread="权限管理" bread2="角色列表" />

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button @click="handleAddRoles" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'row-center', index === 0 ? 'bdtop' : '']"
              :key="item.id"
              v-for="(item, index) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  :disable-transitions="false"
                  @close="removeRightById(scope.row, item.id)"
                  closable
                >
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- for循环渲染二、三级权限 -->
                <el-row
                  :class="['row-center', index2 === 0 ? '' : 'bdtop']"
                  :key="item2.id"
                  v-for="(item2, index2) in item.children"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      :disable-transitions="false"
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      type="success"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      :disable-transitions="false"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column align="center" label="#" type="index" />
        <el-table-column align="center" label="角色名称" prop="roleName" />
        <el-table-column align="center" label="角色描述" prop="roleDesc" />
        <el-table-column align="center" label="操作" width="310px">
          <template slot-scope="scope">
            <el-button
              @click="handleEditRoles(scope.row.id)"
              icon="el-icon-edit"
              size="small"
              type="primary"
            >
              编辑
            </el-button>
            <el-button
              @click="deleteRoles(scope.row.id)"
              icon="el-icon-delete"
              size="small"
              type="danger"
            >
              删除
            </el-button>
            <el-button
              @click="showRightDialog(scope.row)"
              icon="el-icon-setting"
              size="small"
              type="warning"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      :visible.sync="rightsDialog"
      @close="defaultKeys = []"
      title="分配权限"
      width="700px"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :default-checked-keys="defaultKeys"
        :props="treeProps"
        node-key="id"
        ref="treeRef"
        show-checkbox
      />
      <span class="dialog-footer" slot="footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button @click="allotRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog :title="rolesTitle" :visible.sync="rolesDialog" @close="resetFields" width="700px">
      <el-form :model="roleForm" :rules="rolesRules" label-width="100px" ref="roleFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            clearable
            maxlength="10"
            minlength="2"
            placeholder="请输入角色名称"
            show-word-limit
            v-model="roleForm.roleName"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            clearable
            maxlength="10"
            minlength="2"
            placeholder="请输入角色描述"
            show-word-limit
            v-model="roleForm.roleDesc"
          />
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span class="dialog-footer" slot="footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button @click="setRoles" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBread from 'components/content/MyBread';
import { 
        getRolesRequest,
        deleteRightsRequest,
        getAdminRequest,
        setAdminRequest,
        addRolesRequest,
        searchRolesRequest,
        editRolesRequest,
        deleteRolesRequest } from 'network/power';

export default {
    name: 'Roles',
    components: {
        MyBread
    },
    data() {
        return {
            //所有角色列表数据
            rolesList: [],
             // 权限数据
            rightsList: [],
            // 默认勾选的节点ID数组
            defaultKeys: [],
            // 分配权限弹框
            rightsDialog: false,
            // 添加角色弹框
            rolesDialog: false,
            // 树形控件的属性绑定对象
            treeProps: {
                children: "children",
                label: "authName"
            },
            // 即将分配权限的角色ID
            roleId: "",
            // 添加的角色对象
            roleForm: {
                roleName: "",
                roleDesc: ""
            },
            // 添加对象表单验证
            rolesRules: {
                roleName: [
                { required: true, message: "请输入角色名称", trigger: "blur" },
                { min: 2, max: 10, message: "角色名称长度在2-10个字符之间", trigger: "blur" }
                ],
                roleDesc: [
                { required: true, message: "请输入角色描述", trigger: "blur" },
                { min: 2, max: 10, message: "角色描述长度在2-10个字符之间", trigger: "blur" }
                ]
            },
            // 是否编辑
            isEdit: false,
            // 临时编辑表单用于校验是否修改表单数据
            editForm: {},
            // 修改角色的ID
            editRoleId: ""
        }
    },
    created() {
        this.getRolesList()
    },
    computed: {
        rolesTitle() {
        if (!this.isEdit) return "添加角色";
        return "修改角色";
        }
    },
    methods: {
        //获取所有角色的列表
        async getRolesList() {
            const {data: res} = await getRolesRequest();
            
            if(res.meta.status != 200) return this.message.error("获取角色列表失败！")
            this.rolesList = res.data
        },
        // 重置表单
        resetFields() {
            this.$refs.roleFormRef.resetFields();
            this.roleForm = {
            roleName: "",
            roleDesc: ""
            };
            this.editForm = {};
        },
        // 添加角色按钮
        handleAddRoles() {
        this.isEdit = false;
        this.rolesDialog = true;
        },
        // 编辑角色按钮
        async handleEditRoles(id) {
        this.isEdit = true;
        // 根据ID查询角色信息
        const { data: res } = await searchRolesRequest(id);
        console.log(res);
        if (!res) return this.$alertError("查询角色信息失败");
        this.editRoleId = res.roleId;
        this.roleForm = {
            roleName: res.roleName,
            roleDesc: res.roleDesc
        };
        this.editForm = res;
        this.rolesDialog = true;
        },
         // 删除角色按钮
        async deleteRoles(id) {
            const result = await this.$boxConfirm("您确定要删除角色吗？");
            if (result) {
                const res = await deleteRolesRequest(id);
                console.log(res);
                if (res.data.meta.status !== 200) return this.$message.error("删除角色失败");
                this.$message.success("删除角色成功")
                this.getRolesList()
            }
        },
        // 添加角色请求
        async addRoles() {
            const res = await addRolesRequest(this.roleForm);
            // console.log(res);
            if (res.data.meta.status !== 201) return this.$message.error("添加角色失败");
            this.$message.success("添加角色成功")
                this.getRolesList();
                this.rolesDialog = false;
        },
        // 修改角色请求
        async editRoles() {
            // 修改之前判断用户有没有修改内容
            if (
                this.roleForm.roleName === this.editForm.roleName &&
                this.roleForm.roleDesc === this.editForm.roleDesc
            )
                return this.$alertError("您没有做任何修改");
            const res = await editRolesRequest(this.editRoleId, this.roleForm);
            // console.log(res);
            if (res.meta.status !== 200) return this.$alertError("修改角色失败");
            this.$alertSuccess("修改角色成功", () => {
                this.getRoleList();
                this.rolesDialog = false;
            });
        },
        // 确定设置角色
        setRoles() {
            this.$refs.roleFormRef.validate(async valid => {
                if (!valid) return false;
                // 添加角色请求
                if (!this.isEdit) return this.addRoles();
                // 修改角色请求
                this.editRoles();
            });
        },
        // 根据ID删除对应的权限
        async removeRightById(row, id) {
            const result = await this.$boxConfirm("您确定要删除标签吗");
            if (result) {
                const res = await deleteRightsRequest(row, id);
                // console.log(res);
                if (res.data.meta.status !== 200) return this.$message.error("删除用户权限失败");
                this.$message.success("删除用户权限成功");
                row.children = res.data.data;
            }
        },
        // 分配权限按钮
        async showRightDialog(row) {
            // 给权限ID赋值
            this.roleId = row.id;
            // 获取所有权限数据
            const { data: res } = await getAdminRequest();
            // console.log(res)
            if (!res) return this.$message.error("获取用户权限数据失败");
            this.rightsList = res.data;
            // 调用递归
            this.getLeafKeys(row, this.defaultKeys);
            this.rightsDialog = true;
        },
        // 递归获取三级权限ID放到defaultKeys中
        getLeafKeys(node, arr) {
            // 如果当前node节点不包含children属性,则是三级权限
            if (!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr);
            });
        },
        // 确定分配权限
        async allotRights() {
            // 获取选中的id跟半选中的id放到一个数组中
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            // 将数组用逗号分开,传给后台
            const str = keys.join(",");
            const res = await setAdminRequest(this.roleId, str);
            // console.log(res);
            if (res.data.meta.status !== 200) return this.$alertError("分配权限失败");
            this.$message.success("分配权限成功")
                this.getRolesList();
                this.rightsDialog = false;
        }
    }
}
</script>

<style lang='less' scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>