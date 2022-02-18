<template>
  <div class="editorRole">
    <div class="page_container rolePage">
      <h4 class="page_title">{{pageTitle}}</h4>
      <el-form label-width="120px" :model="editorInfo" :rules="roleRules" ref="roleEditor">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="editorInfo.roleName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="editorInfo.description" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="权限管理：">
          <el-tree
            :data="permissionsList"
            show-checkbox
            :default-checked-keys="editorInfo.permissionIds"
            ref="permissionsTree"
            node-key="id"
            :check-strictly="true"
            @check-change="permissionsCheck"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-button type="primary" @click="editorRole('roleEditor')">保存</el-button>
      </el-form>
      <!--:default-checked-keys="editorInfo.permissionIds"   :check-strictly="true"  @check-change="permissionsCheck"-->

    </div>
  </div>
</template>
<script>

  export default {
    name: 'editorRole',
    data(){
      return{
        pageTitle:'',
        permissionsList: [],
        roleListPermissionsId:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        editorInfo:{
          id:'',
          roleName:'',
          description:'',
          permissionIds:[]
        },
        roleRules:{
          roleName:[
            { required: true, message: '角色名称不能为空'},
          ]
        },
        roleID:''
      }
    },
    created(){
      if(this.$route.params.id == 'add'){
        this.pageTitle = '新增角色'
      }else{
        this.pageTitle = '编辑角色'
      }
      this.roleID = this.$route.params.id;
      this.getRoleInfo();
      this.getSysPermission()
    },
    methods:{
      /**
       * 树的选中状态发生变化时
       * @param {Object} data 该节点的数据
       * @param {Object} on 节点本身是否被选中
       * @param {Object} child 节点的子树中是否有被选中的节点
       */
      permissionsCheck(data, on, child){
        try {
           if (data.depth === 1) {
             this.handleOneNode(on, data)
           } else if (data.depth === 2) {
             this.handleTwoNode(on, data)
           } else if (data.depth === 3) {
             this.handleThreeNode(on, data)
           }else if (data.depth === 4){
             this.handleFourNode(on, data)
           }
         } catch (error) {
           console.warn(error)
         }
      },
      /**
       * 一级节点处理
       * @param {Boolean} on 是否被选中
       * @param {Object} data 当前节点的数据
       */
      handleOneNode(on, data) {
        const tree = this.$refs.permissionsTree
        const level1_child = data.children;
        if (on) {
          let level1ChildIsCheck = false;
          for(let i =0;i<level1_child.length;i++){
            if(tree.getNode(level1_child[i].id).checked){
              level1ChildIsCheck = true;
              break;
            }else{
              level1ChildIsCheck = false ;
            }
          }
          if(!level1ChildIsCheck){
            level1_child.forEach((_L1item,_L1Index)=>{
              /*二级*/
              tree.getNode(_L1item.id).checked = true
              tree.getNode(_L1item.id).childNodes.forEach((cItem,cindex) => {
                /*三级*/
                cItem.checked = true;
                if(cItem.childNodes.length>0){
                  /*四级*/
                  cItem.childNodes.forEach(siItem =>{
                    siItem.checked = true;
                  })
                }
              })
            })
          }
        }else{
          level1_child.forEach((item,index)=>{
            /*二级*/
            tree.getNode(item.id).checked = false
            tree.getNode(item.id).childNodes.forEach((cItem,cindex) => {
              /*三级*/
              cItem.checked = false;
              if(cItem.childNodes.length>0){
                /*四级*/
                cItem.childNodes.forEach(siItem =>{
                  siItem.checked = false;
                })
              }
            })
          })
        }
      },
      /**
       * 二级节点处理
       * @param {Boolean} on 是否被选中
       * @param {Object} data 当前节点的数据
       */
      handleTwoNode(on, data) {
        const tree = this.$refs.permissionsTree
        const level2node = tree.getNode(data.parentId)
        const level2_child = data.children;
        if (on) {
          let level2ChildIsCheck = false;
          // 如果上级节点未被勾选，则让他被选中
          if (!level2node.checked) {
            level2node.checked = true
          }
          /*下级元素默认全部选中 => 当下级元素都没有选中时*/
          for(let i =0;i<level2_child.length;i++){
            if(tree.getNode(level2_child[i].id).checked){
              level2ChildIsCheck = true;
              break;
            }else{
              level2ChildIsCheck = false ;
            }
          }
          if(!level2ChildIsCheck){
            level2_child.forEach((_L2item,_L2Index)=>{
              tree.getNode(_L2item.id).checked = true
            })
          }
        }else {
          const parentArr = []
          const parentData = level2node.data
          let parentBool = true;
          // let level2ChildIsCheck = false;
          // 筛选出所有兄弟key，如果有勾选的则代表上级不需要去除勾选
          if (parentData.children.length > 0) {
            parentData.children.forEach(parent => {
              parentArr.push(parent.id)
            })
            for (let i of parentArr) {
              let thisNode = tree.getNode(i)
              if (thisNode.checked) {
                parentBool = false
              }
            }
          }
          // 为true则代表没有二级节点被勾选，此时上级去除勾选
          if (parentBool) {
            level2node.checked = false
          } else {
            level2node.checked = true
          }
          /*父级未选中子集全部取消选中*/
          level2_child.forEach((item,index)=>{
            tree.getNode(item.id).checked = false
          })
        }
      },
      /**
       * 三级节点处理
       * @param {Boolean} on 是否被选中
       * @param {Object} data 当前节点的数据
       */
      handleThreeNode(on, data){
        const tree = this.$refs.permissionsTree
        const level2node_L3 = tree.getNode(data.parentId)
        const level3node = tree.getNode(level2node_L3.data.parentId)
        const level3_child = data.children;
        if (on) {
          let level3ChildIsCheck = false;
          // 如果上级节点未被勾选，则让他被选中
          if (!level2node_L3.checked) {
            level2node_L3.checked = true
          }
          /*下级元素默认全部选中 =》 子集元素都未被选中时*/
          for(let i =0;i<level3_child.length;i++){
            if(tree.getNode(level3_child[i].id).checked){
              level3ChildIsCheck = true;
              break;
            }else{
              level3ChildIsCheck = false ;
            }
          }
          if(!level3ChildIsCheck){
            level3_child.forEach((_L3item)=>{
              tree.getNode(_L3item.id).checked = true
            })
          }
        }else{
          const parentArr = []
          const forefathersArr = []
          const parentData = level2node_L3.data
          const forefathersData = level3node.data
          let parentBool = true
          let forefathersBool = true
          // 筛选出所有兄弟key，如果有勾选的则代表上级不需要去除勾选
          if (parentData.children.length > 0) {
            parentData.children.forEach(parent => {
              parentArr.push(parent.id)
            })
            for (let i of parentArr) {
              let thisNode = tree.getNode(i)
              if (thisNode.checked) {
                parentBool = false
              }
            }
          }
          // 为true则代表没有三级级节点被勾选，此时上级去除勾选
          if (parentBool) {
            level2node_L3.checked = false
          } else {
            level2node_L3.checked = true
          }
          /*父级未选中子集全部取消选中*/
          level3_child.forEach((item,index)=>{
            tree.getNode(item.id).checked = false
          })
        }
      },
      /**
       * 四级节点处理
       * @param {Boolean} on 是否被选中
       * @param {Object} data 当前节点的数据
       */
      handleFourNode(on, data){
        const tree = this.$refs.permissionsTree
        const level3node_L4 = tree.getNode(data.parentId)
        const level4node = tree.getNode(level3node_L4.data.parentId);
        if (on) {
          if (!level3node_L4.checked) {
            level3node_L4.checked = true
          }
          if (!level4node.checked) {
            level4node.checked = true
          }
        }else{
          const parentArr = []
          const forefathersArr = []
          const parentData = level3node_L4.data
          const forefathersData = level4node.data
          let parentBool = true
          let forefathersBool = true
          // 筛选出所有兄弟key，如果有勾选的则代表上级不需要去除勾选
          if (parentData.children.length > 0) {
            parentData.children.forEach(parent => {
              parentArr.push(parent.id)
            })
            for (let i of parentArr) {
              let thisNode = tree.getNode(i)
              if (thisNode.checked) {
                parentBool = false
              }
            }
          }
          // 为true则代表没有四级节点被勾选，此时上级去除勾选
          if (parentBool) {
            level3node_L4.checked = false
          } else {
            level3node_L4.checked = true
          }
          // 筛选出所有上级的兄弟key，如果有勾选的则代表上级不需要去除勾选
          if (forefathersData.children.length > 0) {
            forefathersData.children.forEach(parent => {
              forefathersArr.push(parent.id)
            })
            for (let i of forefathersArr) {
              let thisNode = tree.getNode(i)
              if (thisNode.checked ) {
                forefathersBool = false
              }
            }
            if (forefathersBool) {
              level4node.checked = false
            }
          }
        }
      },
      /*获取权限列表*/
      getSysPermission(){
        let _this = this;
        _this.requestApi.getSysPermission().then(res=>{
          let PermissionList = [];
          if(res.code ==0 ){
            let data = JSON.parse(JSON.stringify(res.data))
            data.forEach(function(item,index) {
              /*一级*/
              if(item.parentId == 0 && item.isNav == 1){
                item.label = item.name
                item.children = [];
                item.depth = 1
                let parentId = item.id;
                /*二级*/
                data.forEach(function(eitem,cindex){
                  if(parentId == parseInt(eitem.parentId)){
                    eitem.label = eitem.name
                    item.children.push(eitem)
                    let eparentId = eitem.id;
                    eitem.depth = 2
                    eitem.children = [];
                    /*三级*/
                    data.forEach(function(sitem,cindex){
                      if(eparentId == parseInt(sitem.parentId)){
                        sitem.label = sitem.name
                        if(sitem.description == '查询角色列表'){
                          _this.roleListPermissionsId = sitem.id
                        }
                        eitem.children.push(sitem)
                        let sparentId = sitem.id;
                        sitem.depth = 3
                        sitem.children = [];
                        /*四级*/
                        data.forEach(function(siItem,cindex){
                          if(sparentId == parseInt(siItem.parentId)){
                            siItem.label = siItem.name
                            sitem.children.push(siItem)
                            siItem.depth = 4
                          }
                        })
                      }
                    })
                  }
                })
                PermissionList.push(item)
              }
            })
            this.permissionsList = PermissionList;
          }
        })
      },
      /*获取角色信息*/
      getRoleInfo(){
        if(this.roleID != 'add'){
          this.requestApi.getRoleInfo({id:this.roleID}).then(res=>{
            if(res.code == 0){
              let data = JSON.parse(JSON.stringify(res.data))
              this.editorInfo.roleName = data.roleName;
              this.editorInfo.description = data.description;
              let idArray = []
              data.permissions.forEach(item =>{
                idArray.push(item.id)
              })
              this.editorInfo.permissionIds = idArray
            }
          }).catch(err=>{
            console.log(err)
          })
        }

      },
      editorRole(formMsg){
        this.$refs[formMsg].validate((valid) => {
          if (valid) {
            /*通过key获取被选中的权限*/
            // this.editorInfo.permissionIds = this.$refs.permissionsTree.getCheckedKeys().concat(this.$refs.permissionsTree.getHalfCheckedKeys())
            this.editorInfo.permissionIds = this.$refs.permissionsTree.getCheckedKeys()
            if(this.roleID == 'add'){
              /*新增角色*/
              this.requestApi.addNewRole(this.editorInfo).then(res=>{
                if(res.code == 0){
                  this.modelSuccesssFun('添加成功')
                }else{
                  this.$message(res.msg);
                }
              }).catch(err=>{
                console.log(err)
              })
            }else{
              /*编辑现有角色*/
              this.editorInfo.id = this.roleID
              this.requestApi.editorRole(this.editorInfo).then(res=>{
                if(res.code == 0){
                  this.modelSuccesssFun('修改成功')
                }else{
                  this.$message(res.msg);
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
      modelSuccesssFun(successMsg){
        let _this = this;
        _this.$alert(successMsg, '通知', {
          confirmButtonText: '确定',
          callback: action => {
            _this.$router.push({
              path:`/system/role`
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .rolePage .el-form-item__content{
    width: 50%;
  }
</style>
<style lang="scss" scoped>
</style>
