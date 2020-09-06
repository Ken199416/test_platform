<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工具中心</el-breadcrumb-item>
      <el-breadcrumb-item>公共工具</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- <el-row>
        <el-col style="margin-top:60px;margin-left:4%;margin-right:4%;" :span="4">
          <div @click="ZZLExcelDialog = true" style="cursor:pointer">
            <el-card style="background-color:#479DE3;height:95px;border-radius: 15px;">
              <div style="text-align: center;font-size:35px;font-color:while">
                <span>ZZLExcel</span>
              </div>
            </el-card>
          </div>
        </el-col> -->
        <!-- <el-col
          style="margin-top:60px;margin-left:4%;margin-right:4%;"
          :span="4"
          :key="item.id"
          v-for="item in projectList"
        >
          <div @click="changeProject(item.id,item.name)" style="cursor:pointer">
            <el-card style="background-color:#479DE3;height:95px;border-radius: 15px;">
              <div style="text-align: center;font-size:35px;font-color:while">
                <span>{{item.name}}</span>
              </div>
            </el-card>
          </div>
        </el-col> -->
      <!-- </el-row> -->
    </el-card>

<!-- dialog -->
    <el-dialog
  title="ZZLExcel上传拆分"
  :visible.sync="ZZLExcelDialog"
  width="40%"
  :before-close="closeZZLExcelDialog"
  :close-on-click-modal=false>
  <span>老张，把你的Excel上传上来，帮你按机构拆分</span>
  <br>
  <br>
 <!-- action="http://127.0.0.1:8888/autoTest/platform/utils/ZZLExcelUpload" -->
<!-- <el-upload
  class="upload-demo"
  action="http://127.0.0.1:8888/autoTest/platform/utils/ZZLExcelUpload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  ref="upload"
  multiple
  :limit="1"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
  

  <br>
  <br>
  <div slot="tip" class="el-upload__tip">要是太大，保不准会失败</div>
</el-upload> -->
<form :action="uploadUrl" method="POST" enctype="multipart/form-data">
    选择文件 : <input type="file" @change="getFile($event)" name="file">
    <!-- <input type="button" @click="upload($event)" value="上传"> -->
    <input type="submit" value="上传">
</form>
<br>

<!-- <el-button @click="download()">点击下载</el-button> -->
  <!-- <span slot="footer" class="dialog-footer"> -->
    <!-- <el-button @click="ZZLExcelDialog = false">取 消</el-button>
    <el-button type="primary" @click="ZZLExcelUpload()">确 定</el-button> -->
  <!-- </span> -->
</el-dialog>

    
  </div>
</template>
<script>
export default {
  data () {
    return {
      projectList: [],
      ZZLExcelDialog: false,
      fileList:[],
      file : "",
      // uploadUrl: "http://127.0.0.1:8888/autoTest/platform/utils/ZZLExcelUpload",
      uploadUrl: "http://hmj.mbg17.cn:8888/autoTest/platform/utils/ZZLExcelUpload"
    }
  },
  methods: {
    getFile(event) {
            this.file = event.target.files[0];
            console.log(this.file);
          },
    async upload(){
        event.preventDefault();
            let formData = new FormData();
            formData.append('file', this.file);
 
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
 
            this.$http.post('/utils/ZZLExcelUpload', formData, config).then(function (res) {
              if (res.status === 200) {
                /*这里做处理*/
                console.log(res.data.code);
                
              }
            })
    },
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
    },
    openZZLDialog(){

    },
    async download(){
      this.$http.post('/utils/ZZLDownload',{
        
    responseType:'blob'    // 设置响应数据类型
})
.then(res=>{
    if (res.status == 200) {
      const blob = new Blob([res.data], {type: 'application/zip'});
      const filename = res.headers['content-disposition'];
      const downloadElement = document.createElement('a');
      const href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      [downloadElement.download] = ["职业缴费转换集合.zip"];
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放blob对象

    }
})
        // const resposne = this.$common.get("/utils/ZZLDownload")
    },
    async ZZLExcelUpload(){
      // const resposne = await this.$common.get("/ZZLZip/ZZLExcelZip.zip");
      this.closeZZLExcelDialog();

    },
    closeZZLExcelDialog(){
      this.ZZLExcelDialog = false;
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
  },
  created () {
    this.getAllProject()
  }
}
</script>
<style lang="less" scoped></style>
