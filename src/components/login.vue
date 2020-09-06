<template>
  <div class="login_container">
    <div class="login_title">{{title}}</div>
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/testLogo.jpg" alt="平台首页" />
      </div>
      <div>
        <el-form
          ref="loginFormRef"
          :rules="rules"
          class="login_form"
          :model="form"
          label-width="70px"
        >
          <el-form-item label="用户" prop="username">
            <el-input
              @keyup.enter.native="login()"
              prefix-icon="el-icon-user"
              v-model="form.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              @keyup.enter.native="login()"
              type="password"
              prefix-icon="el-icon-key"
              v-model="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login()">登录</el-button>
            <!-- <el-button type="info" @click="reset()">重置</el-button> -->
            <el-button type="danger" @click="openInitProjectDialog()">初始化</el-button>
            <!-- <el-button type="success" @click="test()">预览</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog title="项目初始化" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

  <el-form  ref="createYmlRef" :rules="initProjectRules" label-position="right" :model="ymlConfig">
  <el-form-item label="数据库用户名" prop="datasourceUsername" >
    <el-input v-model="ymlConfig.datasourceUsername"></el-input>
  </el-form-item>
    <el-form-item label="数据库密码" prop="datasourcePassword">
    <el-input v-model="ymlConfig.datasourcePassword"></el-input>
  </el-form-item>
    <el-form-item label="数据库连接地址" prop="datasourceUrl">
    <el-input v-model="ymlConfig.datasourceUrl"></el-input>
  </el-form-item>
    <!-- <el-form-item label="服务器端口" prop="serverPort">
    <el-input v-model.number="ymlConfig.serverPort"></el-input>
  </el-form-item> -->

<el-form-item label="登录用户名" prop="loginUsername">
    <el-input v-model="ymlConfig.loginUsername"></el-input>
  </el-form-item>
  <el-form-item label="登录密码" prop="loginPassword">
    <el-input v-model="ymlConfig.loginPassword"></el-input>
  </el-form-item>

    <!-- <el-form-item label="redis_host" prop="redisHost">
    <el-input v-model="ymlConfig.redisHost"></el-input>
  </el-form-item>
    <el-form-item label="redis_port" prop="redisPort">
    <el-input v-model.number="ymlConfig.redisPort"></el-input>
  </el-form-item>
    <el-form-item label="redis_密码" prop="redisPassword">
    <el-input v-model="ymlConfig.redisPassword"></el-input>
  </el-form-item> -->
    <el-form-item>
    <el-button type="primary" @click="createYml()">初始化</el-button>
    <el-button @click="resetYmlConfig()">重置</el-button>
  </el-form-item>

      </el-form>

    </el-dialog>
    <!-- <el-dialog title="加微信，给账号" :visible.sync="dialogVisible" width="25%" :before-close="handleClose">
        <img src="../assets/img/HMJ_Ken.png" alt="妹子可以加一下，爷们就算了！！！">
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      title: '测试平台',
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入您的用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      initProjectRules: {
        datasourceUsername: [
          { required: true, message: '请输入数据库用户名', trigger: 'blur' }
        ],
        datasourcePassword: [
          { required: true, message: '请选择数据库密码', trigger: 'blur' }
        ],
        datasourceUrl: [
          { required: true, message: '请输入数据库连接地址', trigger: 'blur' }
        ],
        serverPort: [
          { required: true, message: '请输入服务器端口号', trigger: 'blur' }
        ],
        loginUsername: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
        // redisHost: [
        // ],
        // redisPort: [
        // ],
        // redisPassword: [
        // ]

      },
      ymlConfig: {
        datasourceUsername: '',
        datasourcePassword: '',
        datasourceUrl: '',
        loginUsername: '',
        loginPassword: ''
        // redisHost:"",
        // redisPort:"",
        // redisPassword:""
      }
    }
  },
  methods: {

    reset () {
      // 为绑定的form表单清除内容
      this.$refs.loginFormRef.resetFields()
    },
    openInitProjectDialog () {
      this.$message('该功能还在内测中...，敬请期待!')
      // 先不做
      // this.dialogVisible = true;
    },
    async createYml () {
      this.$refs.createYmlRef.validate(async valid => {
        if (valid) {
          const response = await this.$common.post('/createYmlConfig', this.ymlConfig)
          console.log(response)
          if (response.code === 10000) {
            this.$message.success('程序初始化成功，请等待30s后，即可登录使用')
            this.dialogVisible = false
          } else {
            this.$message.error('服务初始化失败，请重试或者联系Ken!')
          }
        } else {
          return false
        }
      })
    },
    resetYmlConfig () {
      this.$refs.createYmlRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const result = await this.$http.post('/login', this.form)
          // console.log(result);
          const data = result.data
          if (data.code == 10000) {
            this.$message.success(data.msg)
            // console.log("token ： " + data.data.id);
            window.localStorage.setItem('token', data.extend)
            window.localStorage.setItem('customerName', data.data.customerName)
            this.$router.push('/home')
          } else {
            this.$message.error(data.msg)
          }
        } else {
        }
      })
    },
    register () {
      this.$message('注册功能尚未开放,请微信联系我')
    },
    handleClose () {
      this.resetYmlConfig()
      this.dialogVisible = false
    },
    test () {
      // var that = this;
      this.$http.post('/other', this.form).then(data => {
        console.log(data.data)
        if (data.data.code == 40004) {
          this.$message.error(data.data.msg)
        } else {
          this.$message.error('未知错误')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: slategray;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 125px;
    height: 125px;
    border: 1px solid white;
    border-radius: 10%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: thistle;
    img {
      width: 100%;
      height: 100%s;
      border-radius: 10%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.registerBtn {
  display: flex;
  justify-content: flex-start;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.login_title {
  text-align: center;
  font-size: 500%;
  color: wheat;
}
</style>
