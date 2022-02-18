<template>
  <div class="page_container">
    <!--v-if="hasPerm()"-->
    <h4 class="page_title">门店分布</h4>
    <div class="tableOpera">
      <el-button type="primary" @click="openDialog('add')">单条增加</el-button>
    </div>
    <el-table
      border style="width: 100%" stripe class="mt-20"
      ref="multipleTable"
      :data="storeList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="150">
        <template slot-scope="scope">{{(pageNum-1)*20+scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="省/直辖市"
        :render-header = "renderHeader"
      >
      </el-table-column>
      <el-table-column
        prop="shopCount"
        label="门店数量"
        show-overflow-tooltip
        :render-header = "renderHeader">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('修改品牌信息')" type="primary" plain @click="openDialog(scope.row,(pageNum-1)*20+scope.$index)">修改</el-button>
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
        :total="storeTotal">
      </el-pagination>
    </div>
    <!--门店信息修改弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="resetForm('editorStoreInfo')">
      <el-form :model="editorStoreInfo" ref="editorStoreInfo" :rules="ditorStoreRule">
        <el-form-item label="省/直辖市" :label-width="formLabelWidth" prop="name">
          <el-select v-model="editorStoreInfo.name" filterable placeholder="请选择" style="width: 100%;" >
            <el-option v-for="(item,index) in allCityList" :key="index" :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店数量" :label-width="formLabelWidth" prop="shopCount">
          <el-input v-model="editorStoreInfo.shopCount" autocomplete="off"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editorStoreInfo')">取 消</el-button>
        <el-button type="primary" @click="storeInfoSubmit('editorStoreInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        wikiBrandId:'',
        pageNum: 1,
        pageSize: 20,
        storeTotal: 0,
        allCityList: [],
        initStoreList:[],
        storeList: [],
        editorStoreInfo: {
          id:'',
          name: '',
          shopCount: 0
        },
        ditorStoreRule: {
          name: [{ required: true, message: '请选择省/直辖市', trigger: 'blur' }],
          shopCount: [{ required: true, message: '请填写门店数量', trigger: 'blur' }]
        },
        dialogTitle: '新增门店信息',
        dialogFormVisible: false,
        formLabelWidth: '100px'
      }
    },
    created() {
      this.wikiBrandId = this.$route.query.id
      this.getALlCity()
      this.getBrandDetail()
    },
    methods: {
      renderHeader(h,{column}){
        return h('div',{
          attrs:{
            class:'cell',
          },
          domProps:{
            innerHTML:'<span style="color:#f00;">*</span>'+column.label
          }
        })
      },
      getBrandDetail() {
        this.requestApi.getWikiBrandDetail({ id: this.wikiBrandId }).then(res => {
          if(res.data.regions != null){
            this.initStoreList = JSON.parse(res.data.regions);
            this.storeList = this.initStoreList.slice(0,this.pageSize)
            this.storeTotal = this.initStoreList.length;
          }
        })
      },
      getALlCity() {
        this.requestApi.getAllCityList().then(res => {
          this.allCityList = res.data;
        })
      },
      openDialog(data,_index) {
        this.editorStoreInfo.id = '';
        this.editorStoreInfo.shopCount = '';
        this.editorStoreInfo.name='';
        if (data == 'add') {
          this.dialogTitle = '新增门店信息'
        } else {
          this.dialogTitle = '编辑门店信息';
          this.editorStoreInfo.id = _index
          this.editorStoreInfo.name = data.name;
          this.editorStoreInfo.shopCount = data.shopCount;
        }
        this.dialogFormVisible = true
      },
      storeInfoSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let changeMsg = ''
            let isFlag = this.initStoreList.filter(item => {
              return item.name == this.editorStoreInfo.name;
            })
            if(this.dialogTitle.indexOf('编辑')!=-1){
              changeMsg = '编辑成功'
              this.initStoreList[this.editorStoreInfo.id].name = this.editorStoreInfo.name;
              this.initStoreList[this.editorStoreInfo.id].shopCount = this.editorStoreInfo.shopCount;
              if(isFlag.length>1){
                this.$message.error('该省/直辖市已存在，请确认');
                return false;
              }else{
                let  data ={};
                data.id = this.wikiBrandId;
                data.regions =JSON.stringify(this.initStoreList)
                this.requestApi.updateWikiBrandDetail(data).then(res =>{
                  this.$message({
                    message: changeMsg,
                    type: 'success'
                  });
                  this.getBrandDetail();
                  this.pageNum = 1;
                  this.pageSize = 20;
                  this.dialogFormVisible = false;
                })
              }
            }else if(this.dialogTitle.indexOf('新增')!=-1){
              changeMsg = '新增成功'
              delete this.editorStoreInfo.id;
              this.initStoreList.unshift(this.editorStoreInfo)
              if(isFlag.length>0){
                this.$message.error('该省/直辖市已存在，请确认');
                return false;
              }else{
                let  data ={};
                data.id = this.wikiBrandId;
                data.regions =JSON.stringify(this.initStoreList)
                this.requestApi.updateWikiBrandDetail(data).then(res =>{
                  this.$message({
                    message: changeMsg,
                    type: 'success'
                  });
                  this.getBrandDetail();
                  this.pageNum = 1;
                  this.pageSize = 20;
                  this.dialogFormVisible = false;
                })
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false
      },
      handleSelectionChange(val) {
        /*多选框预留*/
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageNum = 1;
        this.storeList = this.initStoreList.slice(0,val)
      },
      handleCurrentChange(val){
        this.pageNum = val;
        let showListIndex = this.pageSize*val ;
        this.storeList = this.initStoreList.slice(showListIndex-this.pageSize,showListIndex)
      },
    }
  }
</script>
<style scoped>
</style>
