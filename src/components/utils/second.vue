<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工具中心</el-breadcrumb-item>
      <el-breadcrumb-item>专项工具</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col
          style="margin-top:60px;margin-left:4%;margin-right:4%;"
          :span="4"
          :key="item.id"
          v-for="item in privateUtilsList"
        >
          <div @click="openUtilsDialog(item.id)" style="cursor:pointer">
            <el-card style="background-color:#479DE3;height:95px;border-radius: 15px;">
              <div style="text-align: center;font-size:20px;font-color:while">
                <span>{{item.utilsName}}</span>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-card>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectList: [],
      privateUtilsList:[]
    };
  },
  methods: {
    async getAllUtils(){
      const data = await this.$common.get("/getAllUtils");
      this.privateUtilsList = data.data;
      console.log(data);

    },
    async getAllProject() {
      const data = await this.$common.getAllProject();
      this.projectList = data;
    },

    async openUtilsDialog(id){
        // 通过id去后端拿这个dialog的信息，一些title等的详细信息
        // 然后打开dialog弹窗

    },
   
  },
  created() {
    this.getAllProject();
    this.getAllUtils();
  }
};
</script>
<style lang="less" scoped></style>
