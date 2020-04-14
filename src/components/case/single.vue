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
        <el-col :span="3" v-if="this.currentProjectId == ''">
          <el-select clearable v-model="queryCaseListParams.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>


                <!-- 选择项目 -->
        <el-col :span="3" v-else>
          <el-select clearable disabled v-model="currentProjectName" placeholder="请选择项目">
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
          <el-button type="primary" @click="toAddCaseAction()">添加Case</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="caseList" border height="650" style="width: 100%">
                <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="用例名称" width="190"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" width="120">
          <template slot-scope="scope">
            <el-tag  type="warning">{{scope.row.projectName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="protocolId" label="请求方式" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.protocolId==1" type="success">GET</el-tag>
            <el-tag v-if="scope.row.protocolId==2" type="danger">POST</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="请求url" width="250"></el-table-column>
        <!-- <el-table-column prop="getParams" label="请求参数" width="300"></el-table-column> -->
        <el-table-column prop="assertFlag" label="断言标志" width="180"></el-table-column>
        <el-table-column prop="assertContent" label="断言内容" width="180"></el-table-column>
        <el-table-column prop="preCaseGroup" label="前置用例集" width="200"></el-table-column>
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
              @click="toEditCaseAction(scope.row)"
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      drawer:false,
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
      caseGroupList:{},
      queryForm:{
        query:"",
        pageNum:1,
        pageSize:50,
      },
      currentProjectId:'',
      currentProjectName:''
    };
  },
  methods: {
    toEditCaseAction(row){
      this.$router.push('/case/single/action/'+row.id);
    },
    toAddCaseAction(){
    //  前往添加用例路由
      this.$router.push('/case/single/action/add');
    },
    // 获取全部用例，请求之前重置请求
    getCaseListBySelect(){
      this.queryCaseListParams.pageNum = 1;
      // this.queryCaseListParams.pageSize = 10;
      this.getCaseList();
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

    },
    changeProject(id,name){
      window.sessionStorage.setItem("projectId",id);
      window.sessionStorage.setItem("projectName",name);
      location.reload();
    },
    delProject(){
      window.sessionStorage.removeItem("projectId");
      window.sessionStorage.removeItem("projectName");
      location.reload();
    }
  },
  created() {
    if(window.sessionStorage.getItem("projectId") != null){
      this.queryCaseListParams.projectId = window.sessionStorage.getItem("projectId");
      this.currentProjectName = window.sessionStorage.getItem("projectName");
      this.currentProjectId = window.sessionStorage.getItem("projectId");
    }
    this.getCaseList();
    this.getProtocol();
    this.getProject();
  },
    beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
  }
};
</script>
<style lang="less" scoped></style>