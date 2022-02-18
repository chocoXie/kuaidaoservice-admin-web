<template>
  <div class="page_container logPage">
    <h4 class="page_title">
      所有创作者
      <span class="listnum" v-show="isShow">共<i>{{creatorTotal}}</i>个创作者</span>
      <span class="listnum" v-show="!isShow">为您搜索出<i>{{creatorTotal}}</i>个创作者</span>
      <el-button @click="onAdd('creatorForm')" type="primary" class="addBtn">
        添加创作者
      </el-button>
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="creatorpar" class="demo-form-inline" style="position: relative;">
      <el-form-item label="">
        <el-input v-model="creatorpar.creatorName" placeholder="请输入要搜索的创作者" size="large"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="onSearch">搜索创作者</el-button>
      </el-form-item>
      <el-form-item  class="delAllbtn">
        <el-button type="primary" icon="el-icon-delete"  @click="onDelAll" v-show="isChecked">删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="creatorList"
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
        prop="creatorName"
        label="创作者名称"
        width="220">
      </el-table-column>
      <el-table-column
        prop="personalSignature"
        label="个性签名">
      </el-table-column>
      <el-table-column
        prop="creatorNatureStr"
        label="创作者性质">
      </el-table-column>
      <el-table-column
        prop="informationTotal"
        label="总数">
        <template slot-scope="scope">
          <a @click="toListSearch(scope.row.id)" style="color: #409EFF">{{scope.row.informationTotal}}</a>
        </template>
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
        :page-size="creatorpar.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="creatorTotal">
      </el-pagination>
    </div>

    <!--添加创作者弹窗-->
    <el-drawer
      title="添加创作者"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose">
      <el-form ref="creatorForm" :model="creatorForm" label-width="100px" :rules="rules" class="layer-form">
        <el-form-item label="创作者名称" prop="creatorName">
          <el-input v-model="creatorForm.creatorName"></el-input>
        </el-form-item>
        <el-form-item label="创作者头像" prop="headPortrait">
          <el-upload
            class="avatar-uploader"
            :on-remove="handleRemove"
            action="#"
            :http-request="(value)=> uploader(value)"
            :show-file-list="false"
            v-model="creatorForm.headPortrait"
            :before-upload="(file)=>beforeAvatarUpload(file)">
            <img v-if="creatorForm.headPortrait" :src="creatorForm.headPortrait" class="avatar" style="width: 100px!important;height: 100px!important;">
            <i v-else class="el-icon-plus avatar-uploader-icon" style="width: 100px!important;height: 100px!important;line-height: 100px!important;text-align: center;"></i>
            <span slot="tip" class="el-upload__tip">(大小100kb以内，格式jpg/png,50*50px)</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="个性签名" prop="personalSignature">
          <el-input type="textarea" v-model="creatorForm.personalSignature" placeholder="请输入创作者的签名信息"></el-input>
        </el-form-item>
        <el-form-item label="创作者性质" prop="creatorNature">
          <el-radio-group v-model="creatorForm.creatorNature">
            <el-radio label="1">个人</el-radio>
            <el-radio label="2">企业</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('creatorForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
  import { ossupload } from '@/api/ossUploadFile';
  export default {
    name: 'tagManage',
    data(){
      return{
        isShow:true,
        isChecked:false,
        imageUrl: '',
        creatorpar: {
          creatorName: '',
          pageNum:1,
          pageSize:10,
        },
        creatorForm:{
          // id:'',
          creatorName:'',
          headPortrait:'',
          personalSignature:'',
          creatorNature:''
        },
        id:'',
        creatorTotal: 0,
        currentPage: 1,
        creatorList: [],
        multipleSelection: [],
        idList:[],
        // 创作者弹窗参数
        drawer: false,
        direction: 'rtl',    //创作者弹窗展开方式
        rules: {
          creatorName: [
            { required: true, message: '请输入创作者姓名', trigger: 'blur' },
            { min: 2,message: '长度大于等于两个字符', trigger: 'blur' }
          ],
          headPortrait: [
            { required: true, message: '请上传创作者头像', trigger: 'change' }
          ],
          personalSignature: [
            { required: true, message: '请输入创作者的签名信息', trigger: 'blur' },
            { min:1,max: 60,message: '长度不超过60个字符', trigger: 'blur' }
          ],
          creatorNature: [
            { required: true, message: '请选择创作者性质', trigger: 'blur' }
          ],
        }
      }
    },
    created() {
      this.getCreatorList(this.creatorpar);
    },
    methods:{
      // 获取创作者列表
      getCreatorList(data={}){
        this.requestApi.getCreatorList(data).then(res => {
          if (res.code == 0) {
            this.creatorList = res.data;
            this.creatorTotal = res.total;
          }
        })
      },
      //点击跳转至文章列表页
      toListSearch(val){
        this.$store.state.content.data.creatorId = val;
        this.$router.push({
          path: `/informationManage/list`
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        var _that = this;
        _that.idList = [];
        val.forEach(row => {
          _that.idList.push(row.id);
        });
        if(val.length>=2){
          this.isChecked = true;
        }else{
          this.isChecked = false;
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.id = '';
            done();
            this.$refs.creatorForm.clearValidate();
            this.$refs.creatorForm.clearValidate(['creatorNature']);
          })
          .catch(_ => {});
      },
      // 搜索
      onSearch() {
        this.creatorpar.pageNum = 1;
        this.creatorpar.pageSize = 10;
        this.isShow = false;
        this.getCreatorList(this.creatorpar);
      },
      // 编辑
      onEdit(_msg) {
        this.id = _msg;
        this.requestApi.getEditorDetail({id:_msg}).then(res => {
          if (res.code==0) {
            this.creatorForm = res.data;
            //改变创作者性质值的类型为字符串
            this.creatorForm.creatorNature = ""+this.creatorForm.creatorNature
          }
        });
        this.drawer = true;

      },
      onDel(_index,_id){
        let _this =this;
        this.idList = [_id];
        _this.$confirm('此操作将永久删除创作者，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.requestApi.deleteCreator({idList:this.idList}).then(res =>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.getCreatorList(this.creatorpar);
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
        this.creatorpar.pageSize = val;
        this.getCreatorList(this.creatorpar)
      },
      handleCurrentChange(val) {
        this.creatorpar.pageNum = val;
        this.currentPage = val;
        this.getCreatorList(this.creatorpar)
      },

      // 删除多个创作者
      onDelAll(){
        let _this =this;
        _this.$confirm('此操作将永久删除选中的创作者，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.requestApi.deleteCreator({idList:this.idList}).then(res =>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.getCreatorList(this.creatorpar);
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

      //添加创作者
      onAdd(formName){
        this.creatorForm={
          creatorName:'',
            headPortrait:'',
            personalSignature:'',
            creatorNature:''
        },
        this.drawer = true;
      },
      //上传头像之前
      beforeAvatarUpload(file){
        var _this = this;
        return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function(event) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            const extension = testmsg === 'jpg';
            const extension2 = testmsg === 'png';
            const isLt2M = file.size / 1024  <= 100;
            if (!extension && !extension2) {
              _this.$message.error('上传文件只能是 jpg、png格式!');
              reject()
            }
            if (!isLt2M) {
              _this.$message.error('上传文件大小不能超过 100kb!');
              reject()
            }
            var image = new Image();
            image.onload = function() {
              var width = this.width;
              var height = this.height;
              if (width > 50 || width < 50) {
                _this.$message.error('图片尺寸必须50px x 50px !');
                reject()
              } else if (height > 50 || height < 50) {
                _this.$message.error('图片尺寸必须50px x 50px !');
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
          this.creatorForm.headPortrait = pictureUrl;
        })
      },
      handleRemove(file, fileList) {
        this.creatorForm.headPortrait = "";
      },
      // 提交表单添加创作者
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 编辑创作者提交
            if(this.id){
              const obj = {};
              obj.creatorName = this.creatorForm.creatorName;
              obj.headPortrait = this.creatorForm.headPortrait;
              obj.personalSignature = this.creatorForm.personalSignature;
              obj.creatorNature = this.creatorForm.creatorNature;
              obj.id = this.id;
              this.requestApi.updateEditor(obj).then(res => {
                if (res.code == 0) {
                  this.id = '';
                  this.drawer = false;
                  this.getCreatorList(this.creatorpar);
                }else{
                  this.$notify.error({
                    message: res.msg
                  });
                }
              })
            }else{
              // 新增创作者
              this.requestApi.addCreator(this.creatorForm).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: '恭喜你，添加创作者成功！',
                    type: 'success'
                  });
                  this.drawer = false;
                  this.$refs[formName].resetFields();
                  this.getCreatorList(this.creatorpar);
                }
              })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style>
  .layer-form{
    width: 100%;height: auto;margin: 0 auto;padding: 30px;border-top: 1px solid #f1f1f1;
  }
  .avatar-uploader .el-upload__tip{
    vertical-align: middle;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50px!important;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px!important;
    height: 100px!important;
    line-height: 100px!important;
    text-align: center;
  }
  .avatar {
    width: 100px!important;
    height: 100px!important;
    display: block;
  }
  .delAllbtn{
    position: absolute!important;right: 0!important;top: 0!important;
  }
</style>
<style scoped>

  .listnum{
    font-size: 14px!important;color: #333;margin-left: 20px;font-weight: normal;
  }
  .addBtn{
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }

</style>
