<template>
  <div class="page_container logPage">
    <h4 class="page_title">
      所有内容
      <span class="listnum" v-show="isShow">共<i>{{advertTotal}}</i>条内容</span>
      <span class="listnum" v-show="!isShow">为您搜索出<i>{{advertTotal}}</i>条内容</span>
      <el-button type="primary" class="towrite" @click="ToArticle">写文章</el-button>
      <el-button type="primary" class="tovideo" @click="ToVideo">发视频</el-button>
    </h4>
    <!--搜索栏-->
    <el-form :inline="true" :model="searchList" class="demo-form-inline">
      <div style="float: left">
        <el-form-item label="">
          <el-input v-model="searchList.title" placeholder="请输入标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchList.contentType" placeholder="请选择内容类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="图文" value="1"></el-option>
            <el-option label="视频" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchList.customProperties" placeholder="请选择自定义属性">
            <el-option label="全部" value=""></el-option>
            <el-option label="头条" value="1"></el-option>
            <el-option label="推荐" value="2"></el-option>
            <el-option label="置顶" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchList.creatorId" placeholder="请选择创作者">
            <el-option v-for="(item,index) in creatorList" :value="item.id" :key="item.id" :label="item.creatorName"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="float: left">
        <el-form-item label="">
          <div class="block">
            <el-date-picker
              v-model="searchList.publishTimeStart"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div class="block">
            <el-date-picker
              v-model="searchList.publishTimeEnd"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click.native.prevent="onSearch" native-type="submit">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-refresh-right"  @click="onReset">重置</el-button>
        </el-form-item>
      </div>

    </el-form>

    <el-table
      :data="informationData"
      :header-cell-style="utils.tableHeaderClass"
      class="mt-20"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="title"
        label="标题"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创作者"
        width="150">
        <template slot-scope="scope">
          <a @click="toSearchList(scope.row.creatorId)" style="color: #409EFF">{{scope.row.creatorName}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="editor"
        label="编辑"
        width="150">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="tag"-->
        <!--label="标签"-->
        <!--min-width="200">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="commit"-->
        <!--label="评论"-->
        <!--width="100">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="realReading"
        label="浏览量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="publishTime"
        label="发布日期"
        :formatter="dateFormat"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="contentType"
        label="内容类型"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.contentType == 1">图文</span>
          <span v-else>视频</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="onEdit(scope.row.id,scope.row.contentType)" circle></el-button>
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
        :page-size="searchList.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="advertTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'list',
    data(){
        return{
          creatorList:[{id:'1',creatorName:'创作者一'},{id:'2',creatorName:'创作者er'}],
          searchList: {
            title: '',
            contentType: '',
            customProperties:'',
            creatorId:'',
            // tag:'',
            publishTimeStart:'',
            publishTimeEnd:'',
            pageNum:1,
            pageSize:10,
          },
          idList:[],
          isShow:true,
          advertTotal: 0,
          currentPage: 1,
          informationData: [],
        }
    },
    created() {
      if(this.$store.state.content.data.creatorId){
        this.searchList.creatorId = this.$store.state.content.data.creatorId;
      }
      this.getInformationList(this.searchList);
      this.getCreatorList({
        pageNum:1,
        pageSize:10000,
      });

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
      // 获取文章列表
      getInformationList(data={}){
        this.requestApi.getInformationList(data).then(res => {
          if (res.code == 0) {
            this.informationData = res.data;
            this.advertTotal = res.total;
            this.$store.state.content.data.creatorId = "";
            // this.informationData.forEach(function(item, index) {
              // for (let key in item) {
              //   /*el-switch 绑定的值伪 true 与 false*/
              //   if (key == 'status') {
              //     if (item[key] == 1) {
              //       item[key] = true
              //     } else if (item[key] == 2) {
              //       item[key] = false
              //     }
              //   }
              // }
            // })
          }
        })
      },
      //时间格式化
      dateFormat(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      // 去文章页
      ToArticle() {
        this.$router.push({
          path: `/informationManage/writeArticle`
        });
      },
      // 去视频页
      ToVideo(_msg) {
        this.$router.push({
          path: `/informationManage/publishVideo`
        });
      },
      // 搜索
      onSearch() {
        this.searchList.pageNum = 1;
        this.searchList.pageSize = 10;
        this.isShow = false;
        this.searchList.title = this.searchList.title.trim();
        this.getInformationList(this.searchList);
      },
      // 重置
      onReset() {
        for ( let key in this.searchList){
          if(key != 'pageNum' && key != 'pageSize'){
            this.searchList[key] = ''
          }
        }
        this.getInformationList(this.searchList);
        this.isShow = true;
      },
      // 点击表格中的创作者搜索列表
      toSearchList(val){
        this.searchList.pageNum = 1;
        this.searchList.pageSize = 10;
        this.searchList.creatorId = val;
        this.getInformationList(this.searchList);
      },
      // 编辑
      onEdit(_msg,contentType) {
        if(contentType ==1){
          this.$router.push({
            path: `/informationManage/writeArticle/${_msg}`
          })
        }else{
          this.$router.push({
            path: `/informationManage/publishVideo/${_msg}`
          })
        }

      },
      onDel(_index,_id){
        let _this =this;
        _this.idList.push(_id);
        _this.$confirm('此操作将永久删除文章，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         const obj = {
           idList:_this.idList
         };
          _this.requestApi.deleteInformation(obj).then(res =>{
            if(res.code ==0 ){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.getInformationList(this.searchList);
              _this.idList = [];

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
        this.searchList.pageSize = val;
        this.getInformationList(this.searchList);
      },
      handleCurrentChange(val) {
        this.searchList.pageNum = val;
        this.getInformationList(this.searchList);
      },

    }
  }
</script>
<style scoped>
.listnum{
  font-size: 14px!important;color: #333;margin-left: 20px;font-weight: normal;
}
  .towrite{
    position: absolute;
    right: 100px;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .tovideo{
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
    line-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
