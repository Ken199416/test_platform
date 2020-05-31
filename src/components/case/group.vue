<template>
  <div v-loading="loading" element-loading-text="正在努力调用接口...">
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用例管理</el-breadcrumb-item>
      <el-breadcrumb-item>接口用例集</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索or添加 -->
      <el-row :gutter="10">
        <!-- 选择项目 -->
        <el-col
          :span="3"
          v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null"
        >
          <el-select clearable v-model="queryCaseGroupListParams.projectId" placeholder="请选择项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="3" v-else>
          <el-select
            disabled
            clearable
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
        </el-col>

        <el-col :span="4">
          <el-input
            @keyup.enter.native="getCaseList()"
            placeholder="请输入Case用例集名称"
            v-model="queryCaseGroupListParams.query"
            clearable
            @clear="getAllCaseGroup()"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-search" @click="getCaseGroupListBySelect()"></el-button>
        </el-col>
        <el-col :span="15" style="text-align:right">
          <el-button type="primary" @click="addCaseGroupDialog = true">添加Case集</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="caseGroupList" border height="670" style="width: 100%">
        <el-table-column type="expand" >
          <template slot-scope="scope" v-if="scope.row.caseList.length > 0">
            <el-steps
              :active="scope.row.executeIndex"
              process-status="process"
              finish-status="success"
              align-center
            >
              <el-step
                :title="item.name"
                :status="item.result ? '':'error'"
                :description="item.desc"
                :key="index"
                v-for="(item,index) in scope.row.caseList "
              ></el-step>
            </el-steps>
            <el-button
              v-if="scope.row.executeIndex == 0"
              style="margin-top: 12px;"
              @click="next(scope)"
            >开 始</el-button>
            <el-button
              v-else-if="scope.row.executeIndex == scope.row.caseTotal"
              style="margin-top: 12px;"
              @click="next(scope)"
            >重新执行</el-button>
            <el-button v-else style="margin-top: 12px;" @click="next(scope)">下一步</el-button>
            <el-button style="margin-top: 12px;" @click="resetActive(scope)">重 置</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用例集名称" width="130%">
          <template slot-scope="scope">
            <el-popover placement="right" width="400px" trigger="click" width:300px>
              <el-table :data="scope.row.caseList" border>
                <el-table-column width="70" property="pri" label="优先级"></el-table-column>
                <el-table-column width="200" property="name" label="用例名"></el-table-column>
                <el-table-column width="350" property="desc" label="描述"></el-table-column>
              </el-table>

              <div slot="reference" style="cursor:pointer">{{scope.row.name}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="projectId" label="所属项目" width="90%">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.projectName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop label="动态参数" width="400%">
          <template slot-scope="scope">
            <el-row type="flex" justify="start">
              <el-col
                style="margin-top:5px;text-align: center;"
                :key="index"
                v-for="(item,index) in scope.row.reference"
                :span="6"
              >
                <div class="grid-content bg-purple-dark">
                  <el-tooltip :content="item.referenceDesc" placement="top">
                    <el-button type="primary" plain size="mini">{{item.referenceName}}</el-button>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column prop="caseGroupDescribe" label="用例集描述" width="150%"></el-table-column>
        <el-table-column prop="waitTime" label="等待时间( S )" width="50%"></el-table-column>
        <el-table-column label="状态" width="75%">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.del"
              class="item"
              effect="dark"
              content="停用该用例集"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="继续使用该用例集"
              placement="top"
              :enterable="false"
            >
              <el-switch v-model="scope.row.del" @change="changeDel(scope.row)"></el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 操作列 -->

        <el-table-column label="操作" width="350%">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑此用例集"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="success"
                plain
                v-if="scope.row.del"
                icon="el-icon-edit"
                @click="openEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <el-button
              v-if="scope.row.del"
              type="primary"
              icon="el-icon-edit-outline"
              @click="openAddCaseDialog(scope.row)"
              size="mini"
            >分配用例</el-button>
            <el-button
              v-if="scope.row.del"
              type="primary"
              icon="el-icon-edit-outline"
              size="mini"
              @click="openEditCaseDialog(scope.row)"
            >调整用例</el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="执行该用例集"
              placement="top"
              :enterable="false"
            >
              <el-button
                v-if="scope.row.del"
                size="mini"
                type="primary"
                plain
                icon="el-icon-video-play"
                @click="runCaseGroup(scope.row)"
              ></el-button>
            </el-tooltip>

            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="查看用例集执行结果"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="success"
                plain
                icon="el-icon-view"
                @click="getExecuteRecoding(scope.row.id)"
              ></el-button>
            </el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCaseGroupListParams.pageNum"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="queryCaseGroupListParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="caseGroupTotal"
      ></el-pagination>
    </el-card>

<!-- 分步骤执行结果弹窗 -->
    <el-dialog
      title="执行结果"
      :close-on-click-modal="false"
      :visible.sync="executeCaseByIndexResponse"
      width="80%"
    >
      <el-form label-width="80px" :model="caseResult">
        <el-form-item label="响应结果">
          <el-input contenteditable="true" type="textarea" rows="10"
           v-model="caseResult.responseStr"></el-input>
        </el-form-item>
        <el-form-item label="断言结果">
          <el-table :data="caseResult.assertDomains" style="width: 100%">
            <el-table-column prop="nameValue" label="断言表达式" width="300"></el-table-column>
            <el-table-column prop="paramValue" label="断言内容" width="300"></el-table-column>
            <el-table-column prop="paramDesc" label="断言结果"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="参数截取">
          <el-table :data="caseResult.paramsDomains" style="width: 100%">
            <el-table-column prop="nameValue" label="参数引用名" width="300"></el-table-column>
            <el-table-column prop="paramValue" label="参数描述" width="300"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="executeCaseByIndexResponse = false">我知道了</el-button>
      </span>
    </el-dialog>


    <!--执行用例集异常弹窗 -->
    <el-dialog
      title="执行成功，断言失败！！！"
      :close-on-click-modal="false"
      :visible.sync="executeErrorDialog"
      width="80%"
    >
      <div style="font-size:18px;color:red;margin-bottom:30px">用例在第{{errorCaseIndex}}步执行失败！！！
       ===> 用例【{{caseErrorResult.name}}】具体执行信息如下：
      </div>
      <el-form label-width="80px" :model="caseErrorResult">
        <el-form-item label="请求参数" 
        v-if="caseErrorResult.protocolId == 2 && caseErrorResult.paramsType == 1">
          <el-input contenteditable="true" type="textarea" rows="10"
           v-model="caseErrorResult.jsonParams"></el-input>
        </el-form-item>
        <el-form-item label="请求参数" 
        v-if="caseErrorResult.protocolId == 2 && caseErrorResult.paramsType == 2">
          <el-table  :data="caseErrorResult.domains" style="width: 100%">
            <el-table-column prop="nameValue" label="参数名" width="300"></el-table-column>
            <el-table-column prop="paramValue" label="参数值"></el-table-column>
          </el-table>
        </el-form-item>


        <el-form-item label="响应结果">
          <el-input contenteditable="true" type="textarea" rows="10"
           v-model="caseErrorResult.responseStr"></el-input>
        </el-form-item>
        <el-form-item label="断言结果">
          <el-table  :data="caseErrorResult.assertDomains" style="width: 100%">
            <el-table-column prop="nameValue" label="断言表达式" width="300"></el-table-column>
            <el-table-column prop="paramValue" label="断言内容" width="300"></el-table-column>
            <el-table-column prop="paramDesc" label="断言结果">
              <template slot-scope="scope">
                <span style="color:red;">{{scope.row.paramDesc}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="executeErrorDialog = false">我知道了</el-button>
      </span>
    </el-dialog>

    <!-- 添加用例集的对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="用例集添加"
      :visible.sync="addCaseGroupDialog"
      width="50%"
      @close="closeAdd()"
    >
      <span></span>
      <!-- 添加用例集表单 -->
      <el-form
        ref="addCaseGroupFormRef"
        :rules="addCaseGroupFormRules"
        :model="addCaseGroupForm"
        label-width="100px"
      >
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用例集名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseGroupForm.name"
            placeholder="请输入用例集名"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="this.$global.currentProjectId == null && this.$global.currentProjectName == null"
          style="margin-left:150px;margin-right:150px"
          label="所属项目"
          prop="projectId"
        >
          <el-select style="width:93%" v-model="addCaseGroupForm.projectId" placeholder="请选择所属项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-else
          style="margin-left:150px;margin-right:150px"
          label="所属项目"
          prop="projectId"
        >
          <el-select
            disabled
            style="width:93%"
            v-model="this.$global.currentProjectName"
            placeholder="请选择所属项目"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用例集描述"
          prop="caseGroupDescribe"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseGroupForm.caseGroupDescribe"
            placeholder="请输入用例集描述"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="等待时间"
          prop="waitTime"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="addCaseGroupForm.waitTime"
            placeholder="每条case运行时等待的时间，不填则不做等待"
            style="width:93%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCaseGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCaseGroup()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用例集弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="用例集编辑"
      :visible.sync="editCaseGroupDialog"
      width="50%"
      @close="closeEdit()"
    >
      <span></span>
      <!-- 修改用例集表单 -->
      <el-form
        ref="editCaseGroupFormRef"
        :rules="editCaseGroupFormRules"
        :model="editCaseGroupForm"
        label-width="100px"
      >
        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用例集名称"
          prop="name"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="editCaseGroupForm.name"
            placeholder="请输入用例集名"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item style="margin-left:150px;margin-right:150px" label="所属项目" prop="projectId">
          <el-select
            disabled
            style="width:93%"
            v-model="editCaseGroupForm.projectId"
            placeholder="请选择所属项目"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="用例集描述"
          prop="caseGroupDescribe"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="editCaseGroupForm.caseGroupDescribe"
            placeholder="请输入用例集描述"
            style="width:93%"
          ></el-input>
        </el-form-item>

        <el-form-item
          style="margin-left:150px;margin-right:150px"
          class="input-center"
          label="等待时间"
          prop="waitTime"
        >
          <el-input
            prefix-icon="el-icon-edit"
            v-model="editCaseGroupForm.waitTime"
            placeholder="每条case运行时等待的时间，不填则不做等待"
            style="width:93%"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCaseGroupDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCaseGroup()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用例弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="为组件分配用例"
      :visible.sync="addCaseDialog"
      width="60%"
      @close="closeAddCase()"
    >
      <!-- 分配用例表单 -->

      <el-form
        ref="addCaseFormRef"
        :rules="addCaseFormRules"
        :model="addCaseForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-left:50px;" label="执行用例" prop="caseId">
                <el-select
                  filterable
                  remote
                  :remote-method="getCaseList"
                  style="width:80%"
                  v-model="addCaseForm.caseId"
                  placeholder="输入用例名进行模糊匹配"
                >
                  <el-option
                    v-for="item in caseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-right:0px" label="执行优先级" prop="pri">
                <el-input
                  prefix-icon="el-icon-sort"
                  v-model.number="addCaseForm.pri"
                  placeholder="数值类型"
                  style="width:60%"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 分配用例底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCaseDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCase()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调整用例弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="调整组件"
      :visible.sync="editCaseDialog"
      width="40%"
      @close="closeChange()"
    >
      <!-- 调整列表用例表单 -->
      <div style="text-align: center;">
        <el-table :data="groupCaseList" style="width: 100%;">
          <el-table-column prop="name" label="用例名称" width="250"></el-table-column>
          <el-table-column prop="pri" label="用例优先级" width="250">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.pri" @blur="changePri(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="pri" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="danger"
                @click="delGroupCase(scope.row)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
export default {
  data() {

    //    验证数值
    var checkNumber = (rule, value, callback) => {
      // 验证数值的正则
      const number = /^[0-9]*$/;
      if (number.test(value)) {
        return callback();
      }
      callback(new Error("请输入正整数"));
    };
    return {
      drawer: false,
      currentGroupId: "",
      addCaseDialog: false,
      editCaseDialog: false,
      loading: false,
      protocolsOptions: [],
      projectOptions: [],
      // 获取用户列表
      queryCaseListParams: {
        query: "",
        pageNum: 1,
        pageSize: 100,
        protocolId: "",
        projectId: ""
      },
      queryCaseGroupListParams: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        projectId: ""
      },
      caseList: [],
      delCaseGroupParam: {
        groupId: 0,
        flag: true
      },
      caseGroupList: [],
      caseGroupTotal: 0,
      //   Dialogd对话框的展开标识
      addCaseGroupDialog: false,
      //   添加用户表单规则
      addCaseGroupForm: {
        name: "",
        projectId: "",
        caseGroupDescribe: "",
        waitTime: ""
      },
      componentList: [],
      //   修改用户信息
      addCaseForm: {
        caseId: "",
        groupId: "",
        pri: ""
      },
      editCaseForm: {},
      //   添加表单验证规则的对象
      addCaseGroupFormRules: {
        name: [
          { required: true, message: "请输入您的用例名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择用例组所属项目", trigger: "blur" }
        ]
      },
      addCaseFormRules: {
        caseId: [
          { required: true, message: "请选择要添加的用例", trigger: "blur" }
        ],
        pri: [
          { required: true, message: "请输入执行优先级", trigger: "blur" },
          { validator: checkNumber, trigger: "blur" }
        ]
      },
      editCaseFormRules: {},
      editCaseDialog: false,
      groupCaseList: [],
      changePriParams: {},
      delGroupCaseParams: {},
      caseList: [],
      active: 0,
      executeCaseByIndexResponse: false,
      caseResult: {},
      success: "success",
      executeResult: true,
      editCaseGroupDialog: false,
      editCaseGroupForm: {},
      editCaseGroupFormRules: {
        name: [
          { required: true, message: "请输入您的用例名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择用例组所属项目", trigger: "blur" }
        ]
      },
      executeErrorDialog:false,
      caseErrorResult:{

      },
      errorCaseIndex:""
    };
  },
  methods: {
    openDebug() {
      console.log("打开");
    },
    resetActive(scope) {
      const index = scope.$index;
      this.caseGroupList[index].executeIndex = 0;
      const caseList = this.caseGroupList[index].caseList;
      for (let i = 0; i < caseList.length; i++) {
        if (!caseList[i].result) {
          caseList[i].result = !caseList[i].result;
        }
      }
    },
    async next(scope) {
      const index = scope.$index;
      if (this.caseGroupList[index].executeIndex++ > scope.row.caseTotal - 1) {
        this.caseGroupList[index].executeIndex = 0;
      } else {
        this.loading = true;
        const response = await this.$common.get(
          "/runCaseByIndex?index=" +
            this.caseGroupList[index].executeIndex +
            "&groupId=" +
            scope.row.id
        );
        if (response.code == 10000) {
          this.caseResult = response.params;
          this.caseGroupList[scope.$index].caseList[this.caseGroupList[index].executeIndex - 1].result = response.data.success;
          // 断言成功
          if (response.data.success) {
            this.loading = false;
          } else {
            // 断言失败
            this.loading = false;
            this.$message.error(response.msg);
          }
          // 执行成功,弹窗标志位true
          this.executeCaseByIndexResponse = true;
        } else {
          this.caseGroupList[scope.$index].caseList[
            this.caseGroupList[index].executeIndex - 1
          ].result = false;
          this.loading = false;
          this.$message.error(response.msg);
        }
      }
    },
    async getCaseListByCaseGroupId(event, id) {
      // 剪头回来继续写，先展示一个dialog，然后展示信息，可以选择利用嵌套信息
      // console.log(id);
      const response = await this.$common.get(
        "/getGroupCaseList?groupId=" + id
      );
      this.caseList = response.data;
    },
    async runCaseGroup(row) {
      this.loading = true;
      const response = await this.$common.get("/runGroupCaseById?id=" + row.id);
      if (response.code == 10000 && response.msg != '执行失败') {
        this.$message.success(response.msg);
        this.loading = false;
      } else {
        this.$message.error(response.msg);
        this.caseErrorResult = response.data.errorCaseInfo;
        this.errorCaseIndex = response.total;
        this.loading = false;
        this.executeErrorDialog = true;
      }
      this.loading = false;
    },
    async delGroupCase(row) {
      this.delGroupCaseParams.id = row.crgId;
      this.delGroupCaseParams.groupId = this.currentGroupId;
      const response = await this.$common.get(
        "/delGroupCase",
        this.delGroupCaseParams
      );
      this.groupCaseList = response.data;
    },
    async changePri(row) {
      this.changePriParams.id = row.crgId;
      this.changePriParams.pri = row.pri;
      this.changePriParams.groupId = this.currentGroupId;
      const response = await this.$common.get(
        "/updateGroupCase",
        this.changePriParams
      );
      this.groupCaseList = response.data;
    },
    async openEditCaseDialog(row) {
      this.currentGroupId = row.id;
      this.editCaseDialog = true;
      const response = await this.$common.get(
        "/getGroupCaseList?groupId=" + row.id
      );
      // console.log(response.data);
      this.groupCaseList = response.data;
    },
    async addCase() {
      this.$refs.addCaseFormRef.validate(async valid => {
        if (valid) {
          const response = await this.$common.post(
            "/caseGroupAddCase",
            this.addCaseForm
          );
          this.$message.success(response.msg);
          if (response.code == 10000) {
            this.addCaseDialog = false;
          } else {
          }
        }
      });
    },
    async getCaseList(query) {
      if (query !== "") {
        this.queryCaseListParams.query = query;
        const response = await this.$common.get(
          "/getAllCase",
          this.queryCaseListParams
        );
        this.caseList = response.data;
      }
    },

    openAddCaseDialog(row) {
      this.addCaseForm.groupId = row.id;
      // 打开弹出时，设置项目ID，
      this.queryCaseListParams.projectId = row.projectId;
      this.addCaseDialog = true;
    },
    addCaseOpenDialog() {
      this.getAllComponent();
      this.addDialogVisible = true;
    },
    getCaseGroupListBySelect() {
      this.queryCaseGroupListParams.pageNum = 1;
      this.queryCaseGroupListParams.pageSize = 10;
      this.getAllCaseGroup();
    },
    async getAllCaseGroup() {
      const { data: response } = await this.$http.get("/getAllCaseGroup", {
        params: this.queryCaseGroupListParams
      });
      if (response.code != 10000) {
        this.$message.error(response.msg);
      } else {
        this.caseGroupList = response.data;
        this.caseGroupTotal = response.total;
      }
    },
    async delCase(row) {
      this.delCaseGroupParam.groupId = row.id;
      this.delCaseGroupParam.flag = row.del;
      const { data: response } = await this.$http.get("/delGroup", {
        params: this.delCaseGroupParam
      });
      if (response.code != 10000) {
        this.$message.error("服务器开小差了，请稍后重试或者联系管理员！");
      } else {
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
      }
      this.getAllCaseGroup();
    },
    async changeDel(row) {
      console.log(row);
      // 停用
      if (!row.del) {
        await this.$confirm("是否停用该用例集?", "提示", {
          confirmButtonText: "停用",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delCase(row);
          })
          .catch(() => {
            this.getAllCaseGroup();
            this.$message({
              type: "info",
              message: "已取消停用"
            });
          });
      } else {
        await this.$confirm("是否恢复使用该用例集?", "提示", {
          confirmButtonText: "恢复",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.delCase(row);
            // console.log("删除了");
          })
          .catch(() => {
            this.getAllCaseGroup();
            this.$message({
              type: "info",
              message: "已取消恢复使用"
            });
          });
      }
    },
    // 监听每页显示数的改变
    handleSizeChange(newSize) {
      this.queryCaseGroupListParams.pageSize = newSize;
      this.getCaseList();
    },
    // 监听页码的改变
    handleCurrentChange(newPage) {
      this.queryCaseGroupListParams.pageNum = newPage;
      this.getCaseList();
    },
    // 发送添加用例组的请求
    async addCaseGroup() {
      this.$refs.addCaseGroupFormRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post(
            "/addCaseGroup",
            this.addCaseGroupForm
          );
          if (response.code == 10000) {
            this.$message.success(response.msg);
            this.addCaseGroupDialog = false;
          } else {
            this.$message.error(response.msg);
            this.addCaseGroupDialog = true;
          }
        } else {
        }
        this.getAllCaseGroup();
      });
    },
    async showDialogVisible(caseInfo) {
      this.editDialogVisible = true;
      const { data: response } = await this.$http.get(
        "/getCaseById?id=" + caseInfo.id
      );
      if (response.code == 10000) {
        this.editCaseForm = response.data;
      } else {
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
    closeAdd() {
      this.$refs.addCaseGroupFormRef.resetFields();
    },
    closeAddCase() {
      this.$refs.addCaseFormRef.resetFields();
      this.getAllCaseGroup();
    },
    closeEdit() {
      this.$refs.editCaseGroupFormRef.resetFields();
    },
    closeChange(){
      this.getAllCaseGroup();
    },
    async getProject() {
      const { data: response } = await this.$http.get("/getAllProject");
      this.projectOptions = response.data;
    },
    async runCaseById(id) {
      this.loading = true;
      const { data: response } = await this.$http.get("/runCaseById?id=" + id);
      this.loading = false;
      if (response.code == 10000) {
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
    },
    async getExecuteRecoding(cid) {
      this.$router.push("/case/executeRecoding/" + cid);
    },
    async openEditDialog(id) {
      const response = await this.$common.get("/getCaseGroupInfoById?id=" + id);
      this.editCaseGroupForm = response.data;
      this.editCaseGroupDialog = true;
    },
    async editCaseGroup() {
      this.$refs.editCaseGroupFormRef.validate(async valid => {
        if (valid) {
          const response = await this.$common.post(
            "/editCaseGroupInfoById",
            this.editCaseGroupForm
          );
          this.$message.success(response.msg);
          this.editCaseGroupDialog = false;
          this.getAllCaseGroup();
        } else {
          console.log(表单格式错误);
        }
      });
    }
  },
  created() {
    if (
      window.sessionStorage.getItem("projectId") != null &&
      window.sessionStorage.getItem("projectName") != null
    ) {
      this.$global.currentProjectId = window.sessionStorage.getItem(
        "projectId"
      );
      this.$global.currentProjectName = window.sessionStorage.getItem(
        "projectName"
      );
      this.queryCaseGroupListParams.projectId = this.$global.currentProjectId;
      this.addCaseGroupForm.projectId = this.$global.currentProjectId;
    }
    this.getAllCaseGroup();
    this.getProject();
  }
};
</script>
<style lang="less" scoped>
    .textarea-inherit {
        width: 100%;
        overflow: auto;
        word-break: break-all; //解决兼容问题
    }
</style>