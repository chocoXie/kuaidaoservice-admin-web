<template>
  <div class="page_container logPage">
    <h4 class="page_title">
      所有标签
      <span class="listnum">共<i>286</i>个标签</span>
      <span class="listnum">为您搜索出<i>21</i>个标签</span>
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formInline.title" placeholder="请输入要搜索的标签" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="onSearch">搜索标签</el-button>
      </el-form-item>

    </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :header-cell-style="utils.tableHeaderClass"
      class="mt-20"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="tagName"
        label="标签名称"
        width="220">
      </el-table-column>
      <el-table-column
        prop="tagdesc"
        label="标签描述">
      </el-table-column>
      <el-table-column
        prop="alias"
        label="标签别名">
      </el-table-column>
      <el-table-column
        prop="tagNum"
        label="总数">
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="onEdit(scope.row.id)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="onDel(scope.$index,scope.row.id)" circle></el-button>
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
        :page-size="formInline.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="advertTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'tagManage',
    data(){
      return{
        formInline: {
          title: '',
          custome: '',
          creator:'',
          tag:'',
          releaseDate:'',
          pageNum:1,
          pageSize:10,
        },
        advertTotal: 0,
        currentPage: 1,
        tableData: [{
          tagName: '开店指南',
          tagdesc: '标签描述标签描述标签描述标签描述',
          alias: 'alias',
          tagNum:'12',

        }, {
          tagName: '开店指南',
          tagdesc: '标签描述标签描述标签描述标签描述',
          alias: 'alias',
          tagNum:'12',
        }, {
          tagName: '开店指南',
          tagdesc: '标签描述标签描述标签描述标签描述',
          alias: 'alias',
          tagNum:'12',
        }, {
          tagName: '开店指南',
          tagdesc: '标签描述标签描述标签描述标签描述',
          alias: 'alias',
          tagNum:'12',
        }, {
          tagName: '开店指南',
          tagdesc: '标签描述标签描述标签描述标签描述',
          alias: 'alias',
          tagNum:'12',
        }],
        multipleSelection: []

      }
    },
    methods:{
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },


      ToArticle() {
        this.$router.push({
          path: `/informationManage/article`
        })
      },
      // 搜索
      onSearch() {
        console.log('Search!');
      },

      // 编辑
      onEdit(_msg) {
        this.$router.push({
          path: `/informationManage/list/${_msg}`
        })
      },
      onDel(_index,_id){
        let _this =this;
        _this.$confirm('此操作将永久删除文章，是否继续？', '提示', {
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
        this.formInline.pageSize = val;
        this.getAdvertList(this.formInline)
      },
      handleCurrentChange(val) {
        this.formInline.pageNum = val;
        this.getAdvertList(this.formInline)
      },
      getAdvertList(data = {}) {
        this.requestApi.getAdvertList(data).then(res => {
          if (res.code == 0) {
            this.ADInfoList = res.data;
            this.advertTotal = res.total;
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
    }
  }
</script>
<style scoped>
  .listnum{
    font-size: 14px!important;color: #333;margin-left: 20px;font-weight: normal;
  }
  .towrite{
    position: absolute;
    right: 100px;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .tovideo{
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
