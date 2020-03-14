<template>
  <div class="login_container">
    <!-- 头像区域 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/img/XH.jpg" alt="">
      </div>

      <!-- 登录表单区域 -->
      <el-form :model="loginFrom" 
                label-width="0px" 
                class="login_form"
                :rules="loginFromRules"
                ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
         <el-form-item class="btns">
           <el-button type="primary" @click="login">登陆</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from 'network/login'

export default {
    name: "Login",
    data() {
      return {
        loginFrom: {
          username: 'admin',
          password: '123456'
        },
        //表单的验证规则对象
        loginFromRules: {
          //验证用户名是否合法,
          //required（必填项），message:提示消息， trigger: 触发的时机
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          //验证密码是否合法
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      //点击重置按钮，重置登录表单
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(valid => {
          if(!valid) return;
          getLoginData(this.loginFrom).then(res => {
            const data = res.data.data;
            if(res.data.meta.status != 200) return this.$message.error('登录失败！')
            this.$message.success('登录成功')
            // 1.将登陆成功之后的token,保存到客户端的sessionStore中
            //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //   1.2 token只应在当前网站打开期间失效，所以token保存在sessionStorge中
            window.sessionStorage.setItem('token', data.token);
            // 2. 通过编程式导航跳转到后台主页，路由地址是/home
            this.$router.push('/home')

          })
        });
      }
    }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>