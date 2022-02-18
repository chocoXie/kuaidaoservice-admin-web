<template>
  <div class="page_container">
    <div>
      <!--v-if="hasPerm()"-->
      <h4 class="page_title">企业风险 </h4>
    </div>
    <el-form :inline="true" :model="searchRisk">
      <el-form-item label="风险名称">
        <el-input type="text" v-model="searchRisk.riskName" placeholder="请输入风险名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="风险类型">
        <el-select v-model="searchRisk.riskType">
          <el-option v-for="(item,index) in riskTypeList" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native.prevent="searchConfirm" native-type="submit">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="flex_strat">
      <div class="companyRiskNum">
        <i style="color: #f00;">*</i>风险等级：
        <span v-if="!iseditor">{{riskLevelMsg}}</span>
        <el-select v-model="riskLevelMsg" placeholder="请选择" style="width:90px;" @change="changeRiskLevel($event)" v-if="(iseditor || !riskLevelMsg) && hasPerm('修改品牌信息')">
          <el-option v-for="(item,index) in riskLeveLlist" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
        <i class="el-icon-edit editorRisk" @click="editorRisk" v-if="(!iseditor || !riskLevelMsg)&& hasPerm('修改品牌信息')"></i>
      </div>
      <div class="companyRiskNum ml-50">
        <i style="color: #f00;">*</i>风险总数：<span>{{riskTotalNum}}</span>
      </div>
    </div>
    <el-table :data="riskList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column prop="type" label="风险类型" max-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">预警提醒</span>
          <span v-else-if="scope.row.type == 1">自身风险</span>
          <span v-else-if="scope.row.type == 2">周边风险</span>
          <span v-else>历史风险</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="风险标题" max-width="150"></el-table-column>
      <el-table-column prop="tag" label="风险标签" max-width="200"></el-table-column>
      <el-table-column prop="title" label="风险名称" min-width="90">
        <template slot-scope="scope">
          <p class="text_2line">{{scope.row.title}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="riskCount" label="风险数量"  max-width="120"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('删除风险')" type="danger" plain @click="delRiskItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageListTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        wikiBrandId:'',
        wikiCompanyId:'',
        iseditor:false,
        searchRisk: {
          riskName: '',
          riskType: ''
        },
        riskTotalNum:0,
        riskLevelMsg:'',
        riskLeveLlist:['低','中等','较高','高'],
        pageNum:1,
        pageSize:20,
        riskTypeList:[{
          id:0,
          name:'预警提醒'
        },{
          id:1,
          name:'自身风险'
        },{
          id:2,
          name:'周边风险'
        },{
          id:3,
          name:'历史风险'
        }],
        pageListTotal:0,
        initRiskList:[],
        filterRiskList:[],
        riskList: []
      }
    },
    created(){
      this.wikiBrandId = this.$route.query.id;
      this.wikiCompanyId = this.$route.query.companyId;
      this.getCompanyRisk()
      let num = 0
      this.riskList.forEach(item=>{
        this.riskTotalNum += item.total
      })
      this.requestApi.getWikiBrandDetail({id:this.wikiBrandId}).then(res =>{
        this.riskLevelMsg = res.data.company.riskLevel;
        console.log(res.data.company.riskLevel)
      })
    },
    methods:{
      getCompanyRisk(){
        this.requestApi.getCompanyRisk({companyId:this.wikiCompanyId}).then(res =>{
          this.initRiskList = JSON.parse(JSON.stringify(res.data.companyRisks))
          if(this.initRiskList.length > this.pageSize){
            this.riskList = this.initRiskList.slice(0,this.pageSize)
          }else{
            this.riskList = this.initRiskList
          }
          this.riskTotalNum = res.data.riskCountSum
          this.pageListTotal = res.data.companyRisks.length
        })
      },
      searchConfirm(){
        /*筛选后的所有数据*/
        if(this.searchRisk.riskName != '' && this.searchRisk.riskType == ''){
          this.filterRiskList = this.initRiskList.filter(item => {
            return item.title.indexOf(this.searchRisk.riskName)!= -1
          })
        }else if(this.searchRisk.riskName == '' && this.searchRisk.riskType != ''){
          this.filterRiskList = this.initRiskList.filter(item => {
            return item.type ==  this.searchRisk.riskType
          })
        }else{
          this.filterRiskList = this.initRiskList.filter(item => {
            return item.title.indexOf(this.searchRisk.riskName)!= -1 && item.type ==  this.searchRisk.riskType
          })
        }
        this.pageListTotal = this.filterRiskList.length;
        this.riskList = this.filterRiskList.slice(0,20)
        this.pageSize = 20;
        this.pageNum = 1;
      },
      searchReset(){
        this.searchRisk.riskName = '';
        this.searchRisk.riskType = '';
        this.pageSize = 20;
        this.pageNum = 1;
        this.riskList = this.initRiskList.slice(0,20);
        this.pageListTotal = this.initRiskList.length
        this.getL2List();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageNum = 1;
        this.riskList = this.initRiskList.slice(0,val)
      },
      handleCurrentChange(val){
        this.pageNum = val;
        let showListIndex = this.pageSize*val ;
        this.riskList = this.initRiskList.slice(showListIndex-this.pageSize,showListIndex)
      },
      editorRisk(){
        this.iseditor = true
      },
      changeRiskLevel(e){
        this.iseditor = false;
        let data = {};
        data.company = {}
        data.id = this.wikiBrandId;
        data.company['riskLevel'] = e;
        this.requestApi.updateWikiBrandDetail(data).then(res=>{
          console.log(res)
        })
      },
      delRiskItem(row){
        this.$confirm('确认删除此条风险', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.delCompanyRisk({companyRiskId:row.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getCompanyRisk()
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
</script>
<style lang="scss" scoped>
  .companyRiskNum{
    margin-top: 10px;
    font-size: 20px;
    color: #666;
    span{
      font-size: 18px;
    }
    .editorRisk{
      margin-left: 14px;
      font-size: 20px;
    }
  }

</style>
