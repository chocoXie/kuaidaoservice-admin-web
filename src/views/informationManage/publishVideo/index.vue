<template>
  <div class="page_container logPage">
    <h4 class="page_title">{{pageTitle}}</h4>
    <el-form :model="videoForm" :rules="rules" ref="videoForm" class="demo-videoForm mt-20" label-width="100px" size="small">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="videoForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="自定义属性">
            <el-checkbox-group v-model="checkList1" :max="1">
              <el-checkbox label="1" :value="1">头条</el-checkbox>
              <el-checkbox label="2" :value="2">推荐</el-checkbox>
              <el-checkbox label="3" :value="3">置顶</el-checkbox>
            </el-checkbox-group>
            <!--<el-radio-group v-model="videoForm.customProperties">-->
              <!--<el-radio label="1" :value="1">头条</el-radio>-->
              <!--<el-radio label="2" :value="2">推荐</el-radio>-->
              <!--<el-radio label="3" :value="3">置顶</el-radio>-->
            <!--</el-radio-group>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="初始阅读量">
            <el-input v-model="videoForm.initialReading"></el-input>
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
      <el-form-item label="封面图" prop="coverUrl1">
        <el-upload
          class="avatar-uploader1"
          :on-remove="handleRemove"
          action="#"
          :http-request="(value)=> uploader(value)"
          :show-file-list="false"
          v-model="videoForm.coverUrl1"
          :before-upload="(file)=>beforeAvatarUpload(file)">
          <img v-if="videoForm.coverUrl1" :src="videoForm.coverUrl1" class="avatar" style="width: 343px!important;height: 190px!important;">
          <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 343px!important;height: 190px!important;line-height: 190px!important;"></i>
          <span slot="tip" class="el-upload__tip">(只能上传1张，尺寸686px*380px;格式为jpg/png文件，大小不超过2M)</span>
        </el-upload>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创作者" prop="creatorId">
            <el-select v-model="videoForm.creatorId" placeholder="请选择创作者" size="medium" style="width: 100%!important">
              <el-option v-for="(item) in creatorList" :key="item.id" :label="item.creatorName" :value="item.id">{{item.creatorName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者">
            <el-input v-model="videoForm.author" placeholder="请输入作者"></el-input>
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
            <el-select v-model="videoForm.relationBrand" placeholder="请选择归属品牌"  filterable size="medium" style="width: 100%!important">
              <el-option v-for="(item) in brandList" :key="item.id" :label="item.brandName" :value="item.id">{{item.brandName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发布状态" prop="publishStatus">
            <el-select v-model="videoForm.publishStatus" placeholder="请选择发布状态" style="width: 100%!important">
              <el-option label="发布" :value="1">发布</el-option>
              <el-option label="隐藏" :value="2">隐藏</el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item label="关键词" prop="keyWord">
        <el-input v-model="videoForm.keyWord" placeholder="请输入关键词"></el-input>
        <span>(每个关键词请使用","英文逗号进行分割)</span>
      </el-form-item>
      <el-form-item label="视频描述" prop="contentDescription">
        <el-input
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4}"
          placeholder="请输入内容的总结描述"
          v-model="videoForm.contentDescription">
        </el-input>
      </el-form-item>
      <el-form-item label="上传视频" prop="videoUrl">
        <video :src="videoForm.videoUrl" class="video" v-if="videoForm.videoUrl" controls></video>
        <el-upload
          class="avatar-uploader2"
          action="#"
          :http-request="(value)=> uploaderVideo(value)"
          :on-error="handleVideoError"
          :before-upload="beforeUploadVideo"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
          <el-button type="primary" >上传视频</el-button>
          <div v-show="videoFlag">上传中</div>
          <span v-if="videoErrorTip">(视频上传失败，请重试)</span>

          <!--:on-progress="uploadVideoProcess"-->
          <!--<i v-else-if="videoForm.showVideoPath =='' && !videoFlag"-->
             <!--class="el-icon-plus avatar-uploader-icon"></i>-->
        </el-upload>

        <!--<el-progress  v-if="videoFlag" :text-inside="true" :stroke-width="24" :percentage="videoUploadPercent" status="success" class="progress"></el-progress>-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('videoForm')">立即发布</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { ossupload } from '@/api/ossUploadFile';
  import TinymceEditor from '@/components/tinymceEditor'
  export default {
    name: 'publishVideo',
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
        videoForm: {
          initialReading: parseInt(Math.random()*(20000-5000)+5000,10),
          contentType:2,
          title:'',
          delivery: false,
          customProperties:'',
          creatorId: '',
          relationBrand: '',
          publishStatus: '',
          author:'',
          editor:'',
          keyWord:'',
          videoUrl:'',
          contentDescription:'',
          coverUrl1:''
        },
        videoErrorTip:false,
        videoFlag:false,
        brandList:[],
        checkList1:[],
        pageTitle:'发视频',
        creatorList:[{id:'1',creatorName:'创作者一'},{id:'2',creatorName:'创作者er'}],
        // fileList: [],
        imgList:[],
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        rules: {
          title: [
            { required: true, message: '请输入视频标题', trigger: 'blur' },
            { min: 5, max: 30, message: '长度在 5 到 30 个字之间', trigger: 'blur' }
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
          coverUrl1: [
            { required: true, message: '请上传封面', trigger: 'change' },
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
        this.getArticleinfo(this.$route.params.id)
        this.pageTitle = '编辑视频';

      } else {
         this.pageTitle = '发视频'
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
      // 获取视频详情
      getArticleinfo(id) {
        this.requestApi.getArticleinfo({ id: id}).then(res => {
          if (res.code == 0) {
            this.videoForm = res.data;
            if(this.videoForm.customProperties){
              this.checkList1 = this.videoForm.customProperties.split(',')
            }else{
              this.checkList1=[];
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

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            if(this.checkList1.length>0){
              this.videoForm.customProperties = this.checkList1.toString();
            }
            if(!this.videoForm.videoUrl){
              this.$message.error('请上传视频！');
              return false;
            }
            if (this.pageTitle == '发视频') {
              this.videoForm.coverType = 3;
              let videoForm = JSON.parse(JSON.stringify(this.videoForm));
              // 提交视频
              this.requestApi.addInformation(videoForm).then(res => {
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
              // 修改视频
              let videoForm = JSON.parse(JSON.stringify(this.videoForm));
              this.requestApi.editInformation(videoForm).then(res => {
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
              message: '校验未通过！',
              type: 'warning'
            });
          }

        });
      },

      //上传封面图之前
      beforeAvatarUpload(file){
        var _this = this;
        return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(event) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            const extension = testmsg === 'jpg';
            const extension2 = testmsg === 'png';
            const isLt2M = file.size / 1024  <= 2000;
            if (!extension && !extension2) {
              _this.$message.error('上传文件只能是 jpg、png格式!');
              reject()
            }
            if (!isLt2M) {
              _this.$message.error('上传文件大小不能超过 2M!');
              reject()
            }
            var image = new Image();
            image.onload = function() {
              var width = this.width;
              var height = this.height;
              if (width > 686 || width < 686) {
                _this.$message.error('图片尺寸必须686px x 380px !');
                reject()
              } else if (height > 380 || height < 380) {
                _this.$message.error('图片尺寸必须686px x 380px !');
                reject()
              } else {
                resolve()
              }
            };
            image.src = event.target.result
          };
          reader.readAsDataURL(file)
        })
        // return extension || extension2 && isLt2M
      },
      uploader(param) {
        ossupload.ossuploadFile("",param.file,'information').then(pictureUrl => {
          this.videoForm.coverUrl1 = pictureUrl;
        })
      },
      uploaderVideo(param) {
        ossupload.ossuploadFile("",param.file,'information').then(pictureUrl => {
          this.videoForm.videoUrl = pictureUrl;
          this.videoFlag = false; //进度条显示
          this.$message({
            message: '视频上传完成！',
            type: 'success'
          });
        })
      },
      handleRemove(file, fileList) {
        this.videoForm.coverUrl1 = "";
      },
      beforeUploadVideo(file) {
        const fileSize = file.size / 1024 / 1024 < 200;
        if (['video/mp4'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频（格式） !');
          return false
        }
        if (!fileSize) {
          this.$message.error('视频大小不能超过200MB !');
          return false
        }
        var videoUrl = URL.createObjectURL(file);
        var videoObj = document.createElement("video");
        videoObj.src = videoUrl;
        videoObj.load();
      },
      handleChange(file, fileList) {
        //刚开始上传的时候，可以拿到ready状态，给个定时器，让进度条显示
        if (file.status === 'ready') {
          this.videoFlag = true; //进度条显示
        }
      },

      handleVideoError() {
        this.videoErrorTip = true;
        this.videoFlag = false;
        this.$message.error('上传失败!')
      },
      handleRemoveGoodsVideo() {
        this.videoFlag = false;
        this.videoForm.videoUrl = ''
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      andleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      onClick(e, editor) {
        console.log(e, editor)
      },
      getmsg(){
        console.log(this.msg)
      },

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
  .avatar-uploader1 .el-upload__tip{
    display: block;
  }
  .avatar-uploader1 .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius:0!important;
  }
  .avatar-uploader1 .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 343px!important;
    height: 190px!important;
    line-height: 190px!important;
    text-align: center;
  }
  .avatar {
    width: 343px!important;
    height: 190px!important;
    display: block;
  }
  .video{
    width: 343px;float: left;
    height: 190px;display: block;
    margin-right: 30px;
  }
  .avatar-uploader2{
    width: 100px;height: auto;float: left;
  }
</style>
