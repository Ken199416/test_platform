<template>
  <div >
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>任务中心</el-breadcrumb-item>
      <el-breadcrumb-item>定时任务</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <!-- 协议下拉框 -->
        <!-- 选择项目 -->
        <el-col :span="3" v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null">
          <el-select clearable v-model="queryJobCaseGroupListParams.projectId" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>


        <el-col :span="3" v-else>
          <el-select disabled clearable v-model="this.$global.currentProjectName" placeholder="请选择所属项目">
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
            @keyup.enter.native="getJobCaseGroupListBySelect()"
            placeholder="请输入用例集名称"
            v-model="queryJobCaseGroupListParams.query"
            clearable
            @clear="getJobCaseGroupListBySelect()"
          ></el-input>
        </el-col>
        <el-col :span="5">
          <el-button icon="el-icon-search" @click="getJobCaseGroupListBySelect()"></el-button>
        </el-col>
        <el-col :span="10" style="text-align:right">
          <el-button type="primary" @click="addJobDialog = true">添加组件</el-button>
        </el-col>
        <el-col :span="1" style="text-align:right">
          <el-button type="primary" @click="runJob()">运行Job</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="jobCaseGroupList" border style="width: 100%">
        <el-table-column fixed type="index" label="#" width="40px"></el-table-column>
        <el-table-column prop="name" label="用例集名称" width="250"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" width="200">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.projectName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="caseGroupDescribe" label="用例集描述" width="750"></el-table-column>
        <!-- 状态按钮 -->
        <el-table-column fixed="right" label="状态" width="75">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="从Job中移除该用例集"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="最后一次执行结果" width="300">
            <span style="margin-right:20px">执行通过</span>
            <el-button 
              type="success"
              icon="el-icon-check"
              plain
            ></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryJobCaseGroupListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryJobCaseGroupListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="JobCaseGroupTotal"
      ></el-pagination>
    </el-card>

<!-- 添加dialog -->
<el-dialog
  title="将用例集添加至定时任务中"
  :visible.sync="addJobDialog"
  width="30%"
  :before-close="colseAdd">

<el-form
        ref="addJobFormRef"
        :rules="addJobFormRules"
        :model="addJobForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-left:50px;" label="选择用例集" prop="id">
                <el-select
                  filterable
                  remote
                  :remote-method="getCaseGroupList"
                  style="width:80%"
                  v-model="addJobForm.id"
                  placeholder="输入用例集名称进行模糊匹配"
                >
                  <el-option
                    v-for="item in caseGroupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>


  <span slot="footer" class="dialog-footer">
    <el-button @click="addJobDialog = false">取 消</el-button>
    <el-button type="primary" @click="addCaseGroupToJob()">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // json校验
    var checkJson = (rule, value, callback) => {
      if (this.isJSON(value)) {
        return callback();
      }
      callback(new Error("JSON格式有误，请检查"));
    };
    return {
      // 文本域默认高度
      textareaHigh: 5,

      protocolsOptions: [],
      // 所属产品下拉框数据
      projectOptions: [],
      // 查询组件条件数据
      queryJobCaseGroupListParams: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        projectId: this.$global.currentProjectId,
      },
      jobCaseGroupList: [],
      JobCaseGroupTotal: 0,
      //   添加组件第一步表单验证规则的对象
      
        // params: [{ validator: checkJson, trigger: "blur" }],

      componentCatrgoryList:"",
      categorys:[],
      addJobDialog:false,
      addJobForm:{},
      caseGroupList:{
      },
      addJobFormRules:{
          id:[
            { required: true, message: '请选择用例集', trigger: 'blur' },
          ]
      },
      queryCaseGroupForm:{
          query:"",
          pageNum:1,
          pageSize:100,
          projectId:this.$global.currentProjectId
      }
    };
  },
  methods: {
    //   运行job
      runJob(){
        this.$common.get('/runJob');
        this.$message.success("已手动运行Job，请稍后在邮箱或者任务报告中查看运行结果");
      },
    //   添加job
    async addCaseGroupToJob(){
        this.$refs.addJobFormRef.validate(async valid => {
          if (valid) {
                const response = await this.$common.get("/addCaseGroupToJob?caseGroupId=" + this.addJobForm.id);
                if(response.code == 10000){
                    this.$message.success(response.msg);
                }else{
                    this.$message.error(response.msg);
                }
                    this.addJobDialog = false;
                    this.getJobCaseGroupListBySelect();
          }
        })  
        
   },
//    查询列表
    async getCaseGroupList(query){
        this.queryCaseGroupForm.query = query;
        const response = await this.$common.get("/getAllCaseGroup",this.queryCaseGroupForm);
        console.log(response);
        this.caseGroupList = response.data;
      },
    //   关闭弹窗的操作
    colseAdd(){
        this.addJobDialog = false;
        this.$refs.addJobFormRef.resetFields();
        this.caseGroupList = {};
      },
    // 通过查询获取列表
    async getJobCaseGroupListBySelect() {
      this.queryJobCaseGroupListParams.pageNum = 1;
      this.queryJobCaseGroupListParams.pageSize = 10;
      this.getJobCaseGroupList();
    },
    // 停用
    async delJobCaseGroup(row) {
      const { data: response } = await this.$http.get("/toDelCaseGroupFromJob?id=" + row.id);
      if (response.code != 10000) {
        this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      }
      this.getJobCaseGroupListBySelect();
    },
    // 改变状态
    async changeDel(row) {
      // 停用
        await this.$confirm("是否停用该组件?", "提示", {
          confirmButtonText: "停用",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delJobCaseGroup(row);
          })
          .catch(() => {
            row.del = true;
            this.$message({
              type: "info",
              message: "已取消停用"
            });
          });
    },
    // 监听每页显示数的改变
    handleSizeChange(newSize) {
      this.queryJobCaseGroupListParams.pageSize = newSize;
      this.getComponentList();
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryJobCaseGroupListParams.pageNum = newPage;
      this.getComponentList();
    },
    // 获取project列表
    async getProject() {
      const { data: response } = await this.$http.get("/getAllProject");
      this.projectOptions = response.data;
    },
    // 获取列表
    async getJobCaseGroupList(){
        const response = await this.$common.get('/getJobCaseGroup',this.queryJobCaseGroupListParams);
        console.log(response);
        this.jobCaseGroupList = response.data;
        this.JobCaseGroupTotal = response.total;
    },
    
  },
  created() {
        if (
      window.sessionStorage.getItem("projectId") != null &&
      window.sessionStorage.getItem("projectName") != null
    ) {
      this.$global.currentProjectId = window.sessionStorage.getItem("projectId");
      this.$global.currentProjectName = window.sessionStorage.getItem("projectName");
      this.queryJobCaseGroupListParams.projectId = this.$global.currentProjectId;
    }
    this.getProject();
    this.getJobCaseGroupList();
  }
};
</script>
<style lang="less" scoped></style>