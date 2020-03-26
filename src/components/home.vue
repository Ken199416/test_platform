<template>
    <div>
        {{title}}
        <el-button @click.prevent="logout()" type="info">退出</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return {
            title:'Home'
        }
    },methods:{
        logout(){
            window.sessionStorage.clear();
            this.$message.success("您已退出");
            this.$router.push('/login');
        }
    }
}
</script>
<style lang="less" scoped>

</style>