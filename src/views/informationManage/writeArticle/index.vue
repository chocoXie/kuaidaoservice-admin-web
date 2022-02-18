<template>
  <div class="page_container logPage">
    <h4 class="page_title">{{pageTitle}}</h4>

    <el-form :model="articleForm"
             :rules="rules"
             ref="articleForm" class="demo-articleForm mt-20" label-width="100px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示分类" prop="coverType">
            <el-radio-group v-model="articleForm.coverType" @change="coverTypeChange">
              <el-radio :label="0" :value="0">默认图</el-radio>
              <el-radio :label="1" :value="1">单小图</el-radio>
              <el-radio :label="2" :value="2">三小图</el-radio>
              <el-radio :label="3" :value="3">单大图</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="自定义属性">
            <!--<el-radio-group v-model="articleForm.customProperties">-->
            <!--<el-radio label="1" :value="1" :disabled="propertyStatus">头条</el-radio>-->
            <!--<el-radio label="2" :value="2">推荐</el-radio>-->
            <!--<el-radio label="3" :value="3">置顶</el-radio>-->
            <!--</el-radio-group>-->
            <el-checkbox-group  v-model="checkList1" :max="1">
              <el-checkbox label="1" :value="1" :disabled="propertyStatus">头条</el-checkbox>
              <el-checkbox label="2" :value="2">推荐</el-checkbox>
              <el-checkbox label="3" :value="3">置顶</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="*初始阅读量">
            <el-input v-model="articleForm.initialReading"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-form-item label="关键词标签">-->
      <!--<el-tag-->
      <!--:key="tag"-->
      <!--v-for="tag in dynamicTags"-->
      <!--closable-->
      <!--:disable-transitions="false"-->
      <!--@close="handleClose(tag)">-->
      <!--{{tag}}-->
      <!--</el-tag>-->
      <!--<el-input-->
      <!--class="input-new-tag"-->
      <!--v-if="inputVisible"-->
      <!--v-model="inputValue"-->
      <!--ref="saveTagInput"-->
      <!--size="small"-->
      <!--@keyup.enter.native="handleInputConfirm"-->
      <!--@blur="handleInputConfirm"-->
      <!--&gt;-->
      <!--</el-input>-->
      <!--<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>-->
      <!--</el-form-item>-->
      <!--:before-remove="(file, fileList) => {beforeRemove(file, fileList, index)}"-->
      <!--:on-change="(file, fileList) => {handleChange(file, fileList,index)}"-->
      <!--          -->
      <el-form-item label="封面图">
        <el-upload
          class="upload-demo"
          action="#"
          :before-upload="(file)=> beforeUpload(file)"
          :on-remove="(file, fileList) => {handleRemove(file, fileList)}"
          :http-request="(value)=> uploader(value)"
          :on-preview="handlePreview"
          :limit="imglimit"
          multiple
          :file-list="fileList"
          list-type="picture-card">
          <el-button type="primary" >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创作者" prop="creatorId">
            <el-select v-model="articleForm.creatorId" placeholder="请选择创作者" size="medium" style="width: 100%!important">
              <el-option v-for="(item) in creatorList" :key="item.id" :label="item.creatorName" :value="item.id">{{item.creatorName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者">
            <el-input v-model="articleForm.author" placeholder="请输入作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="*编辑" prop="editor">
            <el-input :value="userinfo.userName" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="归属品牌">
            <el-select v-model="articleForm.relationBrand" filterable placeholder="请选择归属品牌" size="medium" style="width: 100%!important">
              <el-option v-for="(item) in brandList" :key="item.id" :label="item.brandName" :value="item.id">{{item.brandName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布状态" prop="publishStatus">
            <el-select v-model="articleForm.publishStatus" placeholder="请选择发布状态" style="width: 100%!important">
              <el-option label="发布" :value="1">发布</el-option>
              <el-option label="隐藏" :value="2">隐藏</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="关键词" prop="keyWord">
        <el-input v-model="articleForm.keyWord" placeholder="请输入关键词"></el-input>
        <span>(每个关键词请使用","英文逗号进行分割)</span>
      </el-form-item>
      <el-form-item label="内容描述" prop="contentDescription">
        <el-input
          type="textarea"
          prop="contentDescription"
          :autosize="{ minRows: 1, maxRows: 4}"
          placeholder="请输入内容"
          v-model="articleForm.contentDescription">
        </el-input>
      </el-form-item>
      <el-form-item label="内容正文" prop="content">
        <tinymce-editor v-model="articleForm.content" @onClick="onClick" ref="editor"></tinymce-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('articleForm')">立即发布</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { ossupload } from '@/api/ossUploadFile';
  import TinymceEditor from '@/components/tinymceEditor'
  export default {
    name: 'writeArticle',
    components: {
      TinymceEditor
    },
    computed: {
      ...mapGetters([
        'userinfo'
      ]),
    },
    data(){
      var checkKeyWord = (rule, value, callback) => {
        if(value){
          if(value.indexOf("，") != -1){
            callback(new Error('关键词之间用英文逗号分割'));
          }else{
            callback()
          }
        }else{
          callback()
        }
      };
      return{
        articleForm: {
          title:'',
          coverType: '',
          customProperties: '',
          initialReading: parseInt(Math.random()*(20000-5000)+5000,10),
          creatorId: '',
          author: '',
          editor:'',
          relationBrand: '',
          publishStatus: '',
          contentDescription:'',
          keyWord:'',
          content:'',
          coverUrl1:'',
          coverUrl2:'',
          coverUrl3:'',
          contentType:1,
          id:''
        },
        tips:'只能上传jpg/png文件，且不超过2M',
        checkList1:[],
        brandList:[],
        propertyStatus:false,
        imglimit:3,
        dialogImageUrl:'',
        dialogVisible:false,
        Max_Size:2000,
        width:0,
        height:0,
        isSize:false,
        isWidth:false,
        pageTitle:'写文章',
        creatorList:[],
        fileList: [],
        imgUrl:[],
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 5, max: 30, message: '长度在 5 到 30 个字之间', trigger: 'blur' }
          ],
          coverType: [
            { required: true, message: '请选择显示分类', trigger: 'change' }
          ],
          creatorId:[
            { required: true, message: '请选择创作者', trigger: 'change' }
          ],
          publishStatus:[
            {required: true, message: '请选择发布状态', trigger: 'change' }
          ],
          keyWord:[
            {validator: checkKeyWord,  trigger: 'change' }
          ],
          contentDescription: [
            { required: true, message: '请输入内容的总结描述', trigger: 'blur' },
            { min: 30,max:200,message: '字数在30-200字之间', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
          ],
        },
        msg: '',
      }
    },
    created() {
      // 获取创作者列表
      this.getCreatorList({
        pageNum:1,
        pageSize:10000,
      });
      if (this.$route.params.id) {
        this.pageTitle = '编辑文章';
        this.getArticleinfo(this.$route.params.id)
      } else {
        this.pageTitle = '写文章';
      }

      this.getBrandList()
    },
    methods:{
      // 获取创作者列表
      getCreatorList(data={}){
        this.requestApi.getCreatorList(data).then(res => {
          if (res.code == 0) {
            this.creatorList = res.data;
          }
        })
      },
      // 获取文章详情
      getArticleinfo(id) {
        this.requestApi.getArticleinfo({ id: id}).then(res => {
          if (res.code == 0) {
            this.articleForm = res.data;
            if(this.articleForm.customProperties){
              this.checkList1 = this.articleForm.customProperties.split(',')
            }else{
              this.checkList1=[];
            }
            this.fileList = [];
            if(this.articleForm.coverUrl1){
              let obj = {};
              obj.url = this.articleForm.coverUrl1;
              this.fileList.push(obj);
            }
            if(this.articleForm.coverUrl2){
              let obj = {};
              obj.url = this.articleForm.coverUrl2;
              this.fileList.push(obj);
            }
            if(this.articleForm.coverUrl3){
              let obj = {};
              obj.url = this.articleForm.coverUrl3;
              this.fileList.push(obj);
            }
            if(this.articleForm.coverType==0){
              this.imglimit = 3;
              this.width = 0;
              this.height= 0;
              this.tips = "只能上传jpg/png文件，且不超过2M"
            }else if(this.articleForm.coverType == 1){
              this.imglimit = 1;
              this.width = 220;
              this.height= 146;
              this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：220px * 146px"
            }else if(this.articleForm.coverType == 2){
              this.imglimit = 3;
              this.width = 220;
              this.height= 146;
              this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：220px * 146px";
            }else{
              this.imglimit = 1;
              this.width = 686;
              this.height= 380;
              this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：686px * 380px"
            }
            // this.fileList.each((index,item)=>{
            //   item.width = this.width;
            //   item.height = this.height;
            // })
            for(var i in this.fileList){
              this.fileList[i].width = this.width;
              this.fileList[i].height = this.height;
            }
          }
        })
      },
      // 获取关联品牌
      getBrandList(){
        this.requestApi.getBrandList().then(res => {
          if (res.code == 0) {
            this.brandList = res.data;
          }
        })
      },
      //改变显示分类更改封面图限制数量
      coverTypeChange(val){
        this.articleForm.coverType = val;
        if(val==0){
          this.imglimit = 3;
          this.width = 0;
          this.height= 0;
          this.propertyStatus = false;
          this.tips = "只能上传jpg/png文件，且不超过2M"
        }else if(val == 1){
          this.imglimit = 1;
          this.width = 220;
          this.height= 146;
          this.propertyStatus = true;
          this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：220px * 146px"
        }else if(val == 2){
          this.imglimit = 3;
          this.width = 220;
          this.height= 146;
          this.propertyStatus = true;
          this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：220px * 146px";
        }else{
          this.imglimit = 1;
          this.width = 686;
          this.height= 380;
          this.propertyStatus = false;
          this.tips = "只能上传jpg/png文件，且不超过2M,尺寸为：686px * 380px"
        }
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            if(this.checkList1.length>0){
              this.articleForm.customProperties = this.checkList1.toString();
            }
            if(this.articleForm.coverType==2){
              if(this.fileList.length != this.imglimit){
                this.$message({
                  message: '请传入三张封面图',
                  type: 'warning'
                });
                return false;
              }
            }
            if(this.articleForm.coverType==1 || this.articleForm.coverType==3 ){
              if(this.fileList.length != this.imglimit) {
                this.$message({
                  message: '请传入一张封面图',
                  type: 'warning'
                });
                return false;
              }
            }
            if(this.articleForm.coverType!=0 && this.fileList.length>0 && this.fileList[0].width != this.width) {
              this.$message({
                message: '上传的图片尺寸不符合要求，请重新上传',
                type: 'warning'
              });
              return false;
            }
            let articleForm = JSON.parse(JSON.stringify(this.articleForm));
            if (this.pageTitle == '写文章') {
              // 提交文章
              this.requestApi.addInformation(articleForm).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: '提交成功！',
                    type: 'success'
                  });
                  this.$refs[formName].resetFields();
                  this.$router.push({
                    path: `/informationManage/list`
                  });
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  });
                }
              })
            } else{
              // 修改文章
              this.requestApi.editInformation(articleForm).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: '修改成功！',
                    type: 'success'
                  });
                  this.$refs[formName].resetFields();
                  this.$router.push({
                    path: `/informationManage/list`
                  });
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  });
                }
              })
            }
          }else{
            this.$message({
              message: "校验未通过",
              type: 'warning'
            });
            return false;
          }
        });
      },

      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      beforeUpload(file){
        var _this = this;
        if(this.articleForm.coverType===""){
          this.$message.error("请先选择显示分类！");
          return false
        }else{
          return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(event) {
              var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
              const extension = testmsg === 'jpg';
              const extension2 = testmsg === 'png';
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!extension && !extension2) {
                _this.$message.error("上传文件只能是 jpg、png格式!");
                reject()
              }
              if (!isLt2M) {
                _this.$message.error("上传文件大小不能超过 2M!");
                reject()
              }
              if(_this.articleForm.coverType!==0){
              var image = new Image();
              image.onload = function() {
                var width = this.width;
                var height = this.height;
                if (width > _this.width || width < _this.width) {
                  _this.$message.error(_this.tips);
                  reject()
                } else if (height > _this.height || height < _this.height) {
                  _this.$message.error(_this.tips);
                  reject()
                } else {
                  resolve()
                }
              };
                image.src = event.target.result
              }else{
                resolve()
              }

            };
            reader.readAsDataURL(file)
          })
        }

        // return extension || extension2 && isLt2M
      },
      uploader(param) {
        ossupload.ossuploadFile("",param.file,'information').then(pictureUrl => {
          let pushInfo = {};
          pushInfo.url = pictureUrl;
          pushInfo.width = this.width;
          pushInfo.height = this.height;
          this.fileList.push(pushInfo);
          this.imgUrl.push(pictureUrl);
          const obj = {};
          for(var i=1;i<=3;i++){
            obj['coverUrl'+i] ="";
          }
          var k = 0;
          for(i in this.fileList){
            k++;
            obj['coverUrl'+k] = this.fileList[i].url;
          }
          this.articleForm = Object.assign(this.articleForm,obj);
          // [this.articleForm.coverUrl1,this.articleForm.coverUrl2,this.articleForm.coverUrl3] = this.imgUrl;
        })
      },

      handleRemove(file, fileList) {
        this.fileList = fileList;
        const obj = {};
        for(var i=1;i<=3;i++){
          obj['coverUrl'+i] ="";
        }
        var k = 0;
        for(i in fileList){
          k++;
          obj['coverUrl'+k] = fileList[i].url;
        }
        this.articleForm = Object.assign(this.articleForm,obj);
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true
      },
      onClick(e, editor) {
        // console.log(e, editor)
      },
      getmsg(){
        // console.log(this.msg)
      }

    }
  }
</script>
<style>
  .el-tag,.el-tag + .el-tag {
    margin-right: 10px!important;
  }
  .button-new-tag {
    margin-right: 10px!important;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-right: 10px!important;
    vertical-align: bottom;
  }
  .tox-tinymce{
    height: 800px!important;
  }
</style>
