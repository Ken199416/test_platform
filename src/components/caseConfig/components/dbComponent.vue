<template>
  <div v-loading="loading" element-loading-text="正在请求中...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/caseConfig/component'}">组件配置</el-breadcrumb-item>
      <el-breadcrumb-item>添加DB查询组件</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用例执行记录查看卡片区域 -->
    <el-card>
      <!-- 返回上一级 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button @click="back()" icon="el-icon-back" type="primary">返回</el-button>
        </el-col>
      </el-row>

      <!-- 添加组件表单 -->

      <el-form
        ref="addComponentFormRef"
        :rules="addComponentFormRules"
        :model="addComponentForm"
        label-width="100px"
      >
        <el-form-item
          style="margin-left:200px;margin-right:200px"
          class="input-center"
          label="组件名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addComponentForm.name"
            placeholder="请输入组件名称"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null"
        style="margin-left:200px;margin-right:200px" label="所属项目" prop="projectId">
          <el-select style="width:93%" v-model="addComponentForm.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-else style="margin-left:200px;margin-right:200px" label="所属项目" prop="projectId">
          <el-select disabled style="width:93%" v-model="this.$global.currentProjectName" placeholder="请选择项目">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left:200px;margin-right:200px" label="数据源" prop="dataSourceId">
          <el-select style="width:93%" v-model="addComponentForm.dataSourceId" placeholder="请选择数据源">
            <el-option
              v-for="item in dataSourceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left:200px;margin-right:200px" label="SQL语句" prop="sqlContent">
          <el-input
            type="textarea"
            :rows="5"
            prefix-icon="el-icon-key"
            v-model="addComponentForm.sqlContent"
            placeholder="请输入SQL语句，建议查询结果只有一条记录，即使有多条，断言只会取第一条记录"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:200px;margin-right:200px"
          label="组件描述"
          prop="componentDescribe"
        >
          <el-input
            type="textarea"
            :rows="5"
            prefix-icon="el-icon-key"
            v-model="addComponentForm.componentDescribe"
            placeholder="请输入组件描述"
            style="width:93%"
          ></el-input>
        </el-form-item>
        <div style="text-align:right;margin-right:280px">
          <el-button style="text-align:right" type="primary" @click="getSQLDate()">下一步</el-button>
        </div>
      </el-form>
    </el-card>

<!-- sql 查询后的dialog -->

    <el-dialog
      title="SQL查询器查询结果"
      :visible.sync="SQLSelectDialogVisible"
      width="90%"
    >
      <el-table border height="600" :data="valueList" style="width: 100%">
        <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column :key="index" v-for="(item,index) in keyList" :prop="item" :label="item" width="160"></el-table-column>
      </el-table>
      <p style="color:red;font-size:20px">选择要断言的字段和预期结果,数据结果集最多返回50条!</p>
      <br />
      <el-form
        ref="addSQLSelectComponentFormRef"
        :rules="addSQLSelectRules"
        :v-model="addSQLSelectForm"
      >

        <el-form-item label="SQL断言">
          <el-switch v-model="switchInfo.isAssert"></el-switch>
          <el-button v-if="switchInfo.isAssert"
            type="primary"
            style="margin-left:50px"
            @click="addAssertDomain()"
          >新增断言</el-button>
        </el-form-item>

        <template v-if="switchInfo.isAssert">
          <el-form-item inline style="margin-left:120px"
            v-for="(domain, index) in addSQLSelectForm.assertDomains"
            :label="'断言' + (index+1)"
            :key="domain.key"
            :prop="'assertDomains.' + index + '.name'"
            >

            <el-select
            style="width:250px"
            v-model="domain.name"
            placeholder="请选择表字段"
          >
            <el-option v-for="item in keyList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
            <el-input placeholder="请输入预期断言" v-model="domain.value" style="width:35%;margin-left:20px;"></el-input>

            <el-button
              type="danger"
              @click.prevent="removeAssertDomain(domain)"
              style="margin-left:20px;"
            >删除</el-button>
          </el-form-item>
        </template>



        <el-form-item label="SQL参数截取">
          <el-switch v-model="switchInfo.isParams"></el-switch>
          <el-button
            v-if="switchInfo.isParams"
            type="primary"
            style="margin-left:50px"
            @click="addParamsDomain()"
          >新增截取</el-button>
        </el-form-item>

        <template v-if="switchInfo.isParams" >
          <el-form-item inline style="margin-left:120px"
            v-for="(domain, index) in addSQLSelectForm.paramsDomains"
            :label="'截取' + (index+1)"
            :key="domain.key"
            :prop="'paramsDomains.' + index + '.name'"
            >
          <el-select
            style="width:250px"
            v-model="domain.name"
            placeholder="请选择表字段">
            <el-option v-for="item in keyList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
            <el-input placeholder="请输入引用名" v-model="domain.value" style="width:35%;margin-left:20px;"></el-input>
             <el-input placeholder="请输入引用名描述" v-model="domain.desc" style="width:35%;margin-left:20px;"></el-input>

            <el-button
              type="danger"
              @click.prevent="removeParamsDomain(domain)"
              style="margin-left:20px;"
            >删除</el-button>
          </el-form-item>
        </template>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SQLSelectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSqlSelectComponent()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["cid"],
  data() {
    return {
      loading: false,
      addComponentForm: {
        categoryId:"4"
      },
      keyList: [],
      valueList:[],
      sqlId:0,
      addSQLSelectComponentForm:{

      },
      dataSourceList: [],
      SQLSelectDialogVisible: false,
      addSQLSelectComponentFormRules:{
        assertFlag: [{ required: true, message: "请选择断言列", trigger: "blur" }],
        assertContent: [
          { required: true, message: "请输入预期断言", trigger: "blur" }
        ]
      },
      addComponentFormRules: {
        name: [{ required: true, message: "请输入组件名称", trigger: "blur" }],
        dataSourceId: [
          { required: true, message: "请选择数据源", trigger: "blur" }
        ],
        sqlContent: [
          { required: true, message: "请输入SQL语句", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择项目", trigger: "blur" }
        ]
      },
      projectList: [],
      componentList: [],
      categoryId: 4,
      addSQLSelectForm:{

          assertDomains: [{
            name:'',
            value: ''
          }]
        ,
          paramsDomains: [{
            name:'',
            value: '',
            desc:''
          }]
      },
      switchInfo:{
        isAssert:false,
        isParams:false
      },
      addSQLSelectRules:{}
    };
  },
  methods: {
      removeParamsDomain(item) {
        var index = this.addSQLSelectForm.paramsDomains.indexOf(item)
        if (index !== -1) {
          this.addSQLSelectForm.paramsDomains.splice(index, 1)
        }
      },
      addParamsDomain() {
        this.addSQLSelectForm.paramsDomains.push({
          name:'',
          value: '',
          desc:'',
          key: Date.now()
        });
      },

      removeAssertDomain(item) {
        var index = this.addSQLSelectForm.assertDomains.indexOf(item)
        if (index !== -1) {
          this.addSQLSelectForm.assertDomains.splice(index, 1)
        }
      },
      addAssertDomain() {
        this.addSQLSelectForm.assertDomains.push({
          name:'',
          value: '',
          key: Date.now()
        });
      },
    async addSqlSelectComponent() {
      let assertFlag = '';
      let assertContent = '';
      if(this.switchInfo.isAssert){
        for(let i=0 ; i< this.addSQLSelectForm.assertDomains.length ;i++){
        assertFlag += this.addSQLSelectForm.assertDomains[i].name + '<==>';
        assertContent += this.addSQLSelectForm.assertDomains[i].value  + "<==>";
        }
      assertFlag = assertFlag.substring(0,assertFlag.length-4);   
      assertContent = assertContent.substring(0,assertContent.length-4);
      }
      let referenceParamFlag = '';
      let referenceParamContent = '';
      let referenceParamDesc = "";
      if(this.switchInfo.isParams){
        for(let i=0 ; i< this.addSQLSelectForm.paramsDomains.length ;i++){
        referenceParamFlag += this.addSQLSelectForm.paramsDomains[i].name + '<==>';
        referenceParamContent += this.addSQLSelectForm.paramsDomains[i].value  + "<==>";
        referenceParamDesc += this.addSQLSelectForm.paramsDomains[i].desc + "<==>"
        }
      referenceParamFlag = referenceParamFlag.substring(0,referenceParamFlag.length-4);
      referenceParamContent = referenceParamContent.substring(0,referenceParamContent.length-4);
      referenceParamDesc = referenceParamDesc.substring(0,referenceParamDesc.length-4);
      }
      this.addSQLSelectComponentForm.assertFlag = assertFlag;
      this.addSQLSelectComponentForm.assertContent = assertContent;
      this.addSQLSelectComponentForm.referenceParamFlag = referenceParamFlag;
      this.addSQLSelectComponentForm.referenceParamContent = referenceParamContent;
      this.addSQLSelectComponentForm.referenceParamDesc = referenceParamDesc;
      console.log(this.addSQLSelectComponentForm);
      this.$common.post("/addSqlSelectComponent",this.addSQLSelectComponentForm);
      // 每写完，暂时暂不写这个功能

    },
    getSQLDate() {
      // 表单校验
      this.$refs.addComponentFormRef.validate(async valid => {
        if (valid) {
          this.loading = true;
          // 获取请求Token接口响应信息
          const response = await this.$common.post(
            "/sqlSelect",
            this.addComponentForm
          );
          this.loading = false;
          this.keyList = response.data.key;
          this.valueList = response.data.value;
          this.addSQLSelectComponentForm = response.total;
          this.loading = false;
          this.SQLSelectDialogVisible = true;
        } else {
          console.log("表单校验码不通过");
        }
      });
    },
    async getAllProject() {
      const data = await this.$common.getAllProject();
      this.projectList = data;
    },
    backFitst() {
      this.lookHeaderAndResponseDialog = false;
    },
    //   关闭时操作
    closeEditDialog() {
      // this.$refs.addComponentFormRules.resetFields();
    },
    getComponentInfo() {
      this.$common.getComponentInfoById(this.cid).then(data => {
        this.componentInfo = data;
      });
    },
    async editGetHeaderAndCookie() {
      this.$refs.editCaseFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/getHeaderAndCookie",
            this.componentInfo
          );
          if (response.code == 10000) {
            this.componentInfo = response.data;
            this.lookHeaderAndResponseDialog = true;
          } else {
            this.$message.error(response.msg);
          }
        }
      });
    },
    back() {
      this.$router.push("/caseConfig/component");
    },
    async editComponent() {
      this.$refs.lookHeaderAndResponseRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/editComponent",
            this.componentInfo
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.$router.push("/caseConfig/component");
          } else {
            this.$message.error(response.mag);
          }
        } else {
        }
      });
    },
    async getComponentList() {
      const data = await this.$common.getAllComponent();
      this.componentList = data;
    },
    async getAllDataSource() {
      this.dataSourceList = await this.$common.getAllDataSource();
    }
  },
  created() {
    if (
      window.sessionStorage.getItem("projectId") != null &&
      window.sessionStorage.getItem("projectName") != null
    ) {
      this.$global.currentProjectId = window.sessionStorage.getItem("projectId");
      this.$global.currentProjectName = window.sessionStorage.getItem("projectName");
      this.addComponentForm.projectId = this.$global.currentProjectId;
    }
    this.getAllProject();
    this.getComponentList();
    this.getAllDataSource();
  }
};
</script>
<style lang="less" scoped></style>