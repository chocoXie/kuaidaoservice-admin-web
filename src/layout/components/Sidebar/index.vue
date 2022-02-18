<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active = "routerPath"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'permissions'
    ]),
    routes() {
      let allRoute = this.$router.options.routes;
      let userPermissions = this.permissions;
      /*
        将权限中的viewUrl与现有的router做匹配
        1.userPermissions 先判断 中的父级是否与this.$router.options.routes 中的匹配
          1> 如果存在，进行children 路由匹配；
             children 路由匹配时，如果子路由不存在与 userPermissions 中，为其添加hidden
          2> 如果不存在，直接为其添加hidden；
       */
      if(userPermissions){
        allRoute.forEach((item,index)=>{
          if(item.path!='*' && item.path != '/login' && item.path != '/404'){
            if(userPermissions[item.path.split('/')[1]]){
              item.children.forEach((_item,index)=>{
                if(_item.path.indexOf(':id')== -1){
                  if(userPermissions[item.path.split('/')[1]].indexOf(_item.path) == -1){
                    _item.hidden = true;
                  }
                }
              })
            }else{
              /*线上=》权限*/
              item.hidden = true;
              /*本地=》不走权限可以直接显示左侧导航*/
              // if(item.meta != undefined){
              //   if(item.meta.initShow){
              //     item.hidden = false;
              //   }else{
              //     item.hidden = true;
              //   }
              // }
            }
          }
        })
      }
      return allRoute;
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    routerPath(){
      return this.$route.meta.guidePath ? this.$route.meta.jumpPath : this.$route.path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style>
.el-menu{
  font-weight: 600;
}
</style>
