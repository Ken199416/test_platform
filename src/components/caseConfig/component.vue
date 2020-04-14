<template>
  <div >
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
            <el-option v-for="item in categorys" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <!-- 选择项目 -->
        <el-col :span="3" v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null">
          <el-select clearable v-model="queryComponentListParams.projectId" placeholder="请选择所属项目">
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
            @keyup.enter.native="getCaseList()"
            placeholder="请输入组件名称"
            v-model="queryComponentListParams.query"
            clearable
            @clear="getComponentListBySelect()"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-search" @click="getComponentListBySelect()"></el-button>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" @click="addComponentGo()">添加组件</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="componentList" border style="width: 100%">
        <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="组件名称" width="200"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" width="200">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.projectName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="组件类别" width="200">
          <template slot-scope="scope">
            <el-tag type="danger">{{scope.row.categoryName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="componentDescribe" label="组件描述" width="570"></el-table-column>
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
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
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

<!-- 添加组件类别抽屉 -->
    <el-drawer title="选择添加组件类别" :visible.sync="drawer" :with-header="false">
      <div style="margin-top:50px;text-align:center">
        <span style="font-size:25px">选择添加组件类别</span><br>
        <div style="margin-top:25px;marign-left:50px;marign-right:50px" :key="item.id" v-for="item in componentCatrgoryList"> 
            <el-button size="medium" round @click="toAddComponentByUrl(item.addComponentUrl)"  type="primary" 
                    style="margin-top:10px">{{item.name}}</el-button><br/><br/>
            <div style="text-align:left;margin-left:100px;margin-right:100px" ><strong>使用说明</strong>：{{item.componentCategoryDesc}}</div>
        </div>
      </div>
    </el-drawer>
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
      componentTotal: 0,
      //   添加组件第一步表单验证规则的对象
      
        // params: [{ validator: checkJson, trigger: "blur" }],

      drawer: false,
      componentCatrgoryList:"",
      categorys:[]
    };
  },
  methods: {
    // 跳转到对应的url
    toAddComponentByUrl(url){
      this.drawer = false;
      this.$router.push(url);
    },
    // 查看组件详情
    toComponentInfo() {},
    // 前往修改组件
    toEditComponent(cid) {
      // this.$router.push("/case/editComponent/" + cid);
      // 更改通过后台获取具体的编辑路由地址
    },
// 打开添加组件抽屉，加载组件跳转地址
    async addComponentGo() {
      this.drawer = true;
      const {data : response} = await this.$http.get("getAllComponentCategory");
      this.componentCatrgoryList = response.data;
    },
// 获取组件类别
    async getComponentCategory() {
      const { data: response } = await this.$http.get(
        "/getAllComponentCategory"
      );
      this.getProject();
      this.categorys = response.data;
    },

    // 获取组件列表
    async getComponentList() {
      const { data: response } = await this.$http.get("/getComponentList", {
        params: this.queryComponentListParams
      });
      if (response.code == 10000) {
        this.componentList = response.data;
        this.componentTotal = response.total;
      } else {
        this.$message.error(response.msg);
      }
    },
    // 通过查询获取组件列表
    async getComponentListBySelect() {
      this.queryComponentListParams.pageNum = 1;
      this.queryComponentListParams.pageSize = 10;
      this.getComponentList();
    },
    // 停用组件
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
    // 改变组件状态
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
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryComponentListParams.pageNum = newPage;
      this.getComponentList();
    },
    async getProject() {
      const { data: response } = await this.$http.get("/getAllProject");
      this.projectOptions = response.data;
    },
    async getExecuteRecoding(cid) {
      this.$router.push("/case/executeRecoding/" + cid);
    }
  },
  created() {
        if (
      window.sessionStorage.getItem("projectId") != null &&
      window.sessionStorage.getItem("projectName") != null
    ) {
      this.$global.currentProjectId = window.sessionStorage.getItem("projectId");
      this.$global.currentProjectName = window.sessionStorage.getItem("projectName");
      this.queryComponentListParams.projectId = this.$global.currentProjectId;
    }

    this.getComponentList();
    this.getComponentCategory();
  }
};
</script>
<style lang="less" scoped></style>