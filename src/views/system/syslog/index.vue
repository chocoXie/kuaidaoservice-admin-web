<template>
  <div class="page_container logPage">
    <h4 class="page_title">
      系统日志
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="searchLogForm" >
      <el-form-item label="用户">
        <el-input type="text" v-model="searchLogForm.userName" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input type="tel" v-model="searchLogForm.phone" placeholder="请输入手机号" maxlength="11" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色类型">
        <el-select v-model="searchLogForm.roleIds" placeholder="请选择角色" clearable>
          <el-option v-for="(item,index) in roleList" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" clearable>
        <el-date-picker
          v-model="searchLogForm.startTime"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchConfirm">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="sysLogList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column fixed prop="userName" label="用户" min-width="140"></el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="140"></el-table-column>
      <el-table-column prop="roleNames" label="角色类型" min-width="140"></el-table-column>
      <el-table-column prop="businessName" label="操作模块" min-width="140"></el-table-column>
      <el-table-column prop="description" label="操作" min-width="140"></el-table-column>
      <el-table-column prop="createTimeStr" label="操作时间" min-width="140"></el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchLogForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="logTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data(){
      return{
        currentPage:1,
        roleList:[],
        searchLogForm:{
          phone:'',
          userName:'',
          roleIds:'',
          startTime:'',
          pageNum:1,
          pageSize:10
        },
        /*日期选择*/
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              console.log(date)
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        sysLogList:[],
        logTotal:0
      }
    },
    created(){
      this.getRoleList()
      this.sysAllLog(this.searchLogForm)
    },
    methods:{
      /*获取角色列表*/
      getRoleList(){
        this.requestApi.getAllRole().then(res => {
          let result = res;
          if(result.code == 0){
            this.roleList = result.data;
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      sysAllLog(data){
        this.requestApi.getSysLogList(data).then(res=>{
          if(res.code == 0){
            this.sysLogList = res.data
            this.logTotal = res.total
          }
        })
      },
      searchConfirm(){
        this.searchLogForm.pageNum = 1;
        this.searchLogForm.pageSize = 10
        this.sysAllLog(this.searchLogForm)
      },
      searchReset(){
        this.searchLogForm = {
            phone:'',
            userName:'',
            roleIds:'',
            startTime:'',
            pageNum:1,
            pageSize:10
        };
        this.sysAllLog(this.searchLogForm)
      },
      handleSizeChange(val){
        this.searchLogForm.pageSize = val;
        this.sysAllLog(this.searchLogForm)
      },
      handleCurrentChange(val){
        this.searchLogForm.pageNum = val;
        this.sysAllLog(this.searchLogForm)
      }
    }
  }
</script>
<style lang="scss">
  .logPage{
    .el-form--inline .el-form-item{
      margin-right: 30px;
    }
    .el-select {
      width: 100%;
    }
  }
</style>
<style scoped>
</style>
