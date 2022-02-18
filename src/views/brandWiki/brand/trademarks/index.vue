<template>
  <div class="page_container">
    <!--v-if="hasPerm()"-->
    <h4 class="page_title">商标信息</h4>
    <el-table :data="trademarksList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column label="序号" min-width="100">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="regDateStr" label="申请日期" min-width="100"></el-table-column>
      <el-table-column prop="tmPic" label="商标" min-width="100">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.tmPic" fit="fill"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="tmName" label="商标名称" min-width="100"></el-table-column>
      <el-table-column prop="regNo" label="注册号" min-width="100"></el-table-column>
      <el-table-column prop="intCls" label="国际分类" min-width="100"></el-table-column>
      <el-table-column prop="tmStatus" label="状态" min-width="100"></el-table-column>
    </el-table>
    <!--分页-->
    <div class="page_pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="initInfo.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="initInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="trademarksTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data(){
      return{
        initInfo:{
          companyId:'',
          pageNum:1,
          pageSize:10,
        },
        trademarksList:[],
        trademarksTotal:0,
      }
    },
    created(){
      this.initInfo.companyId = this.$route.query.companyId;
      this.getCompanyTrademark()
    },
    methods:{
      getCompanyTrademark(){
        this.requestApi.getCompanyTrademark(this.initInfo).then(res=>{
          this.trademarksList = res.data
          this.trademarksTotal = res.total
        })
      },
      handleSizeChange(val){
        this.initInfo.pageSize = val;
        this.getCompanyTrademark()
      },
      handleCurrentChange(val){
        this.initInfo.pageNum = val;
        this.getCompanyTrademark()
      }
    }
  }
</script>
<style scoped>
</style>
