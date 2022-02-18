<template>
  <div class="login-container">
    <img src="@/assets/image/logo_top.png" class="pageLogo">
    <img src="@/assets/image/bg_right.png" class="pageTip">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Hi {{welcomeMsg}}</h3>
        <p class="tip">欢迎来到<span>餐盟严选运营后台</span></p>
      </div>
      <el-form-item prop="phone" :class="{active:activeUser}">
        <span class="icon icon_user" :class="{active:activeUser}"></span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入登录账号"
          name="phone"
          type="tel"
          tabindex="1"
          maxlength="11"
          auto-complete="on"
          @focus="addClass('user')"
          @blur="removeClass('user')"
        />
      </el-form-item>
      <el-form-item prop="password" :class="{active:activePass}">
        <span class="icon icon_pass" :class="{active:activePass}"></span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入登录密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @focus="addClass('pass')"
          @blur="removeClass('pass')"
        />
      </el-form-item>
      <el-button :loading="loading" class="loginBtn" @click.native.prevent="handleLogin" native-type="submit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { setToken ,getPermissions } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入您的账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      welcomeMsg:'',
      activeUser:false,
      activePass:false,
      loginForm: {
        phone: '',
        password: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created(){
    this.getTime();
  },
  methods: {
    getTime(){
      let _newTime = new Date();
     if(_newTime.getHours() >13){
       this.welcomeMsg = '下午好';
     }else {
       this.welcomeMsg = '上午好';
     }
    },
    addClass(msg){
      if(msg == 'user'){
        this.activeUser = true;
      }else if(msg == 'pass'){
        this.activePass = true;
      }
    },
    removeClass(msg){
      if(msg == 'user'){
        this.activeUser = false;
      }else if(msg == 'pass'){
        this.activePass = false;
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            this.$store.dispatch('user/getUserPermissions').then(resData =>{
              if(resData.length == 0){
                this.$message.error('暂无权限，请联系管理员');
              }else{
                this.$router.push('/')
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@supports (-webkit-mask: none) and (not (cater-color: #333)) {
  .login-container .el-input input {
    color: #333;
  }
}
.login-container {
  .el-form-item {
    background: #fff;
    margin-bottom: 26px;
    width: 100%;
    height: 44px;
    color: #454545;
    border-radius: 4px;
    border: 1px solid #DCDCDC;
    &.active{
      border: 1px solid #3073F6 ;
      .icon.active{
        &.icon_user{
          background-image: url("~@/assets/image/icon_user.png");
        }
        &.icon_pass{
          background-image: url("~@/assets/image/icon_pass.png");
        }
      }
    }
    .el-form-item__content{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-input {
        flex: 1;
        .el-input__inner{
          padding-left: 0;
        }
        input {
          background: transparent;
          border: 0px;
          -webkit-appearance: none;
          color: #333;
          caret-color: #333;
          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px #fff inset !important;
            -webkit-text-fill-color: #333 !important;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$light_gray:#eee;

.login-container {
  position: relative;
  padding: 28px;
  min-height: 100%;
  width: 100%;
  background: url('~@/assets/image/pageBgLogo.png') no-repeat #3073F6;;
  background-size: 788px 258px;
  background-position: -13% 32%;
  overflow: hidden;
  .pageLogo{
    display: block;
  }
  .pageTip{
    position: absolute;
    top: 0;
    right: 0;
  }
  .login-form {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    right: 12%;
    width: 440px;
    max-width: 100%;
    padding: 60px 60px 87px;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
  }
  .icon {
    width: 37px;
    height: 44px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 12px 14px;
    &.icon_user{
      background-image: url("~@/assets/image/icon_user_init.png");
    }
    &.icon_pass{
      background-image: url("~@/assets/image/icon_pass_init.png");
    }
  }
  .title-container {
    margin-bottom: 35px;
    position: relative;
    .title {
      margin-bottom: 10px;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #282828;
      line-height: 33px;
      letter-spacing: 1px;
      text-align: center;
    }
    .tip{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      letter-spacing: 1px;
      text-align: center;
      span{
        color: #287CFA ;
      }
    }
  }
  .loginBtn{
    width: 100%;
    height: 44px;
    background: #3073F6;
    border-radius: 4px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;

  }
}
</style>
