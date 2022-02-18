<template>
  <div class="page_container logPage">
    <h4 class="page_title">
      广告位管理
      <el-button v-if="hasPerm('添加广告位')" type="primary" class="addItemBtn" @click="ADInfoOpera('add')">添加</el-button>
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="searchADForm">
      <el-form-item label="广告位名称">
        <el-input type="tel" v-model="searchADForm.name" placeholder="广告位名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="页面名称">
        <el-select v-model="searchADForm.pageName" placeholder="页面名称" clearable>
          <el-option v-for="(item,index) in pageNameList" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端">
        <el-select v-model="searchADForm.terminal" placeholder="请选择终端" clearable>
          <el-option label="移动端" value="1"></el-option>
          <el-option label="PC" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchConfirm" @click.native.prevent="searchConfirm" native-type="submit">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="ADInfoList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column fixed prop="name" label="广告位名称" min-width="100"></el-table-column>
      <el-table-column prop="type" label="页面接口" min-width="130">
        <template slot-scope="scope">{{scope.row.type | ApiTtype}}</template>
      </el-table-column>
      <el-table-column prop="terminal" label="终端" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.terminal == 1">移动端</span>
          <span v-else>PC</span>
        </template>
      </el-table-column>
      <el-table-column prop="pageName" label="页面名称" min-width="100"></el-table-column>
      <el-table-column prop="createUser" label="添加人" min-width="130"></el-table-column>
      <el-table-column prop="updateTimeStr" label="更新时间" min-width="130"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" v-if="hasPerm('编辑广告位状态')">
        <template slot-scope="scope">
          <el-switch
            class="tableSwitch"
            v-model="scope.row.status"
            active-text="启用"
            @change="advertStatusChange(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('编辑广告位')" type="primary" plain @click="ADInfoOpera(scope.row.id)">编辑</el-button>
          <el-button v-if="hasPerm('删除广告位')" type="danger" plain @click="ADInfoDel(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchADForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="advertTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'brandADspace',
    data() {
      return {
        pageNameList:['首页','分类页','品类页','活动页','搜索页','看点列表页','个人中心页'],
        searchADForm: {
          name: '',
          pageName: '',
          terminal: '',
          pageNum:1,
          pageSize:10,
        },
        ADInfoList: [],
        advertTotal: 0,
        currentPage: 1
      }
    },
    created() {
      this.getAdvertList(this.searchADForm)
    },
    methods: {
      getAdvertList(data = {}) {
        this.requestApi.getAdvertList(data).then(res => {
          if (res.code == 0) {
            this.ADInfoList = res.data
            this.advertTotal = res.total
            this.ADInfoList.forEach(function(item, index) {
              for (let key in item) {
                /*el-switch 绑定的值伪 true 与 false*/
                if (key == 'status') {
                  if (item[key] == 1) {
                    item[key] = true
                  } else if (item[key] == 2) {
                    item[key] = false
                  }
                }
              }
            })
          }
        })
      },
      searchConfirm() {
        this.searchADForm.pageNum = 1;
        this.searchADForm.pageSize = 10;
        this.getAdvertList(this.searchADForm)
      },
      searchReset(){
        for ( let key in this.searchADForm){
          if(key != 'pageNum' && key != 'pageSize'){
            this.searchADForm[key] = ''
          }
        }
        this.getAdvertList(this.searchADForm)
      },
      advertStatusChange(_index,row){
        let _status;
        if(row.status){
          _status = 1
        }else{
          _status = 2
        }
        let data = {
          id:row.id,
          status:_status
        };
        this.requestApi.updateAdvertStatus(data).then(res => {
          if(res.code == 0){
            this.$notify({
              type: 'success',
              message: '修改成功'
            });
          }else{
            this.$notify.error({
              message: '修改失败'
            });
          }
        }).catch(err =>{
          console.log(err)
        })
      },
      ADInfoOpera(_msg) {
        this.$router.push({
          path: `/advertising/brandADspace/${_msg}`
        })
      },
      ADInfoDel(_index,_id){
        let _this =this;
        _this.$confirm('请确认是否删除该广告位', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.requestApi.deleteAdvert({id:_id}).then(res =>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.getAdvertList({pageNum:1,pageSize:10});
            }
          }).catch(err=>{
            console.log(err)
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        this.searchADForm.pageSize = val;
        this.getAdvertList(this.searchADForm)
      },
      handleCurrentChange(val) {
        this.searchADForm.pageNum = val;
        this.getAdvertList(this.searchADForm)
      }
    }
  }
</script>
<style scoped>
</style>
