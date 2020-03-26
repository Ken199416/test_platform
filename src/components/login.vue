<template>
    <div class="login_container">
        <div class="login_title">{{title}}</div>
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="平台首页">
            </div>
            <div>
                <el-form ref="loginFormRef"  :rules="rules" class="login_form" :model="form" label-width="70px">
                    <el-form-item label="用户" prop="username">
                        <el-input prefix-icon="el-icon-user" v-model="form.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>

                     <el-form-item label="密码" prop="password">
                        <el-input type="password" prefix-icon="el-icon-lock" v-model="form.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login()">登录</el-button>
                        <!-- <el-button type="info" @click="reset()">重置</el-button> -->
                        <el-button type="danger" @click="register()">注册</el-button>
                        <el-button type="success" @click="test()">预览</el-button>
                    </el-form-item>
                </el-form>    
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            title:'Ken的自动化测试平台',
            form:{
                username:'admin',
                password:'19940822'
            },
            testData:{
                test:"test1",
                desc:"desc1"
            },
            rules: {
                username: [
                    { required: true, message: '请输入您的用户名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入您的密码', trigger: 'blur' },
                    { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
                ]
        }
        }
    },methods:{
        reset (){
            // 为绑定的form表单清除内容
            this.$refs.loginFormRef.resetFields();
        },
        
        login (){
            this.$refs.loginFormRef.validate(async (valid)=>{
                if(valid){
                    const result = await this.$http.post('/login',this.form);
                    // console.log(result);
                    const data = result.data;
                    if(data.code == 10000){
                        this.$message.success(data.msg);
                        console.log("token ： " + data.data.id);
                        window.sessionStorage.setItem("token",data.data.id);
                        this.$router.push('/home');
                    }else{
                        this.$message.error(data.msg);                    }
                    
                }else{

                }
            })
        },
        register (){
            this.$message("注册功能尚未开放，尽请期待");
        },
        test (){
             this.$http.post("/other",this.form).then(function(data){
                 console.log(data.data);
             })
        }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
        background-color: slategray;
        height: 100%;
    }

    .login_box{
        width: 450px;
        height: 300px;
        background-color: white;
        border-radius: 10px;
        position:absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            position:absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 150px;
            height: 150px;
            border: 1px solid white;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            background-color: thistle;
            img {
                width: 100%;
                height: 100%s;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .btns{
        display: flex;
        justify-content: flex-end;
    }

    .registerBtn{
        display: flex;
        justify-content:flex-start
    }

    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .login_title{
        text-align: center;
        font-size: 500%;
        color: wheat;
    }

</style>