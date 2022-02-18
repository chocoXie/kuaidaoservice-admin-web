<template>
  <div class="page_container rolePage">
    <h4 class="page_title">
      角色管理
      <el-button v-if="hasPerm('创建角色')" type="primary" class="addItemBtn" @click="editorRole('add')">添加</el-button>
    </h4>
    <el-table :data="roleList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20 text_center">
      <el-table-column fixed prop="id" label="ID" min-width="60"></el-table-column>
      <el-table-column fixed prop="roleName" label="角色名称"  min-width="100"></el-table-column>
      <el-table-column prop="description" label="角色描述" min-width="200">
        <template slot-scope="scope">
          <span v-if="!scope.row.description">暂无描述</span>
          <span v-else class="text_2line">{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inUseCount" label="成员数量" min-width="60"></el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="150"></el-table-column>
      <el-table-column prop="createTimeStr" label="创建时间" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" v-if="hasPerm('修改角色状态')">
        <template slot-scope="scope">
          <el-switch
            class="tableSwitch"
            v-model="scope.row.status"
            active-text="启用"
            @change="roleStatusChange(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('编辑角色')" type="primary" plain @click="editorRole(scope.row.id)">编辑</el-button>
          <el-button v-if="hasPerm('删除角色')" type="danger" plain @click="delThisRole(scope.$index,scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="initPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="roleToal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import qs from 'qs';
  export default {
    name: 'index',
    data() {
      return {
        roleList: [],
        initPageNum:1,
        initPageSize:10,
        roleToal:0,
        currentPage: 1
      }
    },
    created(){
      this.getRoleList({pageNum:this.initPageNum,pageSize:this.initPageSize})
    },
    methods: {
      getRoleList(data){
        this.requestApi.getRoleList(data).then(res => {
          let result = res;
          if(result.code == 0){
            this.roleToal = result.total
            this.roleList = result.data;
            this.roleList.forEach(function(item,index) {
              for(let key in item){
                if(key == 'status'){
                  if(item[key] == 1){
                    item[key] = true
                  }else if(item[key] == 2){
                    item[key] = false
                  }
                }
              }
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      editorRole(_id){
        this.$router.push({
          path:`/system/role/${_id}`
        })
      },
      delThisRole(_index,_id){
        let data = {
          id:_id
        }
        this.$confirm('请确认是否删除该角色', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.delRoleitem(data).then(res =>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getRoleList({pageNum:1,pageSize:10})
              // this.roleList.splice(_index,1)
            }
          }).catch(err=>{
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      roleStatusChange(_index,row){
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
        this.requestApi.updataRoleStatus(data).then(res => {
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
      handleSizeChange(val) {
        this.initPageSize = val;
        this.getRoleList({pageNum:this.initPageNum,pageSize:this.initPageSize})
      },
      handleCurrentChange(val) {
        this.initPageNum = val;
        this.getRoleList({pageNum:this.initPageNum,pageSize:this.initPageSize})
      }
    },

  }
</script>
<style lang="scss" scoped>
  .addRoleBtn{
    position: absolute;
    right: 0;
    top: 0;
    height: 24px;
    line-height: 24px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
