<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <el-col :span="4">
          <!-- <el-button type="primary">添加</el-button> -->
          <el-button type="primary" @click="noDo()">添加权限</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="permissionList" border stripe>
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="name" label="权限名" width="200"></el-table-column>
        <el-table-column prop="url" label="路径" width="300"></el-table-column>
        <el-table-column prop="leave" label="等级" width="80">
          <template slot-scope="scope">
          <el-tag v-if="scope.row.leave==0" type="danger">等级一</el-tag>
          <el-tag v-if="scope.row.leave==1" type="warning">等级二</el-tag>
          <el-tag v-if="scope.row.leave==2" type="success">等级三</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userGroup" label="用户组" width="200"></el-table-column>
        <!-- 状态按钮 -->
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="停用该权限"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="恢复该权限"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryPermissionListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryPermissionListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="permissionTotal"
      ></el-pagination>
    </el-card>
    <div>
      <h1>
        后端功能开发中，当前页面仅供预览！！！
      </h1>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    //   验证邮箱
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    //    验证手机号
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      // 获取权限列表
      queryPermissionListParams: {
        query: "",
        pageNum: 1,
        pageSize: 10
      },
      delPermissionParam: {
        uid: 0,
        flag: true
      },
      permissionList: [
        {
          id: 1,
          name: "权限名测试数据1",
          url: "test/test1",
          leave: 0,
          userGroup: "测试用户组1",
          del: true
        },
        {
          id: 2,
          name: "权限名测试数据2",
          url: "test/test2",
          leave: 1,
          userGroup: "测试用户组2",
          del: true
        },
        {
          id: 3,
          name: "权限名测试数据3",
          url: "test/test3",
          leave: 2,
          userGroup: "测试用户组3",
          del: true
        }
      ],
      permissionTotal: 1,
      //   Dialogd对话框的展开标识
      addDialogVisible: false,
      //   添加用户表单规则
      addForm: {
        id: 0,
        username: "",
        password: "",
        mobile: "",
        email: "",
        address: "",
        company: "",
        department: "",
        customerName: ""
      },
      //   修改用户信息
      editForm: {
        username: "",
        mobile: "",
        email: "",
        address: "",
        company: "",
        department: "",
        customerName: ""
      },
      //   添加表单验证规则的对象
      addFormRules: {
        username: [
          { required: true, message: "请输入您的用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
          { min: 4, max: 20, message: "长度在 4 到 20 个字符", trigger: "blur" }
        ],
        mobile: [
          // { min: 1, max: 12, message: '长度应为11位', trigger: 'blur' },
          { required: true, message: "请输入您的手机号", trigger: "blur" },
          // { type: 'number', message: '请输入11位手机号（数值类型）', trigger: 'blur' },
          { validator: checkMobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入您的手机号", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        address: [
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ],
        company: [
          { min: 2, max: 40, message: "长度在 2 到 40 个字符", trigger: "blur" }
        ],
        department: [
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "请输入您的昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      },
      editDialogVisible: false
    };
  },
  methods: {
    async getPermissionList() {
      const { data: response } = await this.$http.get("/queryPermission", {
        params: this.queryPermissionListParams
      });
      if (response.code != 10000) {
        this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      } else {
        this.userList = response.data;
        this.userTotal = response.total;
        // console.log(this.userTotal);
        // console.log(this.userList);
      }
    },
    async delUser(row) {
      //   this.delUserParam.uid = row.id;
      //   this.delUserParam.flag = row.del;
      //   const { data: response } = await this.$http.get("/toDelUser", {
      //     params: this.delUserParam
      //   });
      //   if (response.code != 10000) {
      //     this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      //   }
      if (!row.del) {
        this.$message({
          type: "success",
          message: "该权限已停用!"
        });
      } else {
        this.$message({
          type: "success",
          message: "该权限已恢复使用!"
        });
      }
      //   this.getUserList();
    },
    // handleClick(row) {
    //   console.log(row);
    // },
    async changeDel(row) {
      // 停用权限
      if (!row.del) {
        await this.$confirm("是否停用该权限?", "提示", {
          confirmButtonText: "停用",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delUser(row);
            console.log("删除了");
          })
          .catch(() => {
            row.del = !row.del;
            this.$message({
              type: "info",
              message: "已取消停用"
            });
          });
      } else {
        await this.$confirm("是否恢复该用户?", "提示", {
          confirmButtonText: "恢复",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delUser(row);
          })
          .catch(() => {
            row.del = !row.del;
            this.$message({
              type: "info",
              message: "已取消恢复"
            });
          });
      }
    },
    // 监听每页显示数的改变
    handleSizeChange(newSize) {
      this.queryUserListParams.pageSize = newSize;
      this.getUserList();
      // console.log(newSize);
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryUserListParams.pageNum = newPage;
      this.getUserList();
      // console.log(newPage);
    },
    // 监听添加用户框关闭后的清除操作
    closeAdd() {
      this.$refs.addFormRef.resetFields();
    },
    // 发送添加用户的请求
    async addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/addUser",
            this.addForm
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.addDialogVisible = false;
            this.getUserList();
          } else {
            this.$message.error(response.msg);
          }
        } else {
        }
      });
    },
    showDialogVisible(user) {
      // console.log(user);
      this.editForm = user;
      this.editDialogVisible = true;
    },
    // 发送修改用户的请求
    async editUser() {
      // console.log(this.editForm);
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/editUser",
            this.editForm
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.editDialogVisible = false;
            this.getUserList();
          } else {
            this.$message.error(response.msg);
          }
        } else {
        }
      });
    },
    closeEdit() {
      this.$refs.editFormRef.resetFields();
    },
    getUserInfo(uid) {
      console.log("查看详情");
      this.$alert("用户详情优化功能正在路上，敬请期待...", "工程师开发中...", {
        confirmButtonText: "确定",
        callback: action => {
          // 点击确定回调
        }
      });
      //尚未开发，开发后会跳转到以下页面
      // console.log("uid："+uid);
      // this.$router.push('/config/user/userInfo/'+uid);
    },
    noDo() {
      this.$alert("用户权限功能正在路上，敬请期待...", "工程师开发中...", {
        confirmButtonText: "确定",
        callback: action => {
          // 点击确定回调
        }
      });
    }
  },
  created() {
    // this.getPermissionList();
    // this.$alert("后端功能开发中，此页面数据仅供效果预览，请知晓！！！", "权限页面说明", {
    //     confirmButtonText: "确定",
    //     callback: action => {
    //       // 点击确定回调
    //     }
    //   });
  }    
}
</script>
<style lang="stylus" scoped></style>