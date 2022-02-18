<template>
  <div class="page_container">
    <h4 class="page_title p-r">消息发送记录</h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="消息标题">
        <el-input type="text" v-model="searchForm.title" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="发送时间" clearable>
        <el-date-picker
          v-model="searchForm.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择开始日期">
        </el-date-picker>
        -
        <el-date-picker
          v-model="searchForm.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="请选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchConfirm">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="historyList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass"
              class="mt-20">
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">
          {{(searchForm.pageNum-1)*searchForm.pageSize+1+scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="消息标题" prop="notifyTitle"></el-table-column>
      <el-table-column label="发送内容" prop="notifyContent"></el-table-column>
      <el-table-column label="发送时间" prop="pushTime"></el-table-column>
      <el-table-column label="发送用户数" prop="userNum"></el-table-column>
      <el-table-column label="发送用户群" prop="groupingType">
        <template slot-scope="scope">
          <span v-if="scope.row.groupingType == 1">全部</span>
          <span v-else>{{scope.row.groupingName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data(){
      return{
        searchForm: {
          title: '',
          startTime: '',
          endTime: '',
          pageNum:1,
          pageSize:10,
        },
        listTotal:100,
        historyList:[]
      }
    },
    created(){
      this.getHistoryList()
    },
    methods:{
      getHistoryList(){
        this.requestApi.getPushMsgHistory(this.searchForm).then(res =>{
          this.historyList = res.data;
          this.listTotal = res.total;
        })
      },
      searchConfirm(){
        if(this.searchForm.startTime != '' && this.searchForm.endTime != ''){
          if(this.searchForm.startTime > this.searchForm.endTime){
            this.$message.error('开始时间不能大于结束时间');
            return false;
          }
        };
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize =10;
        this.getHistoryList();
      },
      searchReset(){
        this.searchForm.title = '';
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize =10;
        this.getHistoryList()
      },
      handleSizeChange(val){
        this.searchForm.pageSize = val;
        this.getHistoryList()
      },
      handleCurrentChange(val){
        this.searchForm.pageNum = val;
        this.getHistoryList()
      }
    }
  }
</script>
<style scoped>
</style>
