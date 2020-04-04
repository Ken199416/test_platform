
import axios from 'axios'
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
              this.$message.error(response.msg);
            }
    },

    async getAllProject(){
        const {data : response} = await axios.get('/getAllProject');
            if(response.code == 10000){
              return response.data;
             }else{
              this.$message.error(response.msg);
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
              this.$message.error(response.msg);
            }
    }






}