<template>
  <div v-loading="loading" 
  element-loading-text="正在努力调用接口...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例配置</el-breadcrumb-item>
      <el-breadcrumb-item>组件配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <!-- 协议下拉框 -->
        <el-col :span="3">
          <el-select clearable v-model="queryComponentListParams.categoryId" placeholder="请选择组件分类">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 选择项目 -->
        <el-col :span="3">
          <el-select clearable v-model="queryComponentListParams.projectId" placeholder="请选择所属项目">
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
            v-model="queryComponentListParams.query"
            clearable
            @clear="getComponentListBySelect()"
          >
          </el-input>     
        </el-col>
                  <el-col :span="2">
            <el-button icon="el-icon-search" @click="getComponentListBySelect()"></el-button>
          </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" @click="addComponentGo()">添加组件</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="componentList" border  style="width: 100%">
                <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="组件名称" width="200"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" width="200">
          <template slot-scope="scope">
            <el-tag  type="warning">{{scope.row.projectName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="组件类别" width="200">
          <template slot-scope="scope">
            <el-tag  type="danger">{{scope.row.categoryName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="componentDescribe" label="组件描述" width="570"></el-table-column>
        <!-- <el-table-column prop="url" label="请求url" width="350"></el-table-column>
        <el-table-column prop="params" label="请求参数" width="400"></el-table-column>-->
         <!-- <el-table-column prop="assertCategoryId" label="获取来源" width="100"> 
          <template slot-scope="scope">
            <el-tag v-if="scope.row.assertCategoryId==1" type="success">headers</el-tag>
            <el-tag v-if="scope.row.assertCategoryId==2" type="danger">cookies</el-tag>
          </template>
        </el-table-column>   -->
        <!-- 状态按钮 -->
        <el-table-column fixed="right" label="状态" width="100">
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
              <el-switch  v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="toEditComponent(scope.row.id)"
              size="mini"
            >编辑组件</el-button>
            <el-button
              type="primary"
              icon="el-icon-video-play"
              size="mini"
              @click="toComponentInfo(scope.row.id)"
            >查看组件详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryComponentListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryComponentListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="componentTotal"
      ></el-pagination>
    </el-card>

    <!-- 添加组件的对话框 -->
    <el-dialog :close-on-click-modal="false" title="组件添加" :visible.sync="addComponentDialogVisible" width="50%" @close="closeAddFirst()">
      <span></span>
      <!-- 添加组件表单 -->
      <el-form ref="addComponentFormRef" :rules="addComponentFormRules" :model="addComponentForm" label-width="100px">
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="组件名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addComponentForm.name"
            placeholder="请输入组件名"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="组件类型"
          prop="categoryId"
        >
          <el-select style="width:93%" v-model="addComponentForm.categoryId" placeholder="请选择类型">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left:150px;margin-right:150px" label="所属项目" prop="projectId">
          <el-select style="width:93%" v-model="addComponentForm.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item v-if="addComponentForm.categoryId==1" style="margin-left:150px;margin-right:150px" label="请求地址" prop="url">
          <el-input 
            prefix-icon="el-icon-discover"
            v-model="addComponentForm.url"
            placeholder="请输入获取Token地址"
            style="width:93%"
          ></el-input>
        </el-form-item>
     


        <el-form-item v-if="addComponentForm.categoryId==1" style="margin-left:150px;margin-right:150px" label="请求参数" prop="params">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="addComponentForm.params"
            placeholder="请输入请求参数"
            style="width:93%"
          ></el-input>
        </el-form-item>



        <el-form-item v-if="addComponentForm.categoryId==4" style="margin-left:150px;margin-right:150px" label="数据源" prop="dataSourceId">
          <el-select style="width:93%" v-model="addComponentForm.dataSourceId" placeholder="请选择数据源">
            <el-option
              v-for="item in dataSourceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>




         <el-form-item v-if="addComponentForm.categoryId==4" style="margin-left:150px;margin-right:150px" label="SQL语句" prop="sqlContent">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="addComponentForm.sqlContent"
            placeholder="请输入SQL语句，建议查询结果只有一条记录，即使有多条，断言只会取第一条记录"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-left:150px;margin-right:150px" label="组件描述" prop="componentDescribe">
          <el-input 
            prefix-icon="el-icon-discover"
            v-model="addComponentForm.componentDescribe"
            placeholder="请输入获取组件描述"
            style="width:93%"
          ></el-input>
        </el-form-item>

      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addComponentDialogVisible = false">取 消</el-button>
        <el-button v-if="addComponentForm.categoryId==1" type="primary" @click="getTokenResponse()">下一步</el-button>
        <el-button v-if="addComponentForm.categoryId==4" type="primary" @click="getSQLDate()">下一步</el-button>
      </span>
    </el-dialog>



<!-- sql查询结果展示窗口 -->
<el-dialog
  title="SQL查询器查询结果"
  :visible.sync="SQLSelectDialogVisible"
  width="90%"
  :before-close="handleClose">
    <el-table border height="600" 
      :data="valueList"
      style="width: 100%">
      <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
      <el-table-column v-for="item in keyList"
        :prop="item"
        :label="item"
        width="160">
      </el-table-column>
</el-table>
<p style="color:red;font-size:20px">选择要断言的字段和预期结果,数据结果集最多返回50条!</p>
<br>
<el-form :inline="true" ref="addSQLSelectComponentFormRef" :rules="addSQLSelectComponentFormRules" :model="addSQLSelectComponentForm" >
    <el-form-item label="断言列" prop="assertFlag">
     <el-select style="width:250px" v-model="addSQLSelectComponentForm.assertFlag" placeholder="请选择表字段">
            <el-option
              v-for="item in keyList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
      </el-select>
    </el-form-item>



            <el-form-item  style="margin-left:25px" label="预期断言" prop="assertContent">
          <el-input 
            prefix-icon="el-icon-key"
            v-model="addSQLSelectComponentForm.assertContent"
            placeholder="请输入预期断言"
            style="width:500px"
          ></el-input>
        </el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
    <el-button @click="SQLSelectDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSqlSelectComponent()">确 定</el-button>
  </span>
</el-dialog>



    <!-- 添加组件第二步对话框 -->
        <el-dialog :close-on-click-modal="false" title="获取Token确认" :visible.sync="lookHeaderAndResponseDialog" width="80%" @close="closeAddSecond()">
      <h1 style="color:red">请确认在以下返回的信息中有您想要的Token信息,
        当前只支持从header或者cookie中获取
      </h1>

      <!-- 添加组件表单 -->
       <el-form ref="lookHeaderAndResponseRef" :rules="lookHeaderAndResponseRules" :model="lookHeaderAndResponseForm" >
        
        
        <el-form-item style="margin-left:10px;margin-right:10px" label="响应报文" prop="response">
          <el-input  type="textarea" :rows="5"
            v-model="lookHeaderAndResponseForm.response"
          ></el-input>
        </el-form-item>
        
        
        <el-form-item style="margin-left:10px;margin-right:10px" label="响应头信息" prop="headers">
          <el-input  type="textarea" :rows="5"
            v-model="lookHeaderAndResponseForm.headers"
        
          ></el-input>
        </el-form-item>

          <el-form-item style="margin-left:10px;margin-right:10px" label="响应Cookies" prop="cookies">
          <el-input  type="textarea" :rows="5"
            v-model="lookHeaderAndResponseForm.cookies"
          ></el-input>
        </el-form-item>



        <el-form-item
          style="margin-left:10px;margin-right:10px"
          class="input-center"
          label="获取Toekn的方式"
          prop="categoryId"
        >
          <el-select style="width:93%" v-model="lookHeaderAndResponseForm.assertCategoryId" placeholder="请选择获取Token方式" prop="getTokenWay">
            <el-option
              v-for="item in tokenAssertWay"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <!-- 添加组件第二部底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="backFitst()">上一步</el-button>
        <el-button type="primary" @click="addComponent()">提交</el-button>
      </span>
    </el-dialog>
    <!-- 修改用例弹窗 -->
    <el-dialog title="用例编辑" :visible.sync="editDialogVisible" width="50%" @close="closeEdit()">
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
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-tooltip>
        </el-form-item>

        <el-form-item style="margin-left:150px;margin-right:150px" label="所属项目" prop="projectId">
          <el-tooltip class="item" effect="dark" content="所属项目不可更改" placement="top">
            <el-select disabled style="width:93%" v-model="editCaseForm.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
      queryComponentListParams: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        projectId: "",
        categoryId: ""
      },
      // 删除用户表单数据
      delComponentParam: {
        id: 0,
        del: true
      },
      componentList: [],
      //   添加组件Dialogd第一步对话框的展开标识
      addComponentDialogVisible: false,
      //   添加组件第一步表单
      addComponentForm: {
        name:'',
        categoryId:'',
        projectId:'',
        params: '',
        url:'',
        dataSourceId:"",
        assertFlag:"",
        assertContent:"",
        sqlContent:""
      },
      componentTotal:0,
      dataSourceList:[],
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
      sqlId:"",
      //   添加组件第一步表单验证规则的对象
      addComponentFormRules: {
        name: [
          { required: true, message: "请输入您的组件名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请选择组件类型", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "blur" },
        ]
        ,url:[
           { required: true, message: "请输入请求URL", trigger: "blur" }
        ],
        params: [
          {validator : checkJson ,  trigger: "blur"}
        ],
        sqlContent:[
          { required: true, message: "请输入SQL", trigger: "blur" }
        ],
        dataSourceId:[
          { required: true, message: "请选择数据源", trigger: "blur" }
        ]

      },
      // 添加组件第二部表单规则验证
      lookHeaderAndResponseRules: {
        getTokenWay: [
          { required: true, message: "请选择获取Token的方式", trigger: "blur" }
        ]
      },
      addSQLSelectComponentFormRules:[],
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
      loading:false,
      keyList:[],
      valueList:[],
      SQLSelectDialogVisible:false,
      addSQLSelectComponentFormRules:{
        assertFlag:[
          { required: true, message: "请选择断言列", trigger: "blur" }
        ],
        assertContent:[
          { required: true, message: "请输入预期断言", trigger: "blur" }
        ]

      },
      addSQLSelectComponentForm:{}
    }
  },
  methods: {
    toComponentInfo(){

    },
    toEditComponent(cid){
      this.$router.push("/case/editComponent/"+cid);
    },
    addSqlSelectComponent(){
      this.addSQLSelectComponentForm.id = this.sqlId;
        console.log(this.addSQLSelectComponentForm);
        this.$refs.addSQLSelectComponentFormRef.validate(async valid => {
          if(valid){
            const {data : response} = await this.$http.post('/editComponent',this.addSQLSelectComponentForm);
            if(response.code == 10000){
              this.$message.success("添加组件成功");
              this.SQLSelectDialogVisible = false;
              this.addComponentDialogVisible = false;
            }else{
              this.$message.success("添加组件失败，请稍后重试");
            }
          }
        })

        // this.SQLSelectDialogVisible = false;
    },
    handleClose(){
        this.SQLSelectDialogVisible = false
    },
    async getSQLDate(){
       this.$refs.addComponentFormRef.validate(async valid => {
        if (valid) {
      const {data : response} = await this.$http.post('/sqlSelect',this.addComponentForm);
      // console.log(this.addComponentForm);
      if(response.code == 10000){
        this.keyList = response.data.key;
        this.valueList = response.data.value;
        this.sqlId = response.total;
        this.SQLSelectDialogVisible = true;
      }else{
        this.$message.error(response.msg);
      }
        }else{
            this.$message.error("请按照规则填写表单");
        }
       })  
    },
    async addComponentGo(){
        this.addComponentDialogVisible = true;
        this.getComponentCategory();
        this.$common.getAllDataSource().then(data =>{
          this.dataSourceList = data;
        });
      },

    async getComponentCategory(){
        const { data : response} = await this.$http.get('/getAllComponentCategory');
        this.getProject();
        this.categorys = response.data;
    },
  // 从第二步返回第一步
    backFitst(){
      this.addComponentForm = this.middleFirstFrom;
      this.addComponentDialogVisible = true;
      this.lookHeaderAndResponseDialog = false;
    },
    // 获取响应的headers和cookies和response
    async getTokenResponse(){
      // 表单校验
      this.$refs.addComponentFormRef.validate(async valid => {
        if (valid) {
          // 将第一步表单暂存，关闭第一步弹窗,打开加载图层
          this.middleFirstFrom = JSON.parse(JSON.stringify(this.addComponentForm));
          this.addComponentDialogVisible = false;
          this.loading = true;
          // 获取请求Token接口响应信息
          const { data: response } = await this.$http.post(
            "/getHeaderAndCookie",this.middleFirstFrom);
            this.loading = false;
          if (response.code == 10000) {
            // 获取Token的方式
            this.getAllTokenWay();
            this.$message.success(response.msg);
            // 关闭加载图层,打开第二步弹窗加载数据
            this.lookHeaderAndResponseForm = response.data;
            this.lookHeaderAndResponseDialog = true;
          } else {
            this.$message.error(response.msg);
            // 获取数据失败的时候,返回第一步图层,先恢复数据，再展示，让用户修改数据
            this.addComponentForm = this.middleFirstFrom;
            this.addComponentDialogVisible = true; 
          }
        } else {
          console.log('表单校验码不通过');
        } 
    });
    },
    // 获取Token的校验方式类别
    async getAllTokenWay(){
          const {data : getTokenWay } = await this.$http.get('/getTokenWay');
          if(getTokenWay.code == 10000){
            this.tokenAssertWay = getTokenWay.data;
          }else{
            this.$message.error("网络异常，请返回上一页重试");
            this.tokenAssertWay = [{
              id:-1,
              name:'获取数据失败，请返回上一页重试！'
            }]
          }
          
    },
    async addComponent(){
      const {data : response} = await this.$http.post('/addComponent',this.lookHeaderAndResponseForm);
      if(response.code == 10000){
        this.$message.success(response.msg);
        this.lookHeaderAndResponseDialog = false;
      }else{
        this.$message.error (response.msg);
        this.lookHeaderAndResponseDialog = true;
      }
      this.getComponentList();
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
    async getComponentList() {
      const { data: response } = await this.$http.get("/getComponentList", {
        params: this.queryComponentListParams
      });
      if (response.code == 10000) {
        this.componentList = response.data;
        this.componentTotal = response.total;
        // this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
    },async getComponentListBySelect() {
      this.queryComponentListParams.pageNum = 1;
      this.queryComponentListParams.pageSize = 10;
      this.getComponentList();
    },
    async delComponent(row) {
      this.delComponentParam.id = row.id;
      this.delComponentParam.del = row.del;
      const { data: response } = await this.$http.get("/toDelComponent", {
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
      this.getComponentListBySelect();
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
      this.queryComponentListParams.pageSize = newSize;
      this.getComponentList();
      // console.log(newSize);
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryComponentListParams.pageNum = newPage;
      this.getComponentList();
      // console.log(newPage);
    },
    // 监听第一步添加组件框关闭后的清除操作
    closeAddFirst() {
      this.$refs.addComponentFormRef.resetFields();
      // this.textareaHigh = 4;

    },
    closeAddSecond() {
      this.$refs.lookHeaderAndResponseRef.resetFields();
      this.$refs.addComponentFormRef.resetFields();
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
    this.getComponentList();
    this.getComponentCategory();
  }
};
</script>
<style lang="less" scoped></style>