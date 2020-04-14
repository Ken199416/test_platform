
import axios from 'axios'
import vm from '../main.js'
import { compile } from 'vue-template-compiler';
export default{
    test :function () {
        console.log("common测试");
    },

    test1:function (params) {
        console.log(params);
    },

    getAllDataSource :async function(){
        const {data : response} = await axios.get('/getDataSourceConfig');
            if(response.code == 10000){
              return response.data;
             }else{
              vm.$message.error(response.msg);
            }
    },
// 获取全部项目
    async getAllProtocol(){
        const {data : response} = await axios.get('/getAllProtocol');
            if(response.code == 10000){
              return response.data;
             }else{
              vm.$message.error(response.msg);
            }
    },
// 获取全部协议
    async getAllProject(){
      const {data : response} = await axios.get('/getAllProject');
          if(response.code == 10000){
            return response.data;
           }else{
            vm.$message.error(response.msg);
          }
  },

    // async ErrorTest(){
    //     return await axios.get('/getError');
    // }

    async getComponentInfoById(cid){
        const {data : response} = await axios.get('/getComponentById?id='+cid);
            if(response.code == 10000){
              return response.data;
             }else{
              vm.$message.error(response.msg);
            }
    },

// 公共get请求
    async get(url,params){
        const axiosData = await axios.get(url,{
          params: params
        });
        if(axiosData.status == 200){
            return axiosData.data;
        }else{
          vm.$message.error("服务器繁忙，请稍后重试");
        }
    },

// 公共post请求
    async post(url,params){
      const axiosData = await axios.post(url,params);
      if(axiosData.status == 200){
          return axiosData.data; 
      }else{
        vm.$message.error("服务器繁忙，请稍后重试");
        return axiosData.data; 
      }
    },

    async getAllComponent(){
      const axiosData =  await axios.get('/getComponentList');
      if(axiosData.status == 200){
        if(axiosData.data.code == 10000){
          return axiosData.data.data;
        }else{
          vm.$message.error(axiosData.data.msg);
        }
        
      }else{
        vm.$message.error("服务器繁忙，请稍后重试");
      }
    }
    ,
      //  json校验
      isJSON(str) {
        if (typeof str == "string") {
          try {
            var obj = JSON.parse(str);
            if (typeof obj == "object" && obj) {
              return true;
            } else {
              return false;
            }
          } catch (e) {
            console.log("error：" + str + "!!!" + e);
            return false;
          }
          return true;
        }
      }
      ,
      checkSessionProject(){
        if(window.sessionStorage.getItem("projectId") != null && window.sessionStorage.getItem("projectName") != null){
          console.log("获取");
          this.$global.currentProjectId = window.sessionStorage.getItem("projectId");
          this.$global.currentProjectName = window.sessionStorage.getItem("projectName");
        }
          
      }
      








}