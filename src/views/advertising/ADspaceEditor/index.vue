<template>
  <div class="page_container ADspaceEditor">
    <h4 class="page_title">{{pageTitle}}</h4>
    <el-form :model="ADInfoForm" ref="ADInfoForm" label-width="100px" :rules="ADFormRules">
      <el-form-item label="广告位名称" prop="name">
        <el-input v-model="ADInfoForm.name" clearable placeholder="请使用中文"></el-input>
      </el-form-item>
      <el-form-item label="终端" prop="terminal">
        <el-select v-model="ADInfoForm.terminal" placeholder="请选择终端" clearable>
          <el-option v-for="item in terminalList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面名称" prop="pageName">
        <el-select v-model="ADInfoForm.pageName" placeholder="请选择页面名称" clearable>
          <el-option v-for="(pageNameItem,index) in pageNameList" :key="index" :label="pageNameItem"
                     :value="pageNameItem"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面接口" prop="type">
        <el-select v-model="ADInfoForm.type" placeholder="请选择页面接口" clearable>
          <el-option v-for="(item,index) in ApiTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签类别" v-if="ADInfoForm.type == 8" prop="typeParam">
        <el-radio-group v-model="ADInfoForm.typeParam">
          <el-radio v-for="(item,index) in typeParamList" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联内容" style="text-align: right;">
        <div class="formtable">
          <div class="formtableItem">
            <p class="itemTab">跳转类型</p>
            <p class="itemTab">展示位置</p>
            <p class="itemTab">广告图片</p>
            <p class="itemTab">展示内容</p>
            <p class="itemTab"></p>
          </div>
          <div class="moreRulesIn formtableItem" v-for="(item, index) in ADInfoForm.advertItems" :key="item.key">
            <el-form-item class="itemTab" :prop="'advertItems.'+ index +'.jumpType'"
                          :rules="[{required: true, message: '请添加展示内容'}]">
              <el-select v-model="item.jumpType" filterable placeholder="请选择跳转类型">
                <el-option v-for="(jumpTypeItem,index) in jumpTypeList" :key="index" :label="jumpTypeItem.name"
                           :value="jumpTypeItem.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="itemTab" :prop="'advertItems.' + index +'.sort'"
                          :rules="[{required: true, message: '请添加不小于0的整数'}]">
              <el-input v-model="item.sort" type="number" autocomplete="off"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            </el-form-item>
            <el-form-item class="itemTab">
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="(value)=> uploader(index, value)"
                :before-remove="(file, fileList) => {beforeRemove(file, fileList, index)}"
                :on-preview="handlePreview"
                :on-change="(file, fileList) => {handleChange(file, fileList,index)}"
                :limit="1"
                :file-list=" item.coverPic"
                list-type="picture-card">
                <el-button type="primary" v-if="item.coverPic.length == 0">点击上传</el-button>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item class="itemTab" :prop="'advertItems.'+ index +'.content'"
                          :rules="[{required: true, message: '请添加展示内容'}]">
              <el-input v-model="item.content" type="text" placeholder="请输入关联的url"
                        v-if="item.jumpType == 1"></el-input>
              <el-select v-model="item.content" filterable placeholder="请选择关联品牌"
                         @change="checkinfoIsSelect(item.content,index)" v-if="item.jumpType == 2">
                <el-option
                  v-for="item in searchBrandList"
                  :key="item.id"
                  :label="item.brandName"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="item.content" filterable placeholder="请选择关联看点"
                         @change="checkinfoIsSelect(item.content,index)" v-if="item.jumpType == 3">
                <el-option
                  v-for="item in searchWatchList"
                  :key="item.infoId"
                  :label="item.title"
                  :value="item.infoId">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="itemTab"><i class="el-icon-delete" @click="deleteRules(item, index)"></i></div>
          </div>
        </div>
        <div class="flex_between" style="margin-top: 20px">
          <p class="tipMsg"><span>*</span>提示：展示位置请填写从0开始的整数</p>
          <el-button type="primary" @click="addTableList" >添加</el-button>
        </div>

      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-left: 100px;margin-top: 50px" @click.native.prevent="formSubmit('ADInfoForm')">保存
    </el-button>
  </div>
</template>
<script>
  import { ossupload } from '@/api/ossUploadFile'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ADspaceEditor',
    data() {
      var checkADname = (rule, value, callback) => {
        let pattern = new RegExp('[\u4E00-\u9FA5]+')
        if (!pattern.test(value)) {
          callback(new Error('请输入中文'))
        } else if (value.length > 15) {
          callback(new Error('请输入15字以内'))
        } else {
          callback()
        }
      }
      var  checkTypeParam = (rule, value, callback) =>{
        let _type = this.ADInfoForm.type
        console.log(_type)
        if(_type == 8){
          if(value == ''){
            callback(new Error('标签类别不能为空'))
          }else {
            callback()
          }
        }
      }
      return {
        pageTitle: '',
        searchBrandList: [],
        searchWatchList: [],
        typeParamList: [],
        terminalList: [{
          id: 1,
          name: '移动端'
        }, {
          id: 2,
          name: 'PC'
        }],
        ApiTypeList: [{
          id: 8,
          name: '首页'
        }, {
          id: 1,
          name: '首页banner '
        }, {
          id: 2,
          name: '筛选品类接口'
        }, {
          id: 3,
          name: '看点顶部banner'
        }, {
          id: 4,
          name: '个人中心banner'
        }, {
          id: 5,
          name: '搜索页-猜你喜欢'
        }, {
          id: 9,
          name: '搜索页-大家都在搜'
        }, {
          id: 6,
          name: '无忧退款'
        }, {
          id: 7,
          name: '限时立减'
        }],
        jumpTypeList: [{
          id: 1,
          name: 'URL'
        }, {
          id: 2,
          name: '品牌详情页'
        }, {
          id: 3,
          name: '看点'
        }],
        pageNameList: ['首页', '分类页', '品类页', '活动页', '搜索页', '看点列表页', '个人中心页'],
        ADInfoForm: {
          name: '',
          terminal: '',
          pageName: '',
          type: '',
          typeParam: '',
          status: 0,
          advertItems: [{
            jumpType: '',
            sort: '',
            coverPic: [],
            content: ''
          }]
        },
        ADFormRules: {
          name: [
            { required: true, message: '广告位名称不能为空' },
            { validator: checkADname, trigger: 'blur' }
          ],
          terminal: [
            { required: true, message: '终端不能为空' }
          ],
          pageName: [
            { required: true, message: '页面名称不能为空' }
          ],
          type: [
            { required: true, message: '页面接口不能为空' }
          ],
          typeParam: [
            { validator: checkTypeParam, trigger: 'blur' }
          ]
        },
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        file: ''
      }
    },
    computed: {
      ...mapGetters([
        'watchList',
        'brandList'
      ])
    },
    created() {
      this.searchBrandList = this.brandList;
      this.searchWatchList = this.watchList;
      this.getAllTagList()
      if (this.$route.params.id == 'add') {
        this.pageTitle = '新增广告位'
      } else {
        this.pageTitle = '编辑广告位'
        this.getThisADinfo(this.$route.params.id)
      }
    },
    methods: {
      checkinfoIsSelect(msg, _index) {
        /*检测是否数据已被选择过*/
        this.ADInfoForm.advertItems.forEach((item, index) => {
          if (index != _index) {
            if (item.content == msg) {
              this.ADInfoForm.advertItems[_index].content = ''
              this.$message.error('该条内容已被选择，请重新选择')
            }
          }
        })
      },
      getAllTagList() {
        this.requestApi.getHomeTag().then(res => {
          if (res.code == 0) {
            this.typeParamList = res.data
          }
        })
      },
      getThisADinfo(_ADid) {
        this.requestApi.getAdvertInfo({ id: _ADid }).then(res => {
          if (res.code == 0) {
            this.ADInfoForm.name = res.data.name
            this.ADInfoForm.terminal = res.data.terminal
            this.ADInfoForm.pageName = res.data.pageName
            this.ADInfoForm.type = res.data.type
            this.ADInfoForm.typeParam = res.data.typeParam
            this.ADInfoForm.status = res.data.status
            this.ADInfoForm.advertItems = res.data.advertItems
            this.ADInfoForm.advertItems.forEach((item, index) => {
              if(item.jumpType == 3){
                this.loading = true;
              }
              if (item.coverPic) {
                let pushInfo = {}
                pushInfo.url = item.coverPic
                let setPIC = []
                setPIC.push(pushInfo)
                item.coverPic = setPIC
              } else {
                item.coverPic = []
              }
            })
          }
        })
      },
      uploader(_index, param) {
        /*封装oss上传*/
        ossupload.ossuploadFile(_index, param.file,'advert').then(pictureUrl => {
          let pushInfo = {}
          pushInfo.url = pictureUrl
          this.ADInfoForm.advertItems[_index].coverPic.push(pushInfo)
        })
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleChange(file, fileList, _index) {
      },
      beforeRemove(file, fileList, _index) {
        let _this = this
        setTimeout(function() {
          _this.ADInfoForm.advertItems[_index].coverPic = []
        }, 400)
      },
      addTableList() {
        this.ADInfoForm.advertItems.push({
          jumpType: '',
          sort: '',
          coverPic: [],
          content: ''
        })
      },
      deleteRules(item, index) {
        if (this.ADInfoForm.advertItems.length == 1) {
          this.$message({
            type: 'warning',
            message: '至少保留一项'
          })
        } else {
          this.index = this.ADInfoForm.advertItems.indexOf(item)
          if (index !== -1) {
            this.ADInfoForm.advertItems.splice(index, 1)
          }
        }
      },
      formSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let advertAddInfo = JSON.parse(JSON.stringify(this.ADInfoForm))
            advertAddInfo.advertItems.forEach((item, index) => {
              if (item.coverPic == '') {
                item.coverPic = ''
              } else if (item.coverPic[0]) {
                item.coverPic = item.coverPic[0].url
              }
            })
            if (this.pageTitle == '新增广告位') {
              this.requestApi.advertAdd(advertAddInfo).then(res => {
                if (res.code == 0) {
                  this.modelSuccesssFun('添加成功')
                } else {
                  this.$message(res.msg)
                }
              })
            } else if (this.pageTitle == '编辑广告位') {
              advertAddInfo.id = this.$route.params.id
              this.requestApi.updateAdvert(advertAddInfo).then(res => {
                if (res.code == 0) {
                  this.modelSuccesssFun('编辑成功')
                } else {
                  this.$message(res.msg)
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      modelSuccesssFun(successMsg) {
        let _this = this
        _this.$alert(successMsg, '通知', {
          confirmButtonText: '确定',
          callback: action => {
            _this.$router.push({
              path: `/advertising/brandADspace`
            })
          }
        })
      }
    }
  }
</script>
<style>
  .ADspaceEditor input::-webkit-outer-spin-button,
  .ADspaceEditor input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .ADspaceEditor input[type="number"] {
    -moz-appearance: textfield;
  }
  .ADspaceEditor .el-form-item__content {
    width: 50%;
  }
  .ADspaceEditor .formtable .el-form-item__content {
    line-height: 0;
  }
  .ADspaceEditor .el-select {
    width: 100%;
  }
  .ADspaceEditor .itemTab .el-form-item__content {
    width: 80%;
    text-align: center;
    margin: 0 auto;
  }
  .ADspaceEditor .el-upload--picture-card {
    height: auto;
    width: auto;
    line-height: 0;
    border: none;
  }
  .ADspaceEditor .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  .ADspaceEditor .el-upload-list--picture-card .el-upload-list__item {
    margin: 0;
  }
  @media screen and (max-width: 1400px) {
    .ADspaceEditor .el-form-item__content {
      width:auto;
    }
  }
</style>
<style lang="scss" scoped>
  .formtable {
    width: 100%;
    border: 1px solid rgba(64, 158, 255, .5);
    .formtableItem {
      &:first-child {
        height: 60px;
        line-height: 60px;
        margin-bottom: 0;
        background: rgba(64, 158, 255, .7);
        border: none;
        color: #fff;
      }
      border-top: 1px solid rgba(64, 158, 255, .5);
      padding: 18px 0;
      display: flex;
      justify-content: start;
      align-items: center;
      .itemTab {
        text-align: left;
        text-align: center;
        &:nth-of-type(1) {
          width: 25%;
        }
        &:nth-of-type(2) {
          width: 18%;
        }
        &:nth-of-type(3) {
          width: 20%;
        }
        &:nth-of-type(4) {
          width: 25%;
        }
        &:nth-of-type(5) {
          width: 2%;
        }
      }
    }
  }
  .tipMsg{
    font-size: 14px;
    color: #666;
    span{
      color: #f00;
    }
  }
</style>
