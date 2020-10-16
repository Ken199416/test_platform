<template>
  <div v-loading="loading" element-loading-text="正在努力调用接口...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>单接口用例</el-breadcrumb-item>
      <el-breadcrumb-item>{{cid == 'add'? '添加':'编辑'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button @click="goBack()" icon="el-icon-back" type="primary">返回</el-button>
        </el-col>
      </el-row>
      <!-- 请求前的表单 -->
      <el-form ref="addCaseFormRef" :rules="addFormRules" :model="addCaseForm" label-width="100px">
        <el-form-item style="margin-left:150px" class="input-center" label="用例名称" prop="name">
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseForm.name"
            placeholder="请输入用例名"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-left:150px" class="input-center" label="协议类型" prop="protocolId">
          <el-select
            :disabled="cid != 'add'"
            style="width:80%"
            v-model="addCaseForm.protocolId"
            placeholder="请选择协议"
          >
            <el-option
              v-for="item in protocolsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null" style="margin-left:150px" label="所属项目" prop="projectId">
          <el-select
            :disabled="cid != 'add'"
            style="width:80%"
            v-model="addCaseForm.projectId"
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  v-else style="margin-left:150px" label="所属项目" prop="projectId">
          <el-select
            disabled
            style="width:80%"
            v-model="this.$global.currentProjectName"
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
<!-- 添加 -->
        <el-form-item v-if="cid == 'add'" style="margin-left:150px" label="前置用例集" prop="preCaseGroupId">
          <el-select
            filterable
            @clear="clearSelect()"
            :disabled="addCaseForm.projectId == ''"
            remote
            :remote-method="getCaseGroupList"
            clearable
            style="width:80%"
            v-model="addCaseForm.preCaseGroupId"
            placeholder="选择项目后，方可输入用例集名称进行模糊查询"
          >
            <el-option
              v-for="item in caseGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="success" icon="el-icon-view" @click="getCaseGroupInfo(addCaseForm.preCaseGroupId)"
           style="margin-left:1%" v-if="addCaseForm.preCaseGroupId != null && addCaseForm.preCaseGroupId != ''"></el-button>
        </el-form-item>

<!-- 编辑 -->
        <el-form-item v-else style="margin-left:150px" label="前置用例集" prop="preCaseGroupId">
          <el-select
            filterable
            @clear="clearSelect()"
            disabled
            remote
            :remote-method="getCaseGroupList"
            clearable
            style="width:80%"
            v-model="preCaseGroupName"
            placeholder="选择项目后，方可输入用例集名称进行模糊查询"
          >
            <el-option
              v-for="item in caseGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="success" icon="el-icon-view" @click="getCaseGroupInfo(addCaseForm.preCaseGroupId)"
           style="margin-left:1%" v-if="addCaseForm.preCaseGroupId != null && addCaseForm.preCaseGroupId != ''"></el-button>
        </el-form-item>

      <el-table stripe  v-if="openCaseListFlag && addCaseForm.preCaseGroupId != null && addCaseForm.preCaseGroupId != ''" border
      :data="caseListTable"
      style="width: 67%;margin-left:250px">
      <!-- 展开列 -->
      <el-table-column type="expand" >
        <template slot-scope="props">
        <el-form label-position="left" >
          <el-form-item label="参数引用详情" :key="index" v-for="(item,index) in props.row.reference">
            引用名：<span style="color:red">{{ item.referenceName}}</span> ，
            引用描述： <span style="color:red">{{ item.referenceDesc}}</span>
          </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="pri"
        label="执行优先级"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用例名"
        width="300">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="用例描述">
      </el-table-column>
    </el-table>
        <br/>
        <el-form-item style="margin-left:150px" label="请求地址" prop="url">
          <el-input
            :disabled="cid != 'add'"
            prefix-icon="el-icon-discover"
            v-model="addCaseForm.url"
            placeholder="请输入请求地址"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="addCaseForm.protocolId == 2 "
          style="margin-left:150px"
          label="入参方式"
          prop="paramsType"
        >
          <el-select
            :disabled="cid != 'add'"
            style="width:80%"
            v-model="addCaseForm.paramsType"
            placeholder="请选择入参方式,目前只支持json和form表单"
          >
            <el-option
              v-for="item in paramsType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            style="margin-left:10px"
            v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 2"
            @click="addDomain"
          >新增参数</el-button>
        </el-form-item>

        <!-- 动态增加信息 -->
        <template v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 2">
          <el-form-item
            inline
            style="margin-left:120px"
            v-for="(domain, index) in addCaseForm.domains"
            :label="'参数' + (index+1)"
            :key="domain.key"
            :prop="'domains.' + index + '.nameValue'"
            :rules="{
      required: true, message: '参数名不能为空', trigger: 'blur'
    }"
          >
            <el-input placeholder="请输入参数名" v-model="domain.nameValue" style="width:35%"></el-input>
            <el-input
              placeholder="请输入参数值"
              v-model="domain.paramValue"
              style="width:35%;margin-left:20px;"
            ></el-input>
            <el-button @click.prevent="removeDomain(domain)" style="margin-left:20px;">删除</el-button>
          </el-form-item>
        </template>

        <el-form-item
          v-if="addCaseForm.protocolId == 2 && addCaseForm.paramsType == 1"
          style="margin-left:150px"
          label="请求参数"
          prop="jsonParams"
        >
          <el-input
            type="textarea"
            :rows="5"
            prefix-icon="el-icon-key"
            v-model="addCaseForm.jsonParams"
            placeholder="请输入请求参数"
            style="width:80%"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-left:150px" class="input-center" label="描述" prop="desc">
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseForm.desc"
            placeholder="请输入用例名"
            style="width:80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加底部区域 -->
      <div style="text-align:right;margin-right:17%">
        <el-button @click="goBack()">取 消</el-button>
        <el-button type="primary" @click="getResponse()">请 求</el-button>
      </div>
    </el-card>

    <!-- 请求详情弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="请求详情"
      :visible.sync="setAssertCaseDialog"
      width="80%"
      @close="closeEdit()"
    >
      <span></span>
      <!-- 请求详情表单 -->

      <el-form
        ref="setAssertCaseFormRef"
        :rules="setAssertFormRules"
        :model="setAssertCaseForm"
        label-width="100px"
      >
        <el-form-item style="margin-left:10px;margin-right:10px" label="响应报文" prop="response">
          <el-input type="textarea" :rows="5" v-model="responseStr"></el-input>
        </el-form-item>

        <el-form-item label="响应断言">
          <el-switch v-model="switchInfo.isAssert"></el-switch>
          <el-button
            type="primary"
            style="margin-left:50px"
            v-if="switchInfo.isAssert"
            @click="addAssertDomain"
          >新增断言</el-button>
        </el-form-item>

        <template v-if="switchInfo.isAssert">
          <el-form-item
            inline
            style="margin-left:120px"
            v-for="(domain, index) in setAssertCaseForm.assertDomains"
            :label="'断言' + (index+1)"
            :key="domain.key"
            :prop="'assertDomains.' + index + '.nameValue'"
            :rules="{
      required: true, message: '断言表达式不能为空', trigger: 'blur'
    }"
          >
            <el-input placeholder="请输入断言表达式" v-model="domain.nameValue" style="width:35%"></el-input>
            <el-input
              placeholder="请输入预期断言"
              v-model="domain.paramValue"
              style="width:35%;margin-left:10px;"
            ></el-input>
            <el-button
              type="danger"
              @click.prevent="removeAddAssertDomain(domain)"
              style="margin-left:10px;"
            >删除</el-button>
            <el-button
              type="success"
              @click.prevent="queryAssert(index+1,domain.nameValue)"
              style="margin-left:10px;"
            >查看断言结果</el-button>
          </el-form-item>
          <div style="margin-left:250px;margin-bottom:50px">
            <span style="font-size:20px">
              响应断言 {{assertResultIndex}} : 【
              <span style="color:red">{{assertResult}}</span>】
            </span>
          </div>
        </template>

        <el-form-item label="参数截取">
          <el-switch v-model="switchInfo.isReference"></el-switch>
          <el-button
            type="primary"
            style="margin-left:50px"
            v-if="switchInfo.isReference"
            @click="addParamsDomain"
          >新增参数截取</el-button>
        </el-form-item>

        <template v-if="switchInfo.isReference">
          <el-form-item
            inline
            style="margin-left:120px"
            v-for="(domain, index) in setAssertCaseForm.paramsDomains"
            :label="'截取参数' + (index+1)"
            :key="domain.key"
            :prop="'paramsDomains.' + index + '.nameValue'"
            :rules="{
      required: true, message: '截取表达式不能为空', trigger: 'blur'
    }"
          >
            <el-input placeholder="请输入截取参数表达式" v-model="domain.nameValue" style="width:20%"></el-input>
            <el-input
              placeholder="请输入引用名"
              v-model="domain.paramValue"
              style="width:20%;margin-left:10px;"
            ></el-input>
            <el-input
              placeholder="引用描述"
              v-model="domain.paramDesc"
              style="width:30%;margin-left:10px;"
            ></el-input>
            <el-button
              type="danger"
              @click.prevent="removeParamsDomain(domain)"
              style="margin-left:10px;"
            >删除</el-button>
            <el-button
              type="success"
              @click.prevent="queryReference(index+1,domain.nameValue)"
              style="margin-left:10px;"
            >查看截取参数</el-button>
          </el-form-item>
          <div style="margin-left:250px;">
            <span style="font-size:20px">
              截取参数 {{referenceResultIndex}} : 【
              <span style="color:red">{{referenceResult}}</span>】
            </span>
          </div>
        </template>
      </el-form>

      <!-- 修改底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAssertCaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCase()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['cid'],
  data () {
    // 验证JSON格式规则
    var checkJson = (rule, value, callback) => {
      if (this.isJSON(value)) {
        return callback()
      }
      callback(new Error('JSON格式有误，请检查'))
    }
    return {
      // 调用接口加载的图层打开标志位
      loading: false,
      // 文本域默认高度
      textareaHigh: 5,
      // 协议类型列表
      protocolsOptions: [],
      // 项目列表
      projectOptions: [],

      addDialogVisible: false,
      //   添加用户表单规则
      addCaseForm: {
        projectId: '',
        protocolId: '',
        name: '',
        jsonParams: '',
        postParams: '',
        header: '',
        assertFlag: '',
        assertContent: '',
        url: '',
        preComponent: '',
        postComponent: '',
        domains: [
          {
            nameValue: '',
            paramValue: ''
          }
        ],
        paramsType: '',
        assertDomains: [
          {
            nameValue: '',
            paramValue: ''
          }
        ],
        paramsDomains: [
          {
            nameValue: '',
            paramValue: '',
            paramDesc: ''
          }
        ],
        preCaseGroupIndex: ''
      },
      paramsDomains: [
        {
          nameValue: '',
          paramValue: '',
          paramDesc: ''
        }
      ],
      assertDomains: [
        {
          nameValue: '',
          paramValue: ''
        }
      ],
      domains: [
        {
          nameValue: '',
          paramValue: ''
        }
      ],
      // 参数类型，因为只有两种，所以写死在前端
      paramsType: [
        {
          id: 1,
          name: 'application/json'
        },
        {
          id: 2,
          name: 'application/x-www-form-urlencoded'
        }
      ],
      //   添加表单验证规则的对象
      addFormRules: {
        name: [
          { required: true, message: '请输入您的用例名称', trigger: 'blur' },
          { min: 2, max: 40, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        protocolId: [
          { required: true, message: '请选择协议类型', trigger: 'blur' }
        ],
        projectId: [
          { required: true, message: '请选择所属项目', trigger: 'blur' }
        ],
        assertFlag: [
          { required: true, message: '请输入断言标志', trigger: 'blur' }
        ],
        assertContent: [
          { required: true, message: '请输入断言内容', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入请求URL', trigger: 'blur' }],
        jsonParams: [{ validator: checkJson, trigger: 'blur' }],
        paramsType: [
          { required: true, message: '请选择入参方式', trigger: 'blur' }
        ]
      },
      // 修改表单验证规则
      setAssertFormRules: {
        // assertDomains:[
        // ],
        // paramsDomains:[
        // ]
      },
      setAssertCaseDialog: false,
      // 修改表单的dialog弹窗打开标志位
      editDialogVisible: false,
      caseGroupList: {},
      queryForm: {
        query: '',
        pageNum: 1,
        pageSize: 50
      },
      responseStr: '',
      setAssertCaseForm: {},
      switchInfo: {
        isAssert: false,
        isReference: false
      },
      assertResult: '',
      assertResultIndex: '',
      referenceResult: '',
      referenceResultIndex: '',
      queryAssertParams: {
        flag: '',
        content: ''
      },
      openCaseListFlag: false,
      caseListTable: [],
      preCaseGroupName: ''
    }
  },
  methods: {

    clearSelect () {
      this.openCaseListFlag = false
    },
    async getCaseGroupInfo (groupId) {
      this.openCaseListFlag = !this.openCaseListFlag
      if (this.openCaseListFlag) {
        const response = await this.$common.get('/getGroupCaseList?groupId=' + groupId)
        this.caseListTable = response.data
      }
    },
    getCaseReferenceParams () {

    },
    // JSON解析
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          var obj = JSON.parse(str)
          if (typeof obj === 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          console.log('error：' + str + '!!!' + e)
          return false
        }
        return true
      }
    },
    async queryAssert (index, value) {
      this.queryAssertParams.flag = value
      this.queryAssertParams.content = this.responseStr
      const response = await this.$common.post(
        '/getAssertResult',
        this.queryAssertParams
      )
      if (response.code == 10000) {
        this.assertResult = response.data
        this.assertResultIndex = index
        // this.domains[index].paramValue = response.data
        // console.log(index-1)
        // this.setAssertCaseForm.paramsDomains.splice(index,1,{
        //   assertResult: false,
        //   nameValue: value,
        //   paramDesc:'',
        //   paramValue: this.assertResult,
        // })
        // console.log(this.setAssertCaseForm.assertDomains)
      } else {
        this.$message.error('断言表达式错误，请检查！')
      }
    },
    async queryReference (idnex, value) {
      this.queryAssertParams.flag = value
      this.queryAssertParams.content = this.responseStr
      const response = await this.$common.post(
        '/getAssertResult',
        this.queryAssertParams
      )
      if (response.code == 10000) {
        this.referenceResult = response.data
        this.referenceResultIndex = idnex
      }
    },
    async getResponse () {
      this.$refs.addCaseFormRef.validate(async valid => {
        if (valid) {
          this.loading = true
          console.log(this.addCaseForm)
          const response = await this.$common.post(
            '/addSingleCaseGetResponse',
            this.addCaseForm
          )
          if (response.code == 10000) {
            // this.responseStr = response.data.response;
            this.responseStr = this.$common.formatJson(response.data.response)
            this.loading = false
            this.setAssertCaseDialog = true
            this.setAssertCaseForm = response.params
          } else {
            this.$message.error(response.msg)
          }
          this.loading = false
        } else {
          console.log('表单检验不通过')
        }
      })
    },
    goBack () {
      // 返回单用例页面
      this.$router.push('/case/single')
    },
    async getCaseGroupList (query) {
      this.queryForm.query = query
      this.queryForm.projectId = this.addCaseForm.projectId
      const response = await this.$common.get(
        '/getAllCaseGroup',
        this.queryForm
      )
      this.caseGroupList = response.data
    },
    // 删除form表单的参数
    removeDomain (item) {
      var index = this.addCaseForm.domains.indexOf(item)
      if (index !== -1) {
        this.addCaseForm.domains.splice(index, 1)
      }
    },
    // 增加form表单的参数
    addDomain () {
      this.addCaseForm.domains.push({
        nameValue: '',
        paramValue: '',
        key: Date.now()
      })
    },
    addAssertDomain () {
      this.setAssertCaseForm.assertDomains.push({
        nameValue: '',
        paramValue: '',
        key: Date.now()
      })
    },
    addParamsDomain () {
      this.setAssertCaseForm.paramsDomains.push({
        nameValue: '',
        paramValue: '',
        paramDesc: '',
        key: Date.now()
      })
    },
    removeAddAssertDomain (item) {
      var index = this.setAssertCaseForm.assertDomains.indexOf(item)
      if (index !== -1) {
        this.setAssertCaseForm.assertDomains.splice(index, 1)
      }
    },
    removeParamsDomain (item) {
      var index = this.setAssertCaseForm.paramsDomains.indexOf(item)
      if (index !== -1) {
        this.setAssertCaseForm.paramsDomains.splice(index, 1)
      }
    },

    // 发送添加用例的请求
    async addCase () {
      if (this.cid != 'add') {
        // 编辑
        this.$refs.setAssertCaseFormRef.validate(async valid => {
          if (valid) {
            const response = await this.$common.post(
              '/editCase',
              this.setAssertCaseForm
            )
            if (response.code == 10000) {
              this.$message.success(response.msg)
              this.goBack()
            } else {
              this.$message.error(response.msg)
            }
          } else {
            console.log('表单校验不通过')
          }
        })
      } else {
        // 添加
        this.$refs.setAssertCaseFormRef.validate(async valid => {
          if (valid) {
            const response = await this.$common.post(
              '/addCase',
              this.setAssertCaseForm
            )
            if (response.code == 10000) {
              this.$message.success(response.msg)
              this.goBack()
            } else {
              this.$message.error(response.msg)
            }
          } else {
            console.log('表单校验不通过')
          }
        })
      }
    },
    closeEdit () {
      this.$refs.setAssertCaseFormRef.resetFields()
      this.textareaHigh = 4
    },
    // 获取协议列表
    async getProtocol () {
      const { data: response } = await this.$http.get('/getAllProtocol')
      this.protocolsOptions = response.data
    },
    // 获取项目列表
    async getProject () {
      this.$common.getAllProject().then(data => {
        this.projectOptions = data
      })
    },
    async getCaseById () {
      if (this.cid != 'add') {
        const response = await this.$common.get('/getCaseById?id=' + this.cid)
        this.addCaseForm = response.data
        this.switchInfo.isAssert = response.total
        this.switchInfo.isReference = response.extend
        if (response.params != null) {
          this.preCaseGroupName = response.params.name
        }
        if (!response.total) {
          this.addCaseForm.assertDomains = this.assertDomains
        }
        if (!response.extend) {
          this.addCaseForm.paramsDomains = this.paramsDomains
        }
      } else {
        console.log('添加用例')
      }
    }
  },
  // computed:{
  //   responseStr : function(){
  //     return this.$common.formatJson(this.responseStr);
  //   }
  // },
  created () {
    if (window.sessionStorage.getItem('projectId') != null && window.sessionStorage.getItem('projectName') != null) {
      this.$global.currentProjectId = window.sessionStorage.getItem('projectId')
      this.$global.currentProjectName = window.sessionStorage.getItem('projectName')
      this.addCaseForm.projectId = this.$global.currentProjectId
    }
    this.getProtocol()
    this.getProject()
    this.getCaseById()
  },
  beforeRouteLeave (to, from, next) {
    to.meta.keepAlive = false
    next()
  }
}
</script>
<style lang="less" scoped></style>
