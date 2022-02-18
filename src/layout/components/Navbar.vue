<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/image/user.png" class="user-avatar">
          <p>{{userinfo.userName}}</p>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userinfo',
        'token',
        'permissions',
        'buttonList'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        window.location.reload();
        this.$router.push(`/login`)

      }
    }
  }
</script>
<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;
      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
    .breadcrumb-container {
      float: left;
    }
    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        &.hover-effect {
          cursor: pointer;
          transition: background .3s;
          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }
      .avatar-container {
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          cursor: pointer;
          display: flex;
          justify-content: right;
          align-items: center;
          p{
            margin: 0 4px;
            height: auto;
            padding: 0;
            line-height: 0;
          }
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
