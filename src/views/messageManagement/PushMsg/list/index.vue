<template>
  <div class="page_container">
    <h4 class="page_title p-r">
      PUSH推送消息
      <el-button v-if="hasPerm('新建推送消息')" type="primary" class="addPushMsg" @click="editorPushMsg('add')">新增消息推送</el-button>
      <el-button v-if="hasPerm('消息推送记录')" type="primary" class="msgHistory" @click="openHistory">消息发送记录</el-button>
    </h4>
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
    <el-table :data="pushMsglist" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass"
              class="mt-20">
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">
          {{(searchForm.pageNum-1)*searchForm.pageSize+1+scope.$index}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="消息标题" min-width="120"></el-table-column>
      <el-table-column prop="sendTime" label="发送时间" min-width="120"></el-table-column>
      <el-table-column prop="type" label="发送方式" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">手动</span>
          <span v-else-if="scope.row.type == 2">定时</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="info" plain @click="sendMsg(scope.$index,scope.row.id)" v-if="scope.row.type == 1 && hasPerm('发送消息')" :disabled="scope.row.state == 2">发送</el-button>
          <el-button type="primary" plain @click="editorPushMsg(scope.row.id)" v-if="hasPerm('修改推送消息')">修改</el-button>
          <el-button type="success" plain @click="openPreviewDialog(scope.row.id)">预览</el-button>
          <el-button type="danger" plain @click="delThisMsg(scope.row.id)" v-if="hasPerm('删除推送消息')">删除</el-button>
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
    <!--预览弹窗-->
    <el-dialog title="推送消息预览" :visible.sync="previewDialog" width="40%" class="previewDialog">
      <p><span>标题：</span><span>{{previewInfo.title}}</span></p>
      <p><span>内容：</span><span>{{previewInfo.content}}</span></p>
      <p><span>跳转类型：</span><span>{{previewInfo.skipType | getSkipType}}<i v-if="previewInfo.skipTargetName">&nbsp;--&nbsp;</i>{{previewInfo.skipTargetName}}</span></p>
      <p><span>URL地址：</span><span>{{previewInfo.extra}}</span></p>
      <p><span>发送方式：</span><span v-if="previewInfo.type == 1">手动</span><span v-else-if="previewInfo.type == 2">定时</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog :title="pushMsgDialogTitle" :visible.sync="pushMsgDialog" class="pushMsgDialog" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true"  @close="cancelEditorPushMsg('pushMsgInfo')">
      <el-form :model="pushMsgInfo" label-width="80px" ref="pushMsgInfo" :rules="pushRule">
        <el-form-item label="标题" prop="title">
          <el-input v-model="pushMsgInfo.title" placeholder="建议最长20个字符" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="pushMsgInfo.content" placeholder="建议最长20个字符" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型" prop="skipTargetId">
          <div class="compositeFormItem">
            <el-select v-model="pushMsgInfo.skipType" slot="prepend" placeholder="请选择" @change="pushMsgInfo.skipTargetId = ''">
              <el-option label="仅唤醒" value="1"></el-option>
              <el-option label="详情页" value="2"></el-option>
              <el-option label="资讯" value="3"></el-option>
              <el-option label="banner" value="4"></el-option>
            </el-select>
            <el-select v-model="pushMsgInfo.skipTargetId" placeholder="请选择" filterable clearable class="w100" :disabled="pushMsgInfo.skipType == 1 || pushMsgInfo.skipType == 4" >
              <el-option v-for="(item,index) in restaurants" :key="index" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="URL地址" prop="extra">
          <el-input v-model="pushMsgInfo.extra" :disabled="pushMsgInfo.skipType != 4"></el-input>
        </el-form-item>
        <el-form-item label="推送用户">
          <el-radio-group v-model="pushMsgInfo.groupingType">
            <el-radio label="1" value="1">全部</el-radio>
            <el-radio label="2" value="2">分群</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户分群" v-if="pushMsgInfo.groupingType == 2" prop="groupingId">
          <el-select v-model="pushMsgInfo.groupingId" placeholder="请选择" filterable clearable class="w100">
            <el-option v-for="(item,index) in userGroups" :label="item.groupingName" :value="item.groupingId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送方式">
          <el-radio-group v-model="pushMsgInfo.type" @change="changeType">
            <el-radio label="2">定时</el-radio>
            <el-radio label="1">手动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送时间" v-if="pushMsgInfo.type == 2" prop="startTime">
          <el-date-picker
            class="w100"
            v-model="pushMsgInfo.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="cancelEditorPushMsg('pushMsgInfo')">取 消</el-button>
         <el-button type="primary" @click="pushInfoSubmit('pushMsgInfo')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'index',
    data() {
      var checkJumpInfo = (rule, value, callback)=>{
        if(this.pushMsgInfo.skipType == 2 || this.pushMsgInfo.skipType == 3){
          if(value == ''){
            callback(new Error('请选择对应的内容'))
          }else {
            callback()
          }
        }else{
          callback()
        }
      };
      var checkUrl = (rule,value,callback)=>{
        if(this.pushMsgInfo.skipType == 4){
          if(value == ''){
            callback(new Error('请输入url地址'))
          }else {
            callback()
          }
        }else{
          callback()
        }
      };
      var checkUserGroup = (rule,value,callback)=>{
        if(this.pushMsgInfo.groupingType == 2){
          if(value == ''){
            callback(new Error('请选择对应的用户分群'))
          }else {
            callback()
          }
        }else{
          callback()
        }
      };
      var checkPushTime = (rule,value,callback)=>{
        if(this.pushMsgInfo.type == 2){
          if(value == ''){
            callback(new Error('请选择定时发送时间'))
          }else {
            callback()
          }
        }else{
          callback()
        }
      }
      return {
        restaurants: [],
        searchForm: {
          title: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 10,
        },
        jumpTypeList: [{
          id: 0,
          name: '仅唤醒'
        }],
        pushMsglist: [],
        listTotal: 100,
        previewDialog: false,
        previewInfo: {},
        pushMsgDialog: false,
        pushMsgDialogTitle: '',
        initPushMsgInfo:{
          title: '',
          content: '',
          skipType: '1',
          skipTargetId: '',
          extra: '',
          groupingType: '1',
          groupingId: '',
          type: '2',
          startTime: ''
        },
        pushMsgInfo: {
          title: '',
          content: '',
          skipType: '1',
          skipTargetId: '',
          extra: '',
          groupingType: '1',
          groupingId: '',
          type: '2',
          startTime: ''
        },
        pushRule: {
          title: [{ required: true, message: '请输入标题' }],
          content: [{ required: true, message: '请输入内容' }],
          skipTargetId: [{ validator: checkJumpInfo, trigger: 'blur' }],
          extra:[{validator:checkUrl,trigger:'blur'}],
          groupingId:[{validator:checkUserGroup,trigger:'blur'}],
          startTime:[{validator:checkPushTime,trigger:'blur'}]
        },
        infoNewInitList: [],
        brandInitList: []
      }
    },
    computed: {
      ...mapGetters([
        'infoNewList',
        'brandList'
      ])
    },
    created() {
      /*看点*/
      this.infoNewList.forEach(item => {
        let dataJson = {}
        dataJson.value = item.title
        dataJson.id = item.id
        this.infoNewInitList.push(dataJson)
      })
      /*品牌*/
      this.brandList.forEach(item => {
        let dataJson = {}
        dataJson.value = item.brandName
        dataJson.id = item.id
        this.brandInitList.push(dataJson)
      })
      /*获取列表*/
      this.getALLMsgList()
      /*获取用户分组*/
      this.getAllUserGroup()
    },
    watch: {
      'pushMsgInfo.skipType':function(newVal) {
        /*跳转类型*/
        if(newVal == 2){
          this.restaurants = this.brandInitList
        }else if(newVal == 3){
          this.restaurants = this.infoNewInitList
        }
      },
      'pushMsgInfo.groupingType':function(newVal) {
        if(newVal == 0){
          this.pushMsgInfo.groupingId = ''
        }
      }
    },
    methods: {
      getAllUserGroup(){
        this.requestApi.getUserGroups().then(res => {
          this.userGroups = res.data
        })
      },
      getALLMsgList(){
        this.requestApi.getALLPushMsgList(this.searchForm).then(res=>{
          this.pushMsglist = res.data;
          this.listTotal = res.total;
        })
      },
      searchConfirm() {
        if(this.searchForm.startTime != '' && this.searchForm.endTime != ''){
          if(this.searchForm.startTime > this.searchForm.endTime){
            this.$message.error('开始时间不能大于结束时间');
            return false;
          }
        };
        this.getALLMsgList();
      },
      searchReset() {
        let initSearch = {
          title: '',
          startTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 10,
        };
        this.searchForm = initSearch;
        this.getALLMsgList();
      },
      openPreviewDialog(data) {
        this.previewDialog = true
        this.requestApi.getPushMsgDetail({id:data}).then(res=>{
          this.previewInfo = res.data
        })
      },
      changeType(){
        if(this.pushMsgInfo.type == 1){
          this.pushMsgInfo.startTime = ''
        }
      },
      editorPushMsg(data) {
        if (data == 'add') {
          this.pushMsgDialogTitle = '新增消息推送';
          this.pushMsgInfo = this.initPushMsgInfo;
        } else {
          this.pushMsgDialogTitle = '修改消息推送';
          this.requestApi.getPushMsgDetail({id:data}).then(res=>{
            this.pushMsgInfo = res.data;
            this.pushMsgInfo.skipType = this.pushMsgInfo.skipType.toString();
            this.pushMsgInfo.groupingType = this.pushMsgInfo.groupingType.toString()
            this.pushMsgInfo.type = this.pushMsgInfo.type.toString()
          })
        }
        this.pushMsgDialog = true
      },
      cancelEditorPushMsg(formName) {
        this.pushMsgDialog = false;
        this.pushMsgInfo = this.initPushMsgInfo;
        this.$refs[formName].clearValidate()
      },
      /*手动发送消息*/
      sendMsg(_index,data){
        this.$confirm('确认是否发送此条消息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.manualSendPushMsg({id:data}).then(res=>{
            this.$message({
              type: 'success',
              message: '发送成功!'
            });
            this.pushMsglist[_index].state = 2;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发送'
          });
        });

      },
      pushInfoSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let pattern = new RegExp('^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$');
            if(this.pushMsgInfo.pushType == 1){
              if (!pattern.test(this.pushMsgInfo.title)) {
                this.$message.error('标题必须是20字以内用汉字、字母、数字、下划线组成的');
                return false;
              }
            }
            if(this.pushMsgInfo.skipType == 2 || this.pushMsgInfo.skipType == 3){
              let _data = this.restaurants.find(item=>{
                return item.id == this.pushMsgInfo.skipTargetId;
              })
              this.pushMsgInfo.skipTargetName = _data.value;
            }
            if(this.pushMsgInfo.groupingType == 2){
              let _data = this.userGroups.find(item=>{
                return item.groupingId == this.pushMsgInfo.groupingId
              })
              this.pushMsgInfo.groupingName = _data.groupingName
            }
            if(this.pushMsgDialogTitle == '新增消息推送'){
              this.requestApi.addPushMsg(this.pushMsgInfo).then(res => {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.pushMsgDialog = false;
                this.pageNum = 1;
                this.getALLMsgList();
              })
            }else{
              this.requestApi.updatePushMsg(this.pushMsgInfo).then(res => {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.pushMsgDialog = false;
                this.getALLMsgList();
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      delThisMsg(data){
        this.$confirm('确认是否删除此品类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.delPsuhMsg({id:data}).then(res =>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getALLMsgList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.getALLMsgList();
      },
      handleCurrentChange(val) {
        this.searchForm.pageNum = val;
        this.getALLMsgList();
      },
      openHistory(){
        this.$router.push({
          path:'historyList'
        })
      }
    }
  }
</script>
<style>
  .w100 {
    width: 100% !important;
  }
  .pushMsgDialog textarea {
    resize: none;
  }
  .pushMsgDialog .compositeFormItem{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .pushMsgDialog .compositeFormItem .el-input__inner{
    border: none;
    border-radius: 0;
  }
  .pushMsgDialog .compositeFormItem .el-select .el-input__inner{
    border-right: 1px solid #DCDFE6;;
  }
</style>
<style lang="scss" scoped>
  .addPushMsg {
    position: absolute;
    right: 140px;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .msgHistory {
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .previewDialog {
    p {
      margin-bottom: 10px;
      width: 100%;
      line-height: 24px;
      display: flex;
      justify-content: start;
      align-items: start;
      span {
        &:first-child {
          padding-right: 8px;
          width: 20%;
          min-width: 100px;
          text-align: right;
          font-weight: 600;
        }
        &:last-child {
          flex: 1;
        }
      }
    }
  }
</style>
