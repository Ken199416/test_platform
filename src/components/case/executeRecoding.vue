<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/case/single'}">单接口用例</el-breadcrumb-item>
      <el-breadcrumb-item>用例执行记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用例执行记录查看卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button @click="black()" icon="el-icon-back" type="primary">返回</el-button>
        </el-col>
        <el-col :span="2">
          <el-select clearable v-model="queryExecuteRecoding.executeResult" placeholder="执行结果">
            <el-option
              v-for="item in executeResults"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="5.5">
          <el-date-picker
          value-format="timestamp"
            unlink-panels
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="1">
          <el-button @click="query()" icon="el-icon-search"></el-button>
        </el-col>

      </el-row>

      <el-table :data="recoding" border height="670" style="width: 100%">
        <el-table-column fixed type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="name" label="用例名称" width="150"></el-table-column>
        <el-table-column prop="time" label="执行时间" width="150"></el-table-column>
        <el-table-column prop="executeResult" label="执行结果" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.executeResult==1" type="success">SUCCESS</el-tag>
            <el-tag v-if="scope.row.executeResult==0" type="danger">FAIL</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="protocolId" label="请求方式" width="75">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.protocolId==1" type="success">GET</el-tag>
            <el-tag v-if="scope.row.protocolId==2" type="danger">POST</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="请求URL" width="200"></el-table-column>
        <el-table-column  prop="requestParams" label="请求参数" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.protocolId == 2 && scope.row.paramsType == 1">{{scope.row.requestParams}}</span>
            <span v-if="scope.row.protocolId == 1">无参数</span>
            <span :key="index" v-for="(item,index) in scope.row.formParams">[ {{item.nameValue}} : {{item.paramValue}} ]<br></span>
          </template>
        </el-table-column>
        <el-table-column prop="assertFlag" label="断言标志" width="150">
          <template slot-scope="scope">
              <span :key="index" v-for="(item,index) in scope.row.assertFlag.split('<==>')">{{item}}<br/></span>
          </template>
        </el-table-column>
        <el-table-column prop="assertContent" label="预期断言" width="150">
          <template slot-scope="scope">
              <span :key="index" v-for="(item,index) in scope.row.assertContent.split('<==>')">{{item}}<br/></span>
          </template>
        </el-table-column>
        <el-table-column prop="executeResponse" label="接口响应" width="300">

          <template slot-scope="scope">
            <span>
            {{scope.row.executeResponse.length > 100 ? scope.row.executeResponse.substring(0,100) + '......' : scope.row.executeResponse}}
            </span>
             <el-button v-if="scope.row.executeResponse.length > 100" type="primary" size="mini" @click='queryExecuteResponse(scope.row)'>查看更多</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="执行人" width="95"></el-table-column>

      </el-table>

      <!-- 查看更多的响应信息dialog -->
      <el-dialog
  title="Response"
  :visible.sync="executeResponseDialog"
  width="90%">
  <el-input type="textarea" rows='23' v-model="allExecuteResponse"></el-input>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="executeResponseDialog = false">朕知道了</el-button>
  </span>
</el-dialog>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryExecuteRecoding.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryExecuteRecoding.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.recodingTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  props: ['cid'],
  data () {
    return {
      recoding: [],
      queryExecuteRecoding: {
        cid: 0,
        pageNum: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      recodingTotal: 10,
      executeResult: -1,
      executeResults: [
        {
          value: 1,
          label: '执行成功'
        },
        {
          value: 0,
          label: '执行失败'
        }
      ],
      time: [],
      executeResponseDialog: false,
      allExecuteResponse: ''
    }
  },
  methods: {
    black () {
      this.$router.push('/case/single')
    },
    // 监听每页显示数的改变
    handleSizeChange (newSize) {
      this.queryExecuteRecoding.pageSize = newSize
      this.getRecoding()
    },
    // 监听页码的改变
    handleCurrentChange (newPage) {
      this.queryExecuteRecoding.pageNum = newPage
      this.getRecoding()
    },
    async getRecoding () {
      this.queryExecuteRecoding.cid = parseInt(this.cid)
      const { data: response } = await this.$http.get('/getExecuteRecoding', {
        params: this.queryExecuteRecoding
      })
      this.recoding = response.data
      this.recodingTotal = response.total
    },
    query () {
      if (this.time != null && this.time[0] !== undefined) {
        this.queryExecuteRecoding.startTime = this.time[0]
        this.queryExecuteRecoding.endTime = this.time[1]
      } else {
        this.queryExecuteRecoding.startTime = ''
        this.queryExecuteRecoding.endTime = ''
      }
      this.getRecoding()
    },
    queryExecuteResponse (row) {
      this.allExecuteResponse = this.$common.formatJson(row.executeResponse)
      this.executeResponseDialog = true
    }
  },
  created () {
    this.getRecoding()
  }
}
</script>
<style lang="less" scoped></style>
