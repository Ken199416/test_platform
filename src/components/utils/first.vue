<template>
    <div>
<el-table border
      :data="tableData"
      style="width: 100%">
      <el-table-column v-for="item in list"
        :prop="item.name"
        :label="item.name"
        width="180">
      </el-table-column>
</el-table>
        </div>    
</template>
<script>
export default {
    data(){
        return{
            tableData: [{
            id: '1',
            name: '王小虎1',
            url: '上海市1',
            user:'user1',
            password:'password1',
            projectId:'password1'
          },
          {
            id: '2',
            name: '王小虎2',
            url: '上海市2',
            user:'user2',
            password:'password2',
            projectId:'password2'
          },{
            id: '3',
            name: '王小虎3',
            url: '上海市3',
            user:'user3',
            password:'password3',
            projectId:'password3'
          }
          ],
          list:[
              {
                  name:"id",
              },
              {
                  name:"name",
              },
              {
                  name:"url",
              },
              {
                  name:"user",
              },
              {
                  name:"password",
              },
              {
                  name:"projectId",
              }
                

          ]
        }
    }
    
}
</script>
><style lang="stylus" scoped>

</style>