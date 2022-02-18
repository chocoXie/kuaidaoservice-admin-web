<template>
  <div class="page_container" >
    <h4 class="page_title">
      品牌管理
      <el-button type="primary" class="addItemBtn" v-if="hasPerm('新增百科品牌')" @click="addBrandinfo">新增品牌信息</el-button>
    </h4>
    <el-form :inline="true" :model="brandSearch">
      <el-form-item label="品牌名称">
        <el-input type="text" v-model="brandSearch.name" placeholder="输入品牌名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="brandSearch.status" clearable>
          <el-option v-for="(item,index) in brandStatus" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="一级品类">
        <el-select v-model="brandSearch.level1" clearable @change="filterL2($event)">
          <el-option v-for="(item,index) in cLevel1" :label="item.name" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级品类">
        <el-select v-model="brandSearch.level2" clearable :disabled="filterL2List.length == 0">
          <el-option v-for="(item,index) in filterL2List" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native.prevent="searchConfirm" native-type="submit">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!---列表-->
    <el-table :data="wikiBrandList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column prop="id" label="品牌ID" min-width="90"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" min-width="90">
        <template slot-scope="scope">
          <img v-if="scope.row.logoUrl != null" style="width: 80px; height: 80px" :src="scope.row.logoUrl">
          <img v-else style="width: 80px; height: 80px" src="@/assets/image/wikibrand_initLogo.png" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="品牌名称" min-width="90"></el-table-column>
      <el-table-column prop="category" label="一级品类" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.category != null && scope.row.category.parent"> {{scope.row.category.parent.name}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="二级品类" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.category != null">  {{scope.row.category.name}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" min-width="70"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">已上架</span>
          <span v-else>已下架</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTimeStr" label="更新时间" min-width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="danger" plain v-if="hasPerm('删除百科品牌')" @click="delThisBrand(scope.row)">删除</el-button>
          <el-button type="success" plain v-if="scope.row.status == 2 && hasPerm('品牌上架')" @click="brandOnline(scope.row,scope.$index)">上架</el-button>
          <el-button type="warning" plain v-else-if="scope.row.status == 1 && hasPerm('品牌下架')" @click="brandOffLine(scope.row,scope.$index)">下架</el-button>
          <el-dropdown v-if="hasPerm('查询品牌详情')" trigger="click" class="ml-10" @command="getEditorType">
            <el-button type="primary">
              编辑<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item :command="'companyInfo?id='+scope.row.id" >基本信息</el-dropdown-item>
              <el-dropdown-item v-if="hasPerm('查询企业风险')" :command="'companyrisk?id='+scope.row.id + '&companyId='+scope.row.companyId">企业风险</el-dropdown-item>
              <el-dropdown-item v-if="hasPerm('查询商标列表')" :command="'trademarks?id='+scope.row.id + '&companyId='+scope.row.companyId">商标信息</el-dropdown-item>
              <el-dropdown-item :command="'store?id='+scope.row.id + '&companyId='+scope.row.companyId">门店分布</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        :page-size="brandSearch.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="brandTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'brandLibrary',
    data(){
      return{
        brandSearch:{
          name:'',
          status:'',
          level1:'',
          level2:'',
          pageSize:10,
          pageNum:1
        },
        brandSearchInfo:{
          name:'',
          status:'',
          categoryIds:'',
          pageSize:10,
          pageNum:1
        },
        brandStatus:[
          {id:'',name:'全部'},
          {id:1,name:'已上架'},
          {id:2,name:'已下架'}
        ],
        currentPage:1,
        brandTotal:0,
        cLevel1:[],
        cLevel2:[],
        filterL2List:[],
        wikiBrandList:[]
      }
    },
    created(){
      this.getL1List();
      this.getL2list()
      this.getAllWIkiBrand()
    },
    methods:{
      /*获取所有的一级品类*/
      getL1List(){
        let data ={
          level: 1
        }
        this.requestApi.getCategoryList(data).then(res=>{
          this.cLevel1 = res.data
        })
      },
      /*获取所有的二级品类*/
      getL2list(){
        let data = {
          level:2
        }
        this.requestApi.getCategoryList(data).then(res=>{
          this.cLevel2 = res.data
        })
      },
      /*根据一级品类筛选二级品类*/
      filterL2(e){
        this.filterL2List = [];
        this.brandSearch.level2 = ''
        this.filterL2List = this.cLevel2.filter(item=>{
          return item.parentId == e;
        })
      },
      getAllWIkiBrand(){
        this.requestApi.getWikiBrandList(this.brandSearchInfo).then(res=>{
          /*筛选条件全部为空，默认展示已上架品牌*/
          if(this.brandSearchInfo.categoryIds == '' && this.brandSearchInfo.name == ''&& this.brandSearchInfo.status == ''){
            let _data = JSON.parse( JSON.stringify(res.data))
            this.wikiBrandList = _data.filter(item =>{
              return item.status == 1;
            })
          }else{
            this.wikiBrandList = res.data;
          }
          this.brandTotal = res.total
        })
      },
      searchConfirm(){
        if(this.brandSearch.level2 != ''){
          this.brandSearchInfo.categoryIds = this.brandSearch.level2;
        }else{
          let categoryIds = [];
          this.filterL2List.forEach(item => {
            categoryIds.push(item.id)
          })
          this.brandSearchInfo.categoryIds = categoryIds.toString();
        }
        this.brandSearchInfo.name = this.brandSearch.name;
        this.brandSearchInfo.status = this.brandSearch.status;
        this.getAllWIkiBrand()
      },
      searchReset(){
        this.brandSearch = {
          name:'',
          status:'',
          level1:'',
          level2:'',
          pageSize:10,
          pageNum:1
        };
        this.brandSearchInfo = {
          name:'',
          status:'',
          categoryIds:'',
          pageSize:10,
          pageNum:1
        }
        this.getAllWIkiBrand()
      },
      delThisBrand(data){
        this.$confirm('确定删除此品牌?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.delWikiBrandItem({id:data.id}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAllWIkiBrand()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      brandOnline(data,_index){
        this.$confirm('确定上架此品牌?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.wikiBrandOnline({id:data.id}).then(res=>{
            this.wikiBrandList[_index].status = 1
          })
          this.$message({
            type: 'success',
            message: '上架成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上架'
          });
        });
      },
      brandOffLine(data,_index){
        this.$confirm('确定下架此品牌?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.wikiBrandOffLine({id:data.id}).then(res=>{
            this.wikiBrandList[_index].status = 2
          })
          this.$message({
            type: 'success',
            message: '下架成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下架'
          });
        });
      },
      handleSizeChange(val){
        this.brandSearchInfo.pageSize = val;
        this.getAllWIkiBrand()
      },
      handleCurrentChange(val){
        this.brandSearchInfo.pageNum = val;
        this.getAllWIkiBrand()
      },
      getEditorType(command){
        this.$router.push({
          path:command
        })
      },
      addBrandinfo(){
        this.$router.push({
          path:'companyInfo'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  img{
    margin: 0 auto;
    display: block;
    width: 80px;
    height: 80px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
</style>
