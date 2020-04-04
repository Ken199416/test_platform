<template>
  <!-- {{title}} -->
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logoImg" src="../assets/img/userLogo.jpg" alt="用户头像" height="40px " />
        <span>测试平台</span>
      </div>
      <span >
        欢迎您，
        <a href>{{customerName == '' ? '空昵称' : customerName}}</a>
      </span>
      <el-button @click.prevent="logout()" type="info">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="aside+'px'">
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
          <el-submenu :index="item.path" :key="item.id" v-for="item in menuList">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文案 -->
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              :key="subItem.id"
              v-for="subItem in item.chlidren"
              @click="clickMenu(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
        <!-- 通用底部 -->
        <div style="margin-top: 50px;margin-left:45%">
          <el-button icon="el-icon-phone-outline" @click="callMe()">Author</el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="该平台留有多处明显BUG，发现者联系我，发5元微信红包"
            placement="top"
            :enterable="false"
          >
            <el-button icon="el-icon-info" ></el-button>
          </el-tooltip>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <!-- <el-button @click.prevent="logout()" type="info">退出</el-button> -->
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
      customerName: ""
    };
  },
  methods: {
    callMe(){
      // this.$message.success("作者微信：HMJ_KEN");
      this.$alert("作者微信：HMJ_KEN");
    },
    logout() {
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("currentMenu");
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
    clickMenu(path) {
      window.sessionStorage.setItem("currentMenu", path);
    },
    getLastMenu() {
      this.currentMenu = window.sessionStorage.getItem("currentMenu");
    }
  },
  created() {
    this.getMenu();
    this.getLastMenu();
    this.customerName = window.localStorage.getItem("customerName");
  }
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  align-items: center;
  color: linen;
  font-size: 30px;
  > span {
    margin-left: 73%;
    font-size: 18px;
    > a {
      color: gold;
    }
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
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