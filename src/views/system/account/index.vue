<template>
  <div class="page_container accountPage">
    <h4 class="page_title">
      账号管理
      <el-button v-if="hasPerm('添加用户')" type="primary" class="addItemBtn" @click="openEditorProup('add')">添加</el-button>
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="searchForm" >
      <el-form-item label="手机号">
        <el-input type="tel" v-model="searchForm.phone" clearable placeholder="请输入手机号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input type="text" v-model="searchForm.name" clearable placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchForm.roleIds" clearable  placeholder="请选择角色">
          <el-option v-for="(item,index) in roleList" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native.prevent="searchConfirm" native-type="button">搜索</el-button>
        <el-button type="info" icon="el-icon-edit" @click.native.prevent="searchReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格-->
    <el-table :data="userInfoList" border style="width: 100%" stripe :header-cell-style="utils.tableHeaderClass" class="mt-20">
      <el-table-column fixed prop="userName" label="用户名" min-width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="130"></el-table-column>
      <el-table-column prop="roleNames" label="角色" min-width="130">
        <template slot-scope="scope">
          <span  v-if="scope.row.roleNames">{{scope.row.roleNames}}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="150"></el-table-column>
      <el-table-column prop="createTimeStr" label="创建时间" min-width="130"></el-table-column>
      <el-table-column prop="lastLoginTimeStr" label="最后登录" min-width="130"></el-table-column>
      <el-table-column prop="status" label="状态" width="80" v-if="hasPerm('修改用户状态')">
        <template slot-scope="scope">
          <el-switch
            class="tableSwitch"
            v-model="scope.row.status"
            active-text="启用"
            @change="updateUserStatus(scope.$index, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="hasPerm('编辑用户信息')" type="primary" plain @click="openEditorProup('editor',scope.row)">编辑</el-button>
          <el-button v-if="hasPerm('删除用户')" type="danger" plain @click.native.prevent="delThisUser(scope.$index,scope.row.id)">删除</el-button>
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
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userListTotal">
      </el-pagination>
    </div>
    <!--model(新增与编辑)-->
    <el-dialog :title="proupformTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true" @close="closeProup('proupForm')">
      <el-form :model="proupForm" status-icon ref="proupForm" :rules="proupFormRules">
        <el-form-item label="用户" :label-width="proupformLabelWidth" prop="userName">
          <el-input v-model="proupForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="proupformLabelWidth" prop="phone">
          <el-input v-model="proupForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="proupformLabelWidth" prop="password" class="p-r hiddenicon">
          <el-input v-model="proupForm.password" :type="showPassword ? 'text' : 'password'" placeholder="请使用数字与字母，至少6位" @input="resetPassword($event)"></el-input>
          <i class="iconfont icon-yanjing passIcon" v-if="showPassword" @click="checkPassword('password','show')"></i>
          <i class="iconfont icon-close-eye passIcon" v-else @click="checkPassword('password','hide')"></i>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="proupformLabelWidth" prop="checkPassword" class="p-r hiddenicon">
          <el-input v-model="proupForm.checkPassword" :type="showCheckPassword ? 'text' : 'password'" @input="resetPassword($event)" ></el-input>
          <i class="iconfont icon-yanjing passIcon" v-if="showCheckPassword" @click="checkPassword('checkPassword','show')"></i>
          <i class="iconfont icon-close-eye passIcon" v-else  @click="checkPassword('checkPassword','hide')"></i>
        </el-form-item>
        <el-form-item label="账号角色" :label-width="proupformLabelWidth" prop="roleIds">
          <el-select v-model="proupForm.roleIds" :placeholder="proupRolePlaceholder">
            <el-option v-for="(item,index) in roleList" :label="item.roleName" :key="index" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeProup('proupForm')">取 消</el-button>
        <el-button type="primary" @click.native.prevent="proupFormSubmit('proupForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      var checkPhone = (rule, value, callback) => {
        var telreg = /^1[3456789]\d{9}$/
        setTimeout(() => {
          if (!telreg.test(value.trim())) {
            callback(new Error('请输入正确的手机号'));
          }else {
            callback();
          }
        }, 100);
      };
      var validatePass = (rule, value, callback) => {
        var passReg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/);
        if(this.checkEditorPassword){
          if(value == ''){
            callback(new Error('请输入密码'));
          }else if (this.proupForm.password !== '') {
            if (!passReg.test(value)) {
              callback(new Error('密码必须是数字与字母的6-20位组合'));
            }else{
              this.$refs.proupForm.validateField('checkPassword');
            }
            callback();
          }
        }else{
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        /*
        checkEditorPassword : 只有在编辑弹窗下，没有更改password时，值为false不会进行验证，其他情况都会验证
         */
        if(this.checkEditorPassword){
          if(this.proupForm.checkPassword == ''){
            callback(new Error('请再次输入密码'));
          }else if (this.proupForm.checkPassword != this.proupForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        }else{
          callback();
        }
      };
      return {
        roleList:[],
        searchForm: {
          phone:'',
          name: '',
          roleIds: '',
          pageNum:1,
          pageSize:10,
        },
        userListTotal:0,
        userInfoList: [],
        currentPage: 1,
        dialogFormVisible:false,
        proupformTitle:'',
        proupformLabelWidth:'100px',
        proupFormType:'',
        proupRolePlaceholder:'请选择角色',
        proupForm:{
          id:'',
          userName:'',
          phone:'',
          password:'',
          checkPassword:'',
          roleIds:''
        },
        proupFormRules: {
          userName: [
            { required: true, message: '用户名不能为空'},
          ],
          phone: [
            { required: true,message: '手机号不能为空'},
            { validator: checkPhone, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          roleIds:[
            { required: true, message: '角色不能为空'},
          ]
        },
        showPassword:false,
        showCheckPassword:false,
        checkEditorPassword:false
      }
    },
    created(){
      this.getUserList(this.searchForm)
      this.getRoleList()
    },
    methods: {
      /*获取账号列表*/
      getUserList(data ={}){
        this.requestApi.getUserList(data).then(res=>{
          if(res.code == 0){
            this.userInfoList = res.data;
            this.userListTotal = res.total;
            this.userInfoList.forEach(function(item,index) {
              for(let key in item){
                /*el-switch 绑定的值伪 true 与 false*/
                if(key == 'status'){
                  if(item[key] == 1){
                    item[key] = true
                  }else if(item[key] == 2){
                    item[key] = false
                  }
                }
              }
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      /*获取角色列表*/
      getRoleList(){
        this.requestApi.getAllRole().then(res => {
          let result = res;
          if(result.code == 0){
            this.roleList = result.data;
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      /*编辑弹窗*/
      openEditorProup(type,row){
        this.proupFormType = type;
        this.dialogFormVisible = true
        /*根据按钮类型更改数据*/
        if(type == 'add'){
          this.proupformTitle = '新建账号';
          this.checkEditorPassword = true;
        }else if(type == 'editor'){
          this.proupformTitle = '编辑账号';
          this.proupForm.userName = row.userName;
          this.proupForm.phone = row.phone;
          this.proupForm.id = row.id;
          /*
          * 1.判断是否有角色id是否为空
          * 2.判断账号绑定角色是否存在，存在展示，不存在提示已删除
          * */
          if(row.roleIds){
            this.proupForm.roleIds =parseInt(row.roleIds) ;
            let roleIsHas = this.roleList.find(item =>{
              return item.id == row.roleIds;
            })
            if(roleIsHas == undefined){
              this.proupRolePlaceholder = '原角色不存在，请重新选择'
              this.proupForm.roleIds = ''
            }
          }else{
            this.proupRolePlaceholder = '请选择角色'
            this.proupForm.roleIds = ''
          }
        }
      },
      /*账号弹窗表单*/
      proupFormSubmit(formMsg){
        this.$refs[formMsg].validate((valid) => {
          /*删除检查密码的字段*/
          delete this.proupForm.checkPassword;
          if (valid) {
            if(this.proupFormType == 'add'){
              this.requestApi.addUser(this.proupForm).then(res=>{
                if(res.code == 0){
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  });
                  this.dialogFormVisible = false;
                  this.checkEditorPassword = true;
                  this.showPassword = false;
                  this.showCheckPassword = false;
                  this.getUserList(this.searchForm)
                }else{
                  this.$message.error(res.data.msg);
                }
              }).catch(err=>{
                console.log(err)
              })
            }else if(this.proupFormType == 'editor'){
              if(this.proupForm.password == ''){
                /*修改时，如果密码字段为空，表示不修改密码，不传此字段*/
                delete this.proupForm.password;
              }
              this.requestApi.editUserInfo(this.proupForm).then(res=>{
                if(res.code == 0){
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.dialogFormVisible = false;
                  this.checkEditorPassword = false;
                  this.showPassword = false;
                  this.showCheckPassword = false;
                  this.getUserList(this.searchForm)
                }
              }).catch(err=>{
                console.log(err)
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetPassword(e){
        /*针对input输入不了，进行手动强制刷新*/
        this.$forceUpdate();
        /*编辑状态下，只有密码或者确认密码修改后，才会进行验证*/
        if(this.proupFormType == 'editor'){
          this.checkEditorPassword = true;
        }
      },
      closeProup(formName){
        this.dialogFormVisible = false
        this.checkEditorPassword = false;
        this.showPassword = false;
        this.showCheckPassword = false;
        /*验证重置*/
        this.$refs[formName].resetFields();
        for(let key in this.proupForm){
          this.proupForm[key] = ''
        }
      },
      checkPassword(_type1,_type2){
        if(_type1 == 'password'){
          if(_type2 == 'show'){
            this.showPassword=false
          }else{
            this.showPassword=true
          }
        }else{
          if(_type2 == 'show'){
            this.showCheckPassword=false
          }else{
            this.showCheckPassword=true
          }
        }
      },
      /*账号筛选重置*/
      searchReset(){
        for ( let key in this.searchForm){
          if(key != 'pageNum' && key != 'pageSize'){
            this.searchForm[key] = ''
          }
        }
        this.getUserList();
      },
      /*账号筛选*/
      searchConfirm() {
        this.searchForm.pageNum = 1;
        this.searchForm.pageSize = 10
        this.getUserList(this.searchForm);
      },
      delThisUser(_index,_id) {
        this.$confirm('删除后，新运营后台无法登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestApi.delUserItem({id:_id}).then(res=>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.searchForm.pageSize = 10
              this.getUserList({ pageNum:1,pageSize:10,})
            }else{
              this.$message({
                message:res.data.msg,
                type: 'warning'
              });
            }
          }).catch(err=>{
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      updateUserStatus(_index,row){
        /*
        * 状态传值为 true =》 1；false =》 2
        * */
        let _status;
        if(row.status){
          _status = 1
        }else{
          _status = 2
        }
        let data = {
          id:row.id,
          status:_status
        };
        this.requestApi.updateUserStatus(data).then(res => {
          if(res.code == 0){
            this.$notify({
              type: 'success',
              message: '修改成功'
            });
          }else{
            this.$notify.error({
              message: '修改失败'
            });
          }
        }).catch(err =>{
          console.log(err)
        })
      },
      handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.getUserList(this.searchForm)
      },
      handleCurrentChange(val) {
        this.searchForm.pageNum = val;
        this.getUserList(this.searchForm)
      }
    },
  }
</script>
<style lang="scss" >
  .accountPage{
    .el-form--inline .el-form-item{
      margin-right: 30px;
    }
    .el-select {
      width: 100%;
    }
    .hiddenicon .el-input__suffix{
      display: none;
    }
  }
</style>
<style lang="scss" scoped>
  .passIcon{
    position: absolute;
    right: 3%;
  }
</style>
