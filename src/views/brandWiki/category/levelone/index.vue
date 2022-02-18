<template>
  <div class="page_container categoryInfo" >
    <h4 class="page_title">
      品类管理-一级品类
      <el-button type="primary" class="addItemBtn" v-if="hasPerm('添加品类')" @click="categoryInfoOpera('add')">添加品类</el-button>
    </h4>
    <el-form :inline="true" :model="categorySearch">
      <el-form-item label="品类名称：">
        <el-input type="text" v-model="categorySearch.name" placeholder="输入品类名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native.prevent="searchConfirm" native-type="submit">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!---列表-->
    <el-table :data="categoryTable" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column prop="name" label="品类名称" min-width="90"></el-table-column>
      <el-table-column prop="childCount" label="二级品类数量" min-width="90"></el-table-column>
      <el-table-column prop="brandCount" label="品牌数" min-width="90"></el-table-column>
      <el-table-column prop="weight" label="权重" min-width="90"></el-table-column>
      <el-table-column prop="updateTimeStr" label="更新时间" min-width="90"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('修改品类')" type="primary" plain @click="categoryInfoOpera(scope.row)">编辑</el-button>
          <el-button v-if="hasPerm('删除品类')" type="danger" plain @click="delThisCategory(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10,20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categoryTotal">
      </el-pagination>
    </div>
    <!--弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true"  @close="closeDialog('editorPLInfo')">
      <el-form :model="editorPLInfo" ref="editorPLInfo" :rules="editorPLRule">
        <el-form-item label="添加品类:" :label-width="formLabelWidth">
          <span>一级品类</span>
        </el-form-item>
        <el-form-item label="品类名称:" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editorPLInfo.name" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="权重:" :label-width="formLabelWidth" prop="weight">
          <el-input v-model="editorPLInfo.weight" autocomplete="off" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('editorPLInfo')">取 消</el-button>
        <el-button type="primary" @click="PLInfoSubmit('editorPLInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data(){
      var checkName = function(rule, value, callback) {
        if(value.length <4 || value.length >6){
          callback(new Error('请输入4-6个字符'))
        }else{
          callback()
        }
      };
      return{
        categorySearch:{
          name:''
        },
        categoryList:[],
        searchInitList:[],
        categoryTable:[],
        pageSize:10,
        pageNum:1,
        categoryTotal:0,
        editorPLInfo: {
          name: '',
          weight: ''
        },
        editorPLRule:{
          name:[
            { required: true, message: '请输入品类名称', trigger: 'blur' },
            { validator: checkName, trigger: 'blur' }
            ],
          weight:[ { required: true, message: '请输入品类权重', trigger: 'blur' }]
        },
        dialogFormVisible:false,
        formLabelWidth:'120px',
        dialogTitle:''
      }
    },
    created(){
      this.getAllCategory()
    },
    methods:{
      getAllCategory(){
        let data ={
          level: 1
        }
        this.requestApi.getCategoryList(data).then(res=>{
          this.categoryList = JSON.parse(JSON.stringify(res.data));
          this.categoryTotal = res.data.length
          if(res.data.length > this.pageSize){
            this.categoryTable = this.categoryList.slice(0,this.pageSize)
          }else{
            this.categoryTable = this.categoryList
          }
        })
      },
      categoryInfoOpera(data){
        this.dialogFormVisible = true;
        if(data == 'add'){
          this.dialogTitle = '新增品类';
        }else{
          this.dialogTitle = '编辑品类';
          this.editorPLInfo.id = data.id;
          this.editorPLInfo.parentId = data.parentId;
          this.editorPLInfo.name = data.name;
          this.editorPLInfo.weight = data.weight;
        }
      },
      PLInfoSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.dialogTitle == '新增品类'){
              this.requestApi.addCategory(this.editorPLInfo).then(res =>{
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.dialogFormVisible = false;
                this.pageSize = 10;
                this.pageNum = 1;
                this.getAllCategory();
              })
            }else{
              this.requestApi.updateCategory(this.editorPLInfo).then(res =>{
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });
                this.dialogFormVisible = false;
                this.pageSize = 10;
                this.pageNum = 1;
                this.getAllCategory();
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageNum = 1;
        if(this.categorySearch.name != ''){
          this.categoryTable = this.searchInitList.slice(0,val)
        }else{
          this.categoryTable = this.categoryList.slice(0,val)
        }
      },
      handleCurrentChange(val){
        this.pageNum = val;
        let showListIndex = this.pageSize*val ;
        if(this.categorySearch.name != ''){
          this.categoryTable = this.searchInitList.slice(showListIndex-this.pageSize,showListIndex)
        }else{
          this.categoryTable = this.categoryList.slice(showListIndex-this.pageSize,showListIndex)
        }
      },
      searchConfirm(){
          this.searchInitList = this.categoryList.filter(item =>{
            return item.name.indexOf(this.categorySearch.name) != -1
          })
        this.categoryTotal = this.searchInitList.length;
        this.categoryTable = this.searchInitList.slice(0,this.pageSize)
        this.pageSize = 10;
        this.pageNum = 1;
      },
      searchReset(){
        this.categorySearch.name = '';
        this.pageSize = 10;
        this.pageNum = 1;
        this.getAllCategory();
      },
      closeDialog(formName){
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.editorPLInfo.name = ''
        this.editorPLInfo.weight = ''
      },
      delThisCategory(data){
        if(data.childCount > 0){
          this.$alert('此一级品类下有绑定的二级品类，暂不支持删除', '提示', {
            confirmButtonText: '确定'
          });
        }else{
          this.$confirm('确认是否删除此品类', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.requestApi.delCategory({id:data.id}).then(res =>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.pageSize = 10;
              this.pageNum = 1;
              this.getAllCategory();
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    }
  }
</script>
<style>
  .categoryInfo input::-webkit-outer-spin-button,
  .categoryInfo input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .categoryInfo input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
<style lang="scss" scoped>

</style>
