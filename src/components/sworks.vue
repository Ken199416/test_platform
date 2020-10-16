<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工具中心</el-breadcrumb-item>
      <el-breadcrumb-item>S-WORKS管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            @keyup.enter.native="getUserList()"
            placeholder="请输入S-Works用户姓名"
            v-model="queryUserListParams.query"
            clearable
            @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18" style="text-align:right">
          <!-- <el-button type="primary">添加</el-button> -->
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="age" label="年龄" width="150"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
        <el-table-column prop="idCard" label="身份证" width="200"></el-table-column>
        <el-table-column prop="otherName" label="紧急联系人" width="300"></el-table-column>
        <el-table-column prop="otherMobile" label="紧急联系人电话" width="300"></el-table-column>
        <!-- 状态按钮 -->
        <el-table-column fixed="right" label="状态" width="70">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="停用该用户"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="恢复该用户"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="showDialogVisible(scope.row)"
              size="mini"
            >编辑</el-button>
            <!-- </el-tooltip> -->

            <el-button
              type="primary"
              icon="el-icon-user"
              size="mini"
              @click="getUserInfo(scope.row.id)"
            >详情</el-button>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUserListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryUserListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userTotal"
      ></el-pagination>

    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog :close-on-click-modal="false" title="S-WORKS用户添加" :visible.sync="addDialogVisible" width="50%" @close="closeAdd()">
      <span></span>
      <!-- 添加用户表单 -->
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="姓名"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-user"
            v-model="addForm.name"
            placeholder="请输入真实姓名"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="年龄"
          prop="age"
        >
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="addForm.age"
            placeholder="请输入年龄"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="身份证" prop="idCard">
          <el-input type="password"
            prefix-icon="el-icon-key"
            v-model="addForm.idCard"
            placeholder="请输入身份证密码"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="手机" prop="mobile">
          <el-input
            prefix-icon="el-icon-mobile-phone"
            v-model="addForm.mobile"
            placeholder="请输入手机号"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="紧急联系人" prop="otherName">
          <el-input
            prefix-icon="el-icon-message"
            v-model="addForm.otherName"
            placeholder="请输入紧急联系人"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="紧急联系人地址" prop="otherMobile">
          <el-input
            prefix-icon="el-icon-map-location"
            v-model="addForm.otherMobile"
            placeholder="请输入紧急联系人联系方式"
            style="width:93%"
          ></el-input>
        </el-form-item>
    
    
      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog :close-on-click-modal="false"  title="用户编辑" :visible.sync="editDialogVisible" width="50%" @close="closeEdit()">
      <span></span>
      <!-- 修改用户表单 -->

      <el-form ref="editFormRef" :rules="addFormRules" :model="editForm" label-width="70px">
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用户名"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-user"
            v-model="editForm.name"
            placeholder="用户名禁止更改"
            disabled
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="年龄"
          prop="age"
        >
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="editForm.age"
            placeholder="请输入年龄"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="手机" prop="mobile">
          <el-input
            prefix-icon="el-icon-mobile-phone"
            v-model="editForm.mobile"
            placeholder="请输入手机号"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="邮箱" prop="idCard">
          <el-input
            prefix-icon="el-icon-message"
            v-model="editForm.idCard"
            placeholder="请输入身份证号"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="地址" prop="otherName">
          <el-input
            prefix-icon="el-icon-map-location"
            v-model="editForm.otherName"
            placeholder="请输入紧急联系人"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="公司" prop="otherMobile">
          <el-input
            prefix-icon="el-icon-office-building"
            v-model="editForm.otherMobile"
            placeholder="请输入紧急联系人手机号"
            style="width:93%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <router-view></router-view>

  </div>
</template>
<script>
export default {
  data () {
    //   验证邮箱
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //    验证手机号
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户列表请求参数
      queryUserListParams: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 删除用户请求参数
      delUserParam: {
        uid: 0,
        flag: true
      },
      // 用户列表和用户查询出的用户总数
      userList: [],
      userTotal: 0,
      //   Dialogd对话框的展开标识
      addDialogVisible: false,
      //   添加用户表单参数
      addForm: {
        id: '',
        name: '',
        age: '',
        idCard: '',
        mobile: '',
        otherMobile: '',
        otherName: '',
      },
      //   修改用户信息表单参数
      editForm: {
        name: '',
        age: '',
        idCard: '',
        mobile: '',
        otherMobile: '',
        otherName: ''
      },
      //   添加表单验证规则的对象
      addFormRules: {
        name: [
          { required: true, message: '请输入您的用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入您的年龄', trigger: 'blur' },
        ],
        mobile: [
          // { min: 1, max: 12, message: '长度应为11位', trigger: 'blur' },
          { required: true, message: '请输入您的手机号', trigger: 'blur' },
          // { type: 'number', message: '请输入11位手机号（数值类型）', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入您的身份证号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        otherName: [
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        otherMobile: [
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      editDialogVisible: false
    }
  },
  methods: {
    // 查询用户列表
    async getUserList () {
      const { data: response } = await this.$http.get('/getAllSWorksUser', {
        params: this.queryUserListParams
      })
      if (response.code != 10000) {
        this.$message.error(response.msg)
      } else {
        this.userList = response.data
        this.userTotal = this.userList.length
        // console.log(this.userTotal);
        // console.log(this.userList);
      }
    },
    // 停用用户
    async delUser (row) {
      this.delUserParam.uid = row.id
      this.delUserParam.flag = row.del
      const { data: response } = await this.$http.get('/toDelUser', {
        params: this.delUserParam
      })
      if (response.code != 10000) {
        this.$message.error('服务器开小差了，请稍后重试或者联系管理员！')
      }
      if (!row.del) {
        this.$message({
          type: 'success',
          message: '该账户已停用!'
        })
      } else {
        this.$message({
          type: 'success',
          message: '该账户已恢复使用!'
        })
      }
      this.getUserList()
    },
    // 改变用户状态
    async changeDel (row) {
      // 停用用户操作
      if (!row.del) {
        await this.$confirm('是否停用该用户?', '提示', {
          confirmButtonText: '停用',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delUser(row)
            console.log('删除了')
          })
          .catch(() => {
            this.getUserList()
            this.$message({
              type: 'info',
              message: '已取消停用'
            })
          })
      } else {
        await this.$confirm('是否恢复该用户?', '提示', {
          confirmButtonText: '恢复',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delUser(row)
            console.log('删除了')
          })
          .catch(() => {
            this.getUserList()
            this.$message({
              type: 'info',
              message: '已取消恢复'
            })
          })
      }
    },
    // 监听每页显示数的改变
    handleSizeChange (newSize) {
      this.queryUserListParams.pageSize = newSize
      this.getUserList()
      // console.log(newSize);
    },
    // 监听页码的改变
    handleCurrentChange (newPage) {
      this.queryUserListParams.pageNum = newPage
      this.getUserList()
      // console.log(newPage);
    },
    // 监听添加用户框关闭后的清除操作
    closeAdd () {
      this.$refs.addFormRef.resetFields()
    },
    // 发送添加用户的请求
    async addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            '/addUser',
            this.addForm
          )
          if (response.code == 10000) {
            this.$message.success(response.msg)
            this.addDialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(response.msg)
          }
        } else {
        }
      })
    },
    // 打开修改用户弹窗，之后需要优化成先调用后端再赋值的逻辑
    showDialogVisible (user) {
      this.editForm = user
      this.editDialogVisible = true
    },
    // 发送修改用户的请求
    async editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            '/editUser',
            this.editForm
          )
          if (response.code == 10000) {
            this.$message.success(response.msg)
            this.editDialogVisible = false
            this.getUserList()
          } else {
            this.$message.error(response.msg)
          }
        } else {
        }
      })
    },
    // 关闭用户修改用户弹窗触发的操作
    closeEdit () {
      this.$refs.editFormRef.resetFields()
    },
    // 查看用户详情
    getUserInfo (uid) {
      console.log('查看详情')
      this.$alert('用户详情优化功能正在路上，敬请期待...', '工程师开发中...', {
        confirmButtonText: '确定',
        callback: action => {
          // 点击确定回调
        }
      })
      // 尚未开发，开发后会跳转到以下页面
      // console.log("uid："+uid);
      // this.$router.push('/config/user/userInfo/'+uid);
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="stylus" scoped></style>
