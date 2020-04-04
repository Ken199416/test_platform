<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/caseConfig/component'}">组件配置</el-breadcrumb-item>
      <el-breadcrumb-item>组件详细信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用例执行记录查看卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button @click="back()" icon="el-icon-back" type="primary">返回</el-button>
        </el-col>
      </el-row>



    <!-- 修改用例表单 -->

    <el-form ref="editCaseFormRef"  :rules="editFormRules" :model="componentInfo" label-width="100px">
        <el-form-item 
          style="margin-left:200px;margin-right:200px"
          class="input-center"
          label="组件名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="componentInfo.name"
            placeholder="请输入组件名称"
            style="width:23%"
          ></el-input>

        <span style="margin-left:6%">所属项目</span>
          <el-tooltip class="item" effect="dark" content="所属项目不可更改" placement="top">
            <el-select disabled style="width:23%;margin-left:1%" v-model="componentInfo.projectName" placeholder="">
          </el-select>
          </el-tooltip>
         <span style="margin-left:6%">组件类别</span> 
           <el-tooltip class="item" effect="dark" content="组件类别不可更改" placement="top">
            <el-select disabled style="width:23%;margin-left:1%" v-model="componentInfo.categoryName" placeholder="">
          </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item style="margin-left:200px;margin-right:200px" label="请求地址" prop="url">
          <el-input 
            prefix-icon="el-icon-discover"
            v-model="componentInfo.url"
            placeholder="请输入请求地址"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-left:200px;margin-right:200px" label="请求参数" prop="params">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="componentInfo.params"
            placeholder="请输入请求参数"
            style="width:93%"
          >
          </el-input>
        </el-form-item>


        <el-form-item style="margin-left:200px;margin-right:200px" label="组件描述" prop="componentDescribe">
          <el-input type="textarea" :rows="5"
            prefix-icon="el-icon-key"
            v-model="componentInfo.componentDescribe"
            placeholder="请输入组件描述"
            style="width:93%"
          >
          </el-input>
        </el-form-item>
        <div style="text-align:right;margin-right:280px">
<el-button style="text-align:right" type="primary" @click="getHeaderAndCookie()">下一步</el-button>
</div>
        
      </el-form>

    </el-card>


        <!-- 添加组件第二步对话框 -->
        <el-dialog :close-on-click-modal="false" title="获取Token确认" :visible.sync="lookHeaderAndResponseDialog" width="80%" @close="closeEditDialog()">
      <h1 style="color:red">请确认在以下返回的信息中有您想要的Token信息,
        当前只支持从header或者cookie中获取
      </h1>

      <!-- 添加组件表单 -->
       <el-form ref="lookHeaderAndResponseRef" :rules="lookHeaderAndResponseRules" :model="componentInfo" >
        
        
        <el-form-item style="margin-left:10px;margin-right:10px" label="响应报文" prop="response">
          <el-input  type="textarea" :rows="5"
            v-model="componentInfo.response"
          ></el-input>
        </el-form-item>
        
        
        <el-form-item style="margin-left:10px;margin-right:10px" label="响应头信息" prop="headers">
          <el-input  type="textarea" :rows="5"
            v-model="componentInfo.headers"
        
          ></el-input>
        </el-form-item>

          <el-form-item style="margin-left:10px;margin-right:10px" label="响应Cookies" prop="cookies">
          <el-input  type="textarea" :rows="5"
            v-model="componentInfo.cookies"
          ></el-input>
        </el-form-item>



        <el-form-item
          style="margin-left:10px;margin-right:10px"
          class="input-center"
          label="获取Toekn的方式"
          prop="assertCategoryId"
        >
          <el-select style="width:93%" v-model="componentInfo.assertCategoryId" placeholder="请选择获取Token方式" prop="assertCategoryId">
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
        <el-button type="primary" @click="editComponent()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["cid"],
  data() {
    return {
        tokenAssertWay:'',
        editFormRules:[],
        editCaseForm:{},
        componentInfo:{},
        lookHeaderAndResponseDialog:false,
        tokenAssertWay:[
                {
                    id:1,
                    name:'headers'
                },
                {
                    id:2,
                    name:'cookies'
                }
        ],
        editFormRules:{
            name:[
                { required: true, message: "请输入组件名称", trigger: "blur" }
            ],
            url:[
                { required: true, message: "请输入请求地址", trigger: "blur" }
            ],
            params:[
                { required: true, message: "请输入请求参数", trigger: "blur" }               
            ]
        },
        lookHeaderAndResponseRules:{
            assertCategoryId:[
                { required: true, message: "请选择获取方式", trigger: "blur" }               
            ]
        }
    };
  },
  methods: {
    backFitst(){
          this.lookHeaderAndResponseDialog = false;
      },
    //   关闭时操作
    closeEditDialog(){
          this.$refs.lookHeaderAndResponseRef.resetFields();
      },
    getComponentInfo(){
        this.$common.getComponentInfoById(this.cid).then(data =>{
            this.componentInfo = data;
        });
        
    },
    async getHeaderAndCookie(){
        this.$refs.editCaseFormRef.validate(async valid => {
            if(valid){
                const {data : response} = await this.$http.post('/getHeaderAndCookie',this.componentInfo);
                if(response.code == 10000){
                    this.componentInfo = response.data;
                    this.lookHeaderAndResponseDialog = true;
                }else{
                    this.$message.error(response.msg);
                }
            }
        })
    },
    back(){
      this.$router.push('/caseConfig/component');
    },
    async editComponent(){
        this.$refs.lookHeaderAndResponseRef.validate(async valid => {
            if(valid){
                const {data : response} = await this.$http.post('/editComponent',this.componentInfo);
                if(response.code == 10000){
                    this.$message.success(response.msg)
                    this.$router.push('/caseConfig/component');
                }else{
                    this.$message.error(response.mag);
                }
            }else{
            }
        } )
    }
  },
  created() {
    this.getComponentInfo();
  }
};
</script>
<style lang="less" scoped></style>