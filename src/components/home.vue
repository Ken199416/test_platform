<template>
  <!-- {{title}} -->
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          class="logoImg"
          src="../assets/img/userLogo.jpg"
          alt="用户头像"
          height="40px "
        />
        <!-- &nbsp;&nbsp;测试平台 -->
      </div>
      <span style="margin-left: 80%">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          background-color="#373d41"
          active-text-color="while"
          text-color="#F5F7F8"
          mode="horizontal"
          @select="select"
        >
          <el-submenu index="1">
            <template slot="title">
              <span style="font-size: 18px">{{
                customerName == "" ? "空昵称" : customerName
              }}</span>
            </template>
            <el-menu-item index="1-1">我的信息</el-menu-item>
            <el-menu-item index="1-2">反馈问题</el-menu-item>
            <el-menu-item index="1-3">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </span>
      <el-button type="primary" @click="toChangeProject()">{{
        this.$global.currentProjectName == null
          ? "全平台"
          : this.$global.currentProjectName
      }}</el-button>
      <!-- </a> -->
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="aside + 'px'">
        <!-- 侧边栏 -->
        <div class="toggle-button" @click="toggleChange()">
          <i :class="toggleIcon"></i>
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="currentMenu"
        >
          <el-submenu
            :index="item.path"
            :key="item.id"
            v-for="item in menuList"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文案 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              :key="subItem.id"
              v-for="subItem in item.chlidren"
              @click="clickMenu(subItem.path,item.name,subItem.name)"
            >
              <template slot="title">
                <i :class="subItem.icon"></i>
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 切换项目的抽屉 -->
        <el-drawer :visible.sync="drawer" direction="ttb" size="400px">
          <el-row>
            <el-col
              style="margin-top: 30px; margin-left: 2%; margin-right: 2%"
              :span="3"
            >
              <div @click="delProject()" style="cursor: pointer">
                <el-card
                  style="
                    background-color: #479de3;
                    height: 75px;
                    border-radius: 15px;
                  "
                >
                  <div
                    style="
                      text-align: center;
                      font-size: 25px;
                      font-color: while;
                    "
                  >
                    <span>全平台</span>
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col
              style="margin-top: 30px; margin-left: 2%; margin-right: 2%"
              :span="3"
              :key="item.id"
              v-for="item in projectList"
            >
              <div
                @click="changeProject(item.id, item.name)"
                style="cursor: pointer"
              >
                <el-card
                  style="
                    background-color: #479de3;
                    height: 75px;
                    border-radius: 15px;
                  "
                >
                  <div
                    style="
                      text-align: center;
                      font-size: 25px;
                      font-color: while;
                    "
                  >
                    <span>{{ item.name }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-drawer>
        <el-tabs v-if="$route.path !== '/welcome'"
          v-model="editableTabsValue"
          type="border-card"
          closable
          @tab-remove="removeTab"
          @tab-click='clickTab'
        >
          <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          >
            <!-- {{ item.content }} -->
        <keep-alive>
          <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
          <router-view></router-view>
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        <!-- <keep-alive>
          <router-view></router-view>
        </keep-alive> -->
          </el-tab-pane>
        </el-tabs>
        <keep-alive v-if="$route.path === '/welcome'">
          <router-view v-if="$route.path === '/welcome'"></router-view>
        </keep-alive>
        <!-- <router-view v-if="$route.path === '/welcome'"></router-view> -->
        <!-- 通用底部 -->
        <div style="margin-top: 50px; margin-left: 45%">
          <el-button icon="el-icon-phone-outline" @click="callMe()"
            >Author</el-button
          >
          <el-tooltip
            class="item"
            effect="dark"
            content="该平台留有多处明显BUG，发现者联系我，发5元微信红包"
            placement="top"
            :enterable="false"
          >
            <el-button icon="el-icon-info"></el-button>
          </el-tooltip>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      title: "Home",
      //   左侧菜单数据
      menuList: [],
      isCollapse: false,
      aside: 200,
      toggleIcon: "el-icon-s-fold",
      currentMenu: "/project/single",
      customerName: "",
      // 切换项目的抽屉标志
      drawer: false,
      activeIndex: "",
      projectList: [],
      currentProjectId: "",
      currentProjectName: "",
      // debug数据
      editableTabs: [
      ],
      editableTabsValue: "0",
      tabIndex: 0,
      rootName:'首页',
      currentTab:[]
    };
  },
  methods: {
    clickTab(tab,event){
      this.menuList.forEach(element => {
        element.chlidren.forEach(e => {
          if(e.name === tab.label){
            this.currentTab = e;
          }
        })

      });
      this.$router.push(this.currentTab.path);
      console.log(this.currentTab.path);
    },
    addTab(targetName,contentName) {
      if(this.editableTabs.findIndex(tab => tab.title === contentName) == -1){
        // 如果不存在，再添加
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: contentName,
          name: newTabName,
          content: this.rootName + ' / ' + targetName + ' / ' + contentName
        });
        this.editableTabsValue = newTabName;
      }else{
        // 存在，切换当前的tab
        this.editableTabsValue = this.editableTabs.filter(tab => tab.title === contentName)[0].name;
        // console.log(this.editableTabs.filter(tab => tab.title === contentName)[0].name);
        
      }
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        if(this.editableTabs.length === 0){
          this.$router.push("/welcome")
        }
      }
    ,
    callMe() {
      // this.$message.success("作者微信：HMJ_KEN");
      this.$alert("作者微信：HMJ_KEN");
    },
    logout() {
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("currentMenu");
      window.sessionStorage.removeItem("projectId");
      window.sessionStorage.removeItem("projectName");
      this.$message.success("您已退出");
      this.$router.push("/login");
    },
    async getMenu() {
      const response = await this.$http.get("/getMenu");
      const responseData = response.data;
      if (responseData.code != 10000) {
        this.$message.error(responseData.msg);
      } else {
        this.menuList = responseData.data;
        // console.log(this.menuList);
      }
    },
    // 切换菜单折叠和展开
    toggleChange() {
      this.isCollapse = !this.isCollapse;
      if (this.aside == 200) {
        this.aside = 64;
        this.toggleIcon = "el-icon-s-unfold";
      } else {
        this.aside = 200;

        this.toggleIcon = "el-icon-s-fold";
      }
    },
    clickMenu(path,parentName,name) {
      window.sessionStorage.setItem("currentMenu", path);
      this.addTab(parentName,name);
    },
    getLastMenu() {
      this.currentMenu = window.sessionStorage.getItem("currentMenu");
    },
    async toChangeProject() {
      this.drawer = true;
      this.projectList = await this.$common.getAllProject();
    },
    changeProject(id, name) {
      window.sessionStorage.setItem("projectId", id);
      window.sessionStorage.setItem("projectName", name);
      location.reload();
    },
    delProject() {
      window.sessionStorage.removeItem("projectId");
      window.sessionStorage.removeItem("projectName");
      location.reload();
    },
    select(index) {
      if (index == "1-3") {
        this.logout();
      }
    },
  },
  created() {
    this.getMenu();
    this.getLastMenu();
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
    }
    this.customerName = window.localStorage.getItem("customerName");
    // console.log(this.currentProjectName);
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  // justify-content: space-between;
  // padding-left: 10px;
  align-items: center;
  color: linen;
  font-size: 18px;
  > span {
    // margin-left: 0%;
    font-size: 18px;
    > a {
      color: gold;
    }
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.home_container {
  height: 100%;
}

.logoImg {
  border: 1px;
  border-radius: 20%;
}

.toggle-button {
  background-color: #4a5064;
  color: white;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
