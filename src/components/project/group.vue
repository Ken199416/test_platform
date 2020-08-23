<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>切换项目</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col style="margin-top:60px;margin-left:4%;margin-right:4%;" :span="4">
          <div @click="delProject()" style="cursor:pointer">
            <el-card style="background-color:#479DE3;height:95px;border-radius: 15px;">
              <div style="text-align: center;font-size:37.5px;font-color:while">
                <span>全平台</span>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col
          style="margin-top:60px;margin-left:4%;margin-right:4%;"
          :span="4"
          :key="item.id"
          v-for="item in projectList"
        >
          <div @click="changeProject(item.id,item.name)" style="cursor:pointer">
            <el-card style="background-color:#479DE3;height:95px;border-radius: 15px;">
              <div style="text-align: center;font-size:37.5px;font-color:while">
                <span>{{item.name}}</span>
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
  data () {
    return {
      projectList: []
    }
  },
  methods: {
    async getAllProject () {
      const data = await this.$common.getAllProject()
      this.projectList = data
    },
    changeProject (id, name) {
      this.$confirm(
        '是否切换到 [ ' + name + ' ] ？ 切换之后只显示当前项目的相关内容 ！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          window.sessionStorage.setItem('projectId', id)
          window.sessionStorage.setItem('projectName', name)
          location.reload()
        })
        .catch(() => {})
    },
    delProject () {
      this.$confirm(
        '是否切换到 [ 全平台 ] ？ 切换之后显示全部内容 ！',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          window.sessionStorage.removeItem('projectId')
          window.sessionStorage.removeItem('projectName')
          location.reload()
        })
        .catch(() => {})
    }
  },
  created () {
    this.getAllProject()
  }
}
</script>
<style lang="less" scoped></style>
