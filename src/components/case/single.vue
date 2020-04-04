<template>
  <div v-loading="loading" 
  element-loading-text="正在努力调用接口...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>单接口用例</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <!-- 协议下拉框 -->
        <el-col :span="3">
          <el-select clearable v-model="queryCaseListParams.protocolId" placeholder="请选择协议">
            <el-option
              v-for="item in protocolsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 选择项目 -->
        <el-col :span="3">
          <el-select clearable v-model="queryCaseListParams.projectId" placeholder="请选择项目">
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
            placeholder="请输入Case用例名"
            v-model="queryCaseListParams.query"
            clearable
            @clear="getCaseList()"
          >
          </el-input>     
        </el-col>
                  <el-col :span="2">
            <el-button icon="el-icon-search" @click="getCaseListBySelect()"></el-button>
          </el-col>
        <el-col :span="12" style="text-align:right">
          <!-- <el-button type="primary">添加</el-button> -->
          <el-button type="primary" @click="addCaseOpenDialog()">添加Case</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="caseList" border height="670" style="width: 100%">
                <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="用例名称" width="150"></el-table-column>
        <el-table-column prop="projectId" label="所属项目" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.projectId==1" type="warning">订单项目</el-tag>
            <el-tag v-if="scope.row.projectId==2" type="warning">商品项目</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="protocolId" label="请求方式" width="75">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.protocolId==1" type="success">GET</el-tag>
            <el-tag v-if="scope.row.protocolId==2" type="danger">POST</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="请求url" width="250"></el-table-column>
        <el-table-column prop="getParams" label="请求参数" width="300"></el-table-column>
        <!-- 请求头暂时不用 -->
        <!-- <el-table-column prop="header" label="请求头" width="500"></el-table-column> -->
        <el-table-column prop="assertFlag" label="断言标志" width="160"></el-table-column>
        <el-table-column prop="assertContent" label="断言内容" width="150"></el-table-column>
        <!-- 状态按钮 -->
        <el-table-column fixed="right" label="状态" width="70">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="停用该用例"
              placement="top"
              :enterable="false"
            >
              <el-switch v-if="scope.row.del" v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip
              v-if="!scope.row.del"
              class="item"
              effect="dark"
              content="继续使用该用例"
              placement="top"
              :enterable="false"
            >
              <el-switch v-if="!scope.row.del" v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="240">
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
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCaseListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryCaseListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="caseCount"
      ></el-pagination>
    </el-card>

    <!-- 添加用例的对话框 -->
    <el-dialog :close-on-click-modal="false"  title="用例添加" :visible.sync="addDialogVisible" width="50%" @close="closeAdd()">
      <span></span>
      <!-- 添加用例表单 -->
      <el-form ref="addCaseFormRef" :rules="addFormRules" :model="addCaseForm" label-width="100px">
        <el-form-item
          style="margin-left:150px"
          class="input-center"
          label="用例名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseForm.name"
            placeholder="请输入用例名"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px"
          class="input-center"
          label="协议类型"
          prop="protocolId"
        >
          <el-select style="width:80%" v-model="addCaseForm.protocolId" placeholder="请选择协议">
            <el-option
              v-for="item in protocolsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left:150px" label="所属项目" prop="projectId">
          <el-select style="width:80%" v-model="addCaseForm.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>



        <el-form-item style="margin-left:150px" label="请求地址" prop="url">
          <el-input 
            prefix-icon="el-icon-discover"
            v-model="addCaseForm.url"
            placeholder="请输入请求地址"
            style="width:80%"
          ></el-input>
        </el-form-item>


        <el-form-item style="margin-left:150px" label="前置组件" prop="preComponent">
          <el-select clearable style="width:80%" v-model="addCaseForm.preComponent" placeholder="请选择组件">
            <el-option 
              v-for="item in componentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

         <el-form-item style="margin-left:150px" label="后置组件" prop="postComponent">
          <el-select clearable style="width:80%" v-model="addCaseForm.postComponent" placeholder="请选择组件">
            <el-option 
              v-for="item in componentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item v-if="addCaseForm.protocolId == 2 " style="margin-left:150px" label="入参方式" prop="paramsType">
          <el-select style="width:80%" v-model="addCaseForm.paramsType" placeholder="请选择入参方式,目前只支持json和form表单">
            <el-option
              v-for="item in paramsType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button style="margin-left:10px" v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 2" @click="addDomain">新增参数</el-button>
        </el-form-item>


<!-- 动态增加信息 -->

  <el-form-item v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 2"
  inline style="margin-left:120px"
    v-for="(domain, index) in addCaseForm.domains"
    :label="'参数' + (index+1)"
    :key="domain.key"
    :prop="'domains.' + index + '.nameValue'"
    :rules="{
      required: true, message: '参数名不能为空', trigger: 'blur'
    }"
  > 
    <el-input placeholder="请输入参数名"
    v-model="domain.nameValue" style="width:35%" ></el-input>
    <el-input placeholder="请输入参数值"
    v-model="domain.paramValue" style="width:35%;margin-left:20px;" ></el-input>
    <el-button 
    @click.prevent="removeDomain(domain)" style="margin-left:20px;">删除</el-button>
  </el-form-item>




        <el-form-item v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 1" style="margin-left:150px" label="请求参数" prop="getParams">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="addCaseForm.getParams"
            placeholder="请输入请求参数"
            style="width:80%"
          ></el-input>
        </el-form-item>
        



        <el-form-item style="margin-left:150px" label="断言标识" prop="assertFlag">
          <el-tooltip class="item" effect="dark" 
          content='表达式目前只支持截取json格式，对象获取使用"." ,list集合使用[index]，例：data[0].code' 
          placement="top">
          <el-input
            prefix-icon="el-icon-price-tag"
            v-model="addCaseForm.assertFlag"
            placeholder="请输入断言标识，鼠标移入查看表达式规则 "
            style="width:80%"
          ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item style="margin-left:150px" label="预期断言" prop="assertContent">
          <el-input
            prefix-icon="el-icon-sort"
            v-model="addCaseForm.assertContent"
            placeholder="请输入预期的响应断言"
            style="width:80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCase()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用例弹窗 -->
    <el-dialog :close-on-click-modal="false"  title="用例编辑" :visible.sync="editDialogVisible" width="50%" @close="closeEdit()">
      <span></span>
      <!-- 修改用例表单 -->

            <el-form ref="editCaseFormRef" :rules="editFormRules" :model="editCaseForm" label-width="100px">
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用例名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="editCaseForm.name"
            placeholder="请输入用例名"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="协议类型"
          prop="protocolId"
        >
        <el-tooltip class="item" effect="dark" content="协议类型不可更改" placement="top">
            <el-select disabled style="width:93%" v-model="editCaseForm.protocolId" placeholder="请选择协议">
            
            <el-option
              v-for="item in protocolsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-tooltip>
        </el-form-item>

        <el-form-item style="margin-left:150px;margin-right:150px" label="所属项目" prop="projectId">
          <el-tooltip class="item" effect="dark" content="所属项目不可更改" placement="top">
            <el-select disabled style="width:93%" v-model="editCaseForm.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          </el-tooltip>
        </el-form-item>


        <el-form-item style="margin-left:150px;margin-right:150px" label="请求地址" prop="url">
          <el-input 
            prefix-icon="el-icon-discover"
            v-model="editCaseForm.url"
            placeholder="请输入请求地址"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <!-- 请求头,暂时先不用 -->
        <!-- <el-form-item style="margin-left:150px;margin-right:150px" label="请求头" prop="header">
          <el-input 
            prefix-icon="el-icon-stopwatch"
            v-model="addCaseForm.header"
            placeholder="请输入请求头"
            style="width:93%"
          ></el-input>
        </el-form-item> -->


        <el-form-item v-if="editCaseForm.protocolId != 1 && editCaseForm.protocolId != 4 " style="margin-left:150px;margin-right:150px" label="请求参数" prop="getParams">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="editCaseForm.getParams"
            placeholder="请输入请求参数"
            style="width:93%"
          >
          </el-input>
        </el-form-item>



         <el-form-item style="margin-left:150px;margin-right:150px" label="前置组件" prop="preComponent">
          <el-tooltip class="item" effect="dark" content="前置组件不可更改" placement="top">
          <el-select disabled style="width:93%" v-model="editCaseForm.preComponent" placeholder="请选择组件">
            <el-option 
              v-for="item in componentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          </el-tooltip>
        </el-form-item>

         <el-form-item style="margin-left:150px;margin-right:150px" label="后置组件" prop="postComponent">
          <el-tooltip class="item" effect="dark" content="后置组件不可更改" placement="top">
          <el-select disabled style="width:93%" v-model="editCaseForm.postComponent" placeholder="未选择后置组件">
            <el-option 
              v-for="item in componentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          </el-tooltip>
        </el-form-item>


        <el-form-item style="margin-left:150px;margin-right:150px" label="断言标识" prop="assertFlag">
          <el-input
            prefix-icon="el-icon-price-tag"
            v-model="editCaseForm.assertFlag"
            placeholder="请输入断言标识，使用 “[index]”或者“.” 进行向下取值，例：data[0].param "
            style="width:93%"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px;margin-right:150px" label="预期断言" prop="assertContent">
          <el-input
            prefix-icon="el-icon-sort"
            v-model="editCaseForm.assertContent"
            placeholder="请输入预期的响应断言"
            style="width:93%"
          ></el-input>
        </el-form-item>
      </el-form>
   
      <!-- 修改底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCase()">确 定</el-button>
      </span>
    </el-dialog>
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

    // 验证JSON格式规则
    var checkJson = (rule, value, callback) => {
      if (this.isJSON(value)) {
        return callback();
      }
      callback(new Error("JSON格式有误，请检查"));
    };
    return {
      // 调用接口加载的图层打开标志位
      loading:false,
      // 文本域默认高度
      textareaHigh:5,
      // 协议类型列表
      protocolsOptions: [],
      // 项目列表
      projectOptions: [],
      // 获取用例列表参数
      queryCaseListParams: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        protocolId: "",
        projectId: ""
      },
      // 停用用例列表参数
      delCaseParam: {
        cid: 0,
        flag: true
      },
      // 用例集合
      caseList: [],
      // 用例总数
      caseCount: 0,
      //   Dialogd对话框的展开标识
      addDialogVisible: false,
      //   添加用户表单规则
      addCaseForm: {
        projectId:'',
        protocolId:'',
        name: "",
        getParams: "",
        postParams: "",
        header: "",
        assertFlag: "",
        assertContent: "",
        url:"",
        preComponent:"",
        postComponent:"",
        domains: [{
            nameValue: '',
            paramValue: '',
          }],
        paramsType:''
        

      },
      // 参数类型，因为只有两种，所以写死在前端
      paramsType:[{
              id:1,
              name:'application/json'
        },{
              id:2,
              name:"application/x-www-form-urlencoded"
        }],
        // 组件列表
      componentList:[],
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
      //   添加表单验证规则的对象
      addFormRules: {
        name: [
          { required: true, message: "请输入您的用例名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        protocolId: [
          { required: true, message: "请选择协议类型", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "blur" },
        ],
        assertFlag: [
          { required: true, message: "请输入断言标志", trigger: "blur" }
        ],
        assertContent: [
           { required: true, message: "请输入断言内容", trigger: "blur" }
        ]
        ,url:[
           { required: true, message: "请输入请求URL", trigger: "blur" }
        ],
        getParams: [
          {validator : checkJson ,  trigger: "blur"}
        ],
        paramsType:[
          { required: true, message: "请选择入参方式", trigger: "blur" }
        ]

      },
      // 修改表单验证规则
      editFormRules: {
        name: [
          { required: true, message: "请输入您的用例名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        protocolId: [
          { required: true, message: "请选择协议类型", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "blur" },
        ],
        assertFlag: [
          { required: true, message: "请输入断言标志", trigger: "blur" }
        ],
        assertContent: [
           { required: true, message: "请输入断言内容", trigger: "blur" }
        ]
        ,url:[
           { required: true, message: "请输入请求URL", trigger: "blur" }
        ],
        getParams: [
          {validator : checkJson ,  trigger: "blur"}
        ]

      },
      // 修改表单的dialog弹窗打开标志位
      editDialogVisible: false
    };
  },
  methods: {
      // 删除form表单的参数
      removeDomain(item) {
        var index = this.addCaseForm.domains.indexOf(item)
        if (index !== -1) {
          this.addCaseForm.domains.splice(index, 1)
        }
      },
      // 增加form表单的参数
      addDomain() {
        this.addCaseForm.domains.push({
          nameValue: '',
          paramValue: '',
          key: Date.now()
        });

      },
      // 打开添加用例的弹窗
    addCaseOpenDialog(){
      this.getAllComponent();
      this.addDialogVisible = true;
    },
        // 获取全部组件信息
    async getAllComponent(){
         const { data: response } = await this.$http.get("/getComponentList");
        this.componentList = response.data;
    },
    // 获取全部用例，请求之前重置请求
    getCaseListBySelect(){
      this.queryCaseListParams.pageNum = 1;
      this.queryCaseListParams.pageSize = 10;
      this.getCaseList();
    },
    // JSON解析
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
    // 获取用例列表
    async getCaseList() {
      const { data: response } = await this.$http.get("/getAllCase", {
        params: this.queryCaseListParams
      });
      if (response.code != 10000) {
        this.caseList = response.data;
        this.$message.error(response.msg);
      } else {
        this.caseList = response.data;
        this.caseCount = response.caseCount;
      }
    },
    // 停用用例
    async delCase(row) {
      this.delCaseParam.cid = row.id;
      this.delCaseParam.flag = row.del;
      const { data: response } = await this.$http.get("/toDelCase", {
        params: this.delCaseParam
      });
      if (response.code != 10000) {
        this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      }
      if (!row.del) {
        this.$message({
          type: "success",
          message: "该用例已停用!"
        });
      } else {
        this.$message({
          type: "success",
          message: "该用例已恢复使用!"
        });
      }
      this.getCaseList();
    },
    // 改变用例状态
    async changeDel(row) {
      // 停用
      if (!row.del) {
        await this.$confirm("是否停用该用例?", "提示", {
          confirmButtonText: "停用",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delCase(row);
          })
          .catch(() => {
            this.getCaseList();
            this.$message({
              type: "info",
              message: "已取消停用"
            });
          });
      } else {
        await this.$confirm("是否恢复使用该用例?", "提示", {
          confirmButtonText: "恢复",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delCase(row);
            // console.log("删除了");
          })
          .catch(() => {
            this.getCaseList();
            this.$message({
              type: "info",
              message: "已取消恢复使用"
            });
          });
      }
    },
    // 监听每页显示数的改变
    handleSizeChange(newSize) {
      this.queryCaseListParams.pageSize = newSize;
      this.getCaseList();
      // console.log(newSize);
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryCaseListParams.pageNum = newPage;
      this.getCaseList();
      // console.log(newPage);
    },
    // 监听添加用户框关闭后的清除操作
    closeAdd() {
      this.$refs.addCaseFormRef.resetFields();
      this.textareaHigh = 4;

    },
    // 发送添加用例的请求
    async addCase() {
      console.log(this.addCaseForm);
      
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
    },
    // 修改表单，form表单不支持修改
    async showDialogVisible(caseInfo) {
      this.getAllComponent();
      const {data : response} = await this.$http.get("/getCaseById?id=" + caseInfo.id);
      if(response.code == 10000 ){
        if(response.data.paramsType != 2){
            this.editCaseForm = response.data;
            this.editDialogVisible = true;
        }else{
            this.$message.error("form表单的提交方式，暂不支持更改");
        }
      }else{
        this.$message.error(response.msg);
      }
    },
    // 发送修改用例的请求
    async editCase() {
      // console.log(this.editCaseForm);
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
    // 关闭修改弹窗
    closeEdit() {
      this.$refs.editCaseFormRef.resetFields();
      this.textareaHigh = 4;
    },
    // 获取协议列表
    async getProtocol() {
      const { data: response } = await this.$http.get("/getAllProtocol");
      this.protocolsOptions = response.data;
    },
    // 获取项目列表
    async getProject() {
      this.$common.getAllProject().then(data => {
      this.projectOptions = data;
    })
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
    this.getCaseList();
    this.getProtocol();
    this.getProject();
  }
};
</script>
<style lang="less" scoped></style>