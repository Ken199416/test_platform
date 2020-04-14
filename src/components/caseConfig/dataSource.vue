<template>
  <div v-loading="loading" 
  element-loading-text="正在努力调用接口...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例配置</el-breadcrumb-item>
      <el-breadcrumb-item>数据源配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <!-- DB类型下拉框 -->
        <el-col :span="3">
          <el-select clearable @clear="getDataSourceBySelect()" v-model="queryDataSourceListParams.dbType" placeholder="请选择DB类型">
            <el-option
              v-for="item in dbTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 选择项目 -->
        <el-col :span="3" v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null">
          <el-select clearable @clear="getDataSourceBySelect()" v-model="queryDataSourceListParams.projectId" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>


        <el-col :span="3" v-else>
          <el-select disabled clearable @clear="getDataSourceBySelect()" v-model="this.$global.currentProjectName" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-input
            @keyup.enter.native="getCaseList()"
            placeholder="请输入组件名称"
            v-model="queryDataSourceListParams.query"
            clearable
            @clear="getDataSourceBySelect()"
          >
          </el-input>     
        </el-col>
                  <el-col :span="2">
            <el-button icon="el-icon-search" @click="getDataSourceBySelect()"></el-button>
          </el-col>
        <el-col :span="12" style="text-align:right">
          <!-- <el-button type="primary">添加</el-button> -->
          <el-button type="primary" @click="addDataSourceOpenDialog()">添加数据源配置</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="dataSourceConfigList" border height="670" style="width: 100%">
                <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="数据源名称" width="200"></el-table-column>
        <el-table-column prop="projectId" label="所属项目" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.projectId==1" type="warning">订单项目</el-tag>
            <el-tag v-if="scope.row.projectId==2" type="warning">商品项目</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dbtype" label="DB类型" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.dbType==1" type="success">MYSQL</el-tag>
            <el-tag v-if="scope.row.dbType==2" type="success">ORACLE</el-tag>
            <el-tag v-if="scope.row.dbType==3" type="success">SQL SERVER</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="请求url" width="350"></el-table-column>
        <!-- <el-table-column prop="assertContent" label="断言内容" width="200"></el-table-column> -->
        <!-- 状态按钮 -->
        <!-- <el-table-column fixed="right" label="状态" width="100">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="停用该组件"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="继续使用该组件"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column> -->
        <!-- 操作列 -->
        <!-- <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="showDialogVisible(scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="primary"
              icon="el-icon-video-play"
              size="mini"
              @click="runCaseById(scope.row.id)"
            >执行</el-button>


            <el-tooltip
              class="item"
              effect="dark"
              content="查看用例执行记录"
              placement="top"
              :enterable="false"
            >
              <el-button
              size="mini"
              icon="el-icon-view"
              @click="getExecuteRecoding(scope.row.id)"
            ></el-button>
            </el-tooltip>
            

          </template>
        </el-table-column> -->
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryDataSourceListParams.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryDataSourceListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataSourceTotal"
      ></el-pagination>
    </el-card>

    <!-- 添加数据源的对话框 -->
    <el-dialog :close-on-click-modal="false" title="数据源配置添加" :visible.sync="addDataSourceDialogVisible" width="50%" @close="closeAddFirst()">
      <span></span>
      <!-- 添加数据源表单 -->
      <el-form ref="addDataSourceFormRef" :rules="addDataSourceFormRules" :model="addDataSourceForm" label-width="100px">
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="数据源名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addDataSourceForm.name"
            placeholder="请输入数据源名称"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="DB类型"
          prop="dbType"
        >
          <el-select style="width:93%" v-model="addDataSourceForm.dbType" placeholder="请选择类型">
            <el-option
              v-for="item in dbTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null"
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="所属项目"
          prop="projectId"
        >
        <el-select style="width:93%" v-model="addDataSourceForm.projectId" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-else
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="所属项目"
          prop="projectId"
        >
        <el-select disabled style="width:93%" v-model="this.$global.currentProjectName" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>



        <el-form-item style="margin-left:150px;margin-right:150px" label="DB连接地址" prop="url">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="addDataSourceForm.url"
            placeholder="请输入DB连接地址"
            style="width:93%"
          ></el-input>
        </el-form-item>

        
        <el-form-item style="margin-left:150px;margin-right:150px" label="连接用户名" prop="user">
          <el-input 
            prefix-icon="el-icon-key"
            v-model="addDataSourceForm.user"
            placeholder="请输入连接用户名"
            style="width:93%"
          ></el-input>
        </el-form-item>

        
        <el-form-item style="margin-left:150px;margin-right:150px" label="用户密码" prop="password">
          <el-input 
          type="password"
            prefix-icon="el-icon-key"
            v-model="addDataSourceForm.password"
            placeholder="请输入用户密码"
            style="width:93%"
          ></el-input>
        </el-form-item>


      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDataSourceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDataSource()">确 定</el-button>
      </span>
    </el-dialog>


    
  </div>
</template>
<script>
export default {
  data() {
    var checkJson = (rule, value, callback) => {
      if (this.isJSON(value)) {
        return callback();
      }
      callback(new Error("JSON格式有误，请检查"));
    };
    return {
      // 文本域默认高度
      textareaHigh:5,
      
      protocolsOptions: [],
      // 所属产品下拉框数据
      projectOptions: [],
      // 查询组件条件数据
      queryDataSourceListParams: {
        query: "",
        pageNum: 1,
        pageSize: 5,
        projectId: "",
        dbType: ""
      },    
      dbTypes:[
          {id:1,
          name:"MYSQL"},
          {id:2,
          name:"ORACLE"},
          {id:3,
          name:"SQL SERVER"
          }
      ],
      // 删除用户表单数据
      delComponentParam: {
        id: 0,
        del: true
      },
      dataSourceConfigList: [],
      caseCount: 0,
      //   添加组件Dialogd第一步对话框的展开标识
      addDataSourceDialogVisible: false,
      //   添加组件第一步表单
      addDataSourceForm: {
        name:'',
        dbType:'',
        url:'',
        user: '',
        password:'',
        projectId:""
      },
      dataSourceTotal:0,
      //   修改用户信息
      editCaseForm: {
        // id: 0,
        // name: "",
        // protocolId: 2,
        // projectId: 1,
        // getParams: "",
        // postParams: "",
        // header: "",
        // assertFlag: "",
        // assertContent: "",
        // url:''checkJson
      },
      //   添加组件第一步表单验证规则的对象
      addDataSourceFormRules: {
        name: [
          { required: true, message: "请输入您的数据源名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        dbType: [
          { required: true, message: "请选择DB类型", trigger: "blur" }
        ],
        url: [
          { required: true, message: "请输入连接地址", trigger: "blur" },
        ]
        ,username:[
           { required: true, message: "请输入连接用户名", trigger: "blur" }
        ],
        password: [
           { required: true, message: "请输入用户名密码", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "blur" }

        ]

      },
      // 添加组件第二部表单规则验证
      lookHeaderAndResponseRules: {
        getTokenWay: [
          { required: true, message: "请选择获取Token的方式", trigger: "blur" }
        ]
      },
      editFormRules:{},
      // 中间表单,用于承接第一步,第二步的数据
      middleFirstFrom:{},
      // 修改组件Dialog标识
      editDialogVisible: false,
      // 分类数据
      categorys:[],
      // 第二步表单的Dialog标识
      lookHeaderAndResponseDialog:false,
      // 第二步的表单数据
      lookHeaderAndResponseForm:{
      },
      // 获取方式数据
      tokenAssertWay:{},
      // 图层加载标识
      loading:false
      }
  },
  methods: {
    // 添加数据源配置
    async addDataSourceOpenDialog(){
      this.getProject();
      this.addDataSourceDialogVisible = true;
      },
  // 从第二步返回第一步
    // 添加对应的数据源
    async addDataSource(){
      // 表单校验
      this.$refs.addDataSourceFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/addDataSource",this.addDataSourceForm);
          if(response.code == 10000){
            this.addDataSourceDialogVisible = false;
            this.$message.success(response.msg);
            this.getDataSourceList();
          }else{
            this.$message.error(response.msg);
          }
        }
      })
    },
//  
    async getDataSourceList(){
       const {data : response} = await this.$http.get('/getDataSourceConfig',{
         params:this.queryDataSourceListParams});
         if(response.code == 10000){
           this.dataSourceConfigList = response.data;
           this.dataSourceTotal = response.total;
          }else{
           this.$message.error(response.msg);
         }
    },
    isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log('error：'+str+'!!!'+e);
            return false;
        }
      return true;
      }
    },
    async getDataSourceBySelect() {
      this.queryDataSourceListParams.pageNum = 1;
      this.queryDataSourceListParams.pageSize = 5;
      this.getDataSourceList();
    },
    async delComponent(row) {
      this.delComponentParam.id = row.id;
      this.delComponentParam.del = row.del;
      const { data: response } = await this.$http.get("/toDeComponent", {
        params: this.delComponentParam
      });
      if (response.code != 10000) {
        this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      }
      if (!row.del) {
        this.$message({
          type: "success",
          message: "该组件已停用!"
        });
      } else {
        this.$message({
          type: "success",
          message: "该组件已恢复使用!"
        });
      }
      this.getDataSourceBySelect();
    },
    // handleClick(row) {
    //   console.log(row);
    // },
    async changeDel(row) {
      // 停用
      if (!row.del) {
        await this.$confirm("是否停用该组件?", "提示", {
          confirmButtonText: "停用",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delComponent(row);
          })
          .catch(() => {
            row.del = true;
            this.$message({
              type: "info",
              message: "已取消停用"
            });
          });
      } else {
        await this.$confirm("是否恢复使用该组件?", "提示", {
          confirmButtonText: "恢复",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delComponent(row);
          })
          .catch(() => {
            row.del = false;
            this.$message({
              type: "info",
              message: "已取消恢复使用"
            });
          });
      }
    },
    // 监听每页显示数的改变
    handleSizeChange(newSize) {
      this.queryDataSourceListParams.pageSize = newSize;
      this.getDataSourceList();
      // console.log(newSize);
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryDataSourceListParams.pageNum = newPage;
      this.getDataSourceList();
      // console.log(newPage);
    },
    // 监听第一步添加组件框关闭后的清除操作
    closeAddFirst() {
      this.$refs.addDataSourceFormRef.resetFields();
      // this.textareaHigh = 4;

    },
    closeAddSecond() {
      // this.$refs.lookHeaderAndResponseRef.resetFields();
      this.textareaHigh = 4;

    },
    // 发送添加用例的请求
    async addCase() {
      if(this.addCaseForm.protocolId == 1){
          this.addCaseForm.getParams = '';
      }
      this.$refs.addCaseFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/addCase",
            this.addCaseForm
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.addDialogVisible = false;      
          } else {
            this.$message.error(response.msg);
            this.addDialogVisible = true; 
          }
        } else {
        }
        this.getCaseList();
      });
        // console.log(this.addCaseForm);
    },
    async showDialogVisible(caseInfo) {
      // console.log(user);
      this.editDialogVisible = true;
      const {data : response} = await this.$http.get("/getCaseById?id=" + caseInfo.id);
      if(response.code == 10000){
        this.editCaseForm = response.data;
      }else{
        this.$message.error(response.msg);
      }
    },
    // 发送修改用例的请求
    async editCase() {
      this.$refs.editCaseFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/editCase",
            this.editCaseForm
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.editDialogVisible = false;
            this.getCaseList();
          } else {
            this.$message.error(response.msg);
          }
        } else {
        }
      });
    },
    closeEdit() {
      this.$refs.editCaseFormRef.resetFields();
      this.textareaHigh = 4;
    },
    async getProject() {
      const { data: response } = await this.$http.get("/getAllProject");
      this.projectOptions = response.data;
    },
    async runCaseById (id){
        this.loading = true;
        const {data : response} = await this.$http.get("/runCaseById?id="+ id);
        this.loading = false;
        if(response.code == 10000){
            this.$message.success(response.msg);
        }else{
            this.$message.error(response.msg);
        }
    },
    async getExecuteRecoding(cid){
      this.$router.push("/case/executeRecoding/"+cid);

    }
  },
  created() {
    if (
      window.sessionStorage.getItem("projectId") != null &&
      window.sessionStorage.getItem("projectName") != null
    ) {
      this.$global.currentProjectId = window.sessionStorage.getItem("projectId");
      this.$global.currentProjectName = window.sessionStorage.getItem("projectName");
      this.addDataSourceForm.projectId = this.$global.currentProjectId;
      this.queryDataSourceListParams.projectId = this.$global.currentProjectId;
    }
    this.getProject();
    this.getDataSourceList();
  }
};
</script>
<style lang="less" scoped></style>