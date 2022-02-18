<template>
  <div class="page_container brandInfo" v-loading="loading"
       element-loading-text="品牌品类加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.5)">
    <el-form label-width="100px" ref="informationForm" :model="informationForm" :rules="formRules">
      <h4 class="page_title">基本信息</h4>
      <div class="flex_strat">
        <el-form-item label="品牌名称" class="w50" prop="name">
          <el-input v-model="informationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="加盟费用" class="w50" prop="feesToJoinFrom">
          <div class="flex_between">
            <el-input v-model="informationForm.feesToJoinFrom" type="number" class="w48"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            <span>-</span>
            <el-input v-model="informationForm.feesToJoinTo" type="number" class="w48" ref="joinFeeMax"
                      onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            <span>万</span>
          </div>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="总部所在地" class="w50 " prop="headOfficeProvince">
          <div class="flex_between">
            <el-select v-model="informationForm.headOfficeProvince" placeholder="请选择" class="w48"
                       @change="selectProvince($event)">
              <el-option v-for="item in provinceList" :key="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="informationForm.headOfficeCity" placeholder="请选择" class="w48"
                       :disabled="cityL2List.length == 0">
              <el-option v-for="item in cityL2List" :key="item.name" :value="item.name" :label="item.name"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="品牌品类" class="w50" prop="categoryId">
          <div class="flex_strat">
            <el-select v-model="informationForm.categoryparentId" placeholder="一级品类" class="w48"
                       @change="selectCategorL2($event)">
              <el-option v-for="item in initcategorL1" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <el-select v-model="informationForm.categoryId" placeholder="二级品类" class="w48" style="margin-left: 2%"
                       :disabled="categorL2List.length == 0">
              <el-option v-for="item in categorL2List" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </div>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="权重" class="w50" prop="weight">
          <el-input v-model="informationForm.weight" type="number"
                    onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" class="w50">
          <el-upload
            class="upload-demo"
            action="#"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG"
            :http-request="(value)=> uploader('', value,'logoUrl')"
            :before-remove="(file, fileList) => {beforeRemove(file, fileList,'logoUrl')}"
            :on-preview="handlePreview"
            :limit="1"
            :file-list=" informationForm.logoUrl"
            list-type="picture-card">
            <el-button type="primary" v-if="informationForm.logoUrl.length == 0">点击上传</el-button>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </div>
      <h4 class="page_title mt-15">公司信息</h4>
      <div class="flex_strat">
        <el-form-item label="公司名称" class="w50" prop="company.name">
          <el-input v-model="informationForm.company.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="公司网址" class="w50">
          <el-input v-model="informationForm.company.website" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="法人" class="w50" prop="company.legalPerson">
          <el-input v-model="informationForm.company.legalPerson" type="text"></el-input>
        </el-form-item>
        <el-form-item label="企业评分" class="w50">
          <el-input v-model="informationForm.company.score" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="联系方式" class="w50">
          <el-input v-model="informationForm.company.phone" type="tel" max-length="11"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" class="w50">
          <el-input v-model="informationForm.company.email" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="注册资本" class="w50" prop="company.regCapital">
          <el-input v-model="informationForm.company.regCapital" type="tel"></el-input>
        </el-form-item>
        <el-form-item label="成立日期" class="w50" prop="company.regDate">
          <el-date-picker v-model="informationForm.company.regDate" value-format="yyyy-MM-dd" type="date"
                          class="w100"></el-date-picker>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="工商注册号" class="w50">
          <el-input v-model="informationForm.company.businessCirclesNumber" type="text"></el-input>
        </el-form-item>
        <el-form-item label="经营状态" class="w50" prop="company.regStatus">
          <el-input v-model="informationForm.company.regStatus" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="信用代码" class="w50" prop="company.creditCode">
          <el-input v-model="informationForm.company.creditCode" type="text"></el-input>
        </el-form-item>
        <el-form-item label="组织结构代码" class="w50">
          <el-input v-model="informationForm.company.orgNumber" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="公司类型" class="w50">
          <el-input v-model="informationForm.company.orgType" type="text"></el-input>
        </el-form-item>
        <el-form-item label="纳税识别号" class="w50">
          <el-input v-model="informationForm.company.taxNumber" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="行业" class="w50">
          <el-input v-model="informationForm.company.industry" type="text"></el-input>
        </el-form-item>
        <el-form-item label="营业期限" class="w50">
          <el-input v-model="informationForm.company.operatingPeriod" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="人员规模" class="w50">
          <el-input v-model="informationForm.company.staffNumRange" type="text"></el-input>
        </el-form-item>
        <el-form-item label="实缴资本" class="w50">
          <el-input v-model="informationForm.company.actualCapital" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="登记机关" class="w50">
          <el-input v-model="informationForm.company.regInstitute" type="text"></el-input>
        </el-form-item>
        <el-form-item label="参保人数" class="w50">
          <el-input v-model="informationForm.company.socialStaffNum" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="注册地址" class="w100" prop="company.regLocation">
          <el-input v-model="informationForm.company.regLocation" type="text"></el-input>
        </el-form-item>
      </div>
      <h4 class="page_title mt-15">特许备案</h4>
      <div class="flex_strat">
        <el-form-item label="备案号" class="w50">
          <el-input v-model="informationForm.company.filingNo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="备案机关" class="w50">
          <el-input v-model="informationForm.company.filingGovernment" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="公告时间" class="w50">
          <el-date-picker v-model="informationForm.company.filingDate" type="date" class="w100"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="住所" class="w50">
          <el-input v-model="informationForm.company.filingAddress" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="电话" class="w50">
          <el-input v-model="informationForm.company.filingPhone" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" class="w50">
          <el-input v-model="informationForm.company.filingEmail" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="特许品牌" class="w50">
          <el-input v-model="informationForm.company.filingBrand" type="text"></el-input>
        </el-form-item>
        <el-form-item label="权利性质" class="w50">
          <el-input v-model="informationForm.company.filingNatureOfPower" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="权利号" class="w50">
          <el-input v-model="informationForm.company.filingPowerNo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="注册类别" class="w50">
          <el-input v-model="informationForm.company.filingRegCategory" type="text"></el-input>
        </el-form-item>
      </div>
      <div class="flex_strat">
        <el-form-item label="权利日期" class="w50">
          <el-date-picker v-model="informationForm.company.filingPowerDate" value-format="yyyy-MM-dd" type="date"
                          class="w100"></el-date-picker>
        </el-form-item>
        <el-form-item label="权利期限" class="w50">
          <el-date-picker
            class="w100"
            v-model="informationForm.company.filingPowerTerm"
            value-format="yyyy-MM-dd" type="date">
          </el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="备案截图" class="w50">
          <el-upload
            class="upload-demo"
            action="#"
            accept=".jpg,.jpeg,.png,.JPG,.JPEG"
            :http-request="(value)=> uploader('', value,'filingPic')"
            :before-remove="(file, fileList) => {beforeRemove(file, fileList,'filingPic')}"
            :on-preview="handlePreview"
            :limit="1"
            :file-list="informationForm.company.filingPic"
            list-type="picture-card">
            <el-button type="primary" v-if="informationForm.company.filingPic.length == 0">点击上传</el-button>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </div>
    </el-form>
    <el-button v-if="hasPerm('修改品牌信息')" type="primary" @click="submitInfoBtn('informationForm')" style="display: block;margin: 3% auto 0">保存
    </el-button>
  </div>
</template>
<script>
  import { ossupload } from '@/api/ossUploadFile'
  import { mapGetters } from 'vuex'
  export default {
    name: 'brandInfo',
    data() {
      var joinFeeMin = (rule, value, callback) => {
        let joinFeeMaxVal = this.$refs.joinFeeMax.value;
        if(joinFeeMaxVal == '' && value != '' || joinFeeMaxVal != '' && value != ''){
          if (parseInt(value) > parseInt(joinFeeMaxVal)) {
            callback(new Error('最小值不能大于最大值'))
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
      return {
        loading: true,
        wikiBrandId: '',
        informationForm: {
          name: '',
          feesToJoinFrom: '',
          feesToJoinTo: '',
          headOfficeProvince: '',
          headOfficeCity: '',
          categoryId: '',
          weight: '',
          logoUrl: [],
          company: {
            name: '',
            website: '',
            legalPerson: '',
            score: '',
            phone: '',
            email: '',
            regCapital: '',
            regDate: '',
            businessCirclesNumber: '',
            regStatus: '',
            creditCode: '',
            orgNumber: '',
            orgType: '',
            taxNumber: '',
            industry: '',
            operatingPeriod: '',
            staffNumRange: '',
            actualCapital: '',
            regInstitute: '',
            socialStaffNum: '',
            regLocation: '',
            filingNo: '',
            filingGovernment: '',
            filingDate: '',
            filingAddress: '',
            filingEmail: '',
            filingPhone: '',
            filingBrand: '',
            filingNatureOfPower: '',
            filingPowerNo: '',
            filingRegCategory: '',
            filingPowerDate: '',
            filingPowerTerm: '',
            filingPic: []
          }
        },
        formRules: {
          name: [
            { required: true, message: '请填写品牌名称', trigger: 'blur' }
          ],
          feesToJoinFrom: [
            { validator: joinFeeMin, trigger: 'blur' }
          ],
          headOfficeProvince: [
            { required: true, message: '请选择城市', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '请选择品类', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '请填写品牌权重', trigger: 'blur' }
          ],
          'company.name': [
            { required: true, message: '请填写公司名称', trigger: 'blur' }
          ],
          'company.legalPerson': [
            { required: true, message: '请填写公司法人', trigger: 'blur' }
          ],
          'company.regCapital': [
            { required: true, message: '请填写注册资本', trigger: 'blur' }
          ],
          'company.regDate': [
            { required: true, message: '请选择成立日期', trigger: 'blur' }
          ],
          'company.regStatus': [
            { required: true, message: '请填写公司经营状态', trigger: 'blur' }
          ],
          'company.creditCode': [
            { required: true, message: '请填写公司信用代码', trigger: 'blur' }
          ],
          'company.regLocation': [
            { required: true, message: '请填写公司注册详细地址', trigger: 'blur' }
          ]
        },
        brandBelongSF: '',
        brandBelongCS: '',
        initCityList: [],
        provinceList: [],
        cityL2List: [],
        initcategorL1: [],
        initcategorL2: [],
        categorL2List: [],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    computed: {
      ...mapGetters([
        'cityList'
      ])
    },
    created() {
      /*获取一级省市与二级市*/
      this.initCityList = JSON.parse(JSON.stringify(this.cityList))
      this.cityList.forEach(item => {
        this.provinceList.push(item.name)
      })
      /*获取品牌id以及品类*/
      this.wikiBrandId = this.$route.query.id
      this.getALLcategorList();
    },
    watch:{
      loading:function(newVal) {
        if(newVal == false){
          /*有品牌id即为修改否则就是新增*/
          if(this.wikiBrandId){
              this.getBrandDetail()
          }
        }
      }
    },
    methods: {
      getALLcategorList() {
        /*获取所有品类*/
        this.requestApi.getCategoryList({ level: 1 }).then(res => {
          this.initcategorL1 = res.data
        })
        this.requestApi.getCategoryList({ level: 2 }).then(res => {
          this.loading = false;
          this.initcategorL2 = res.data;
        })
      },
      /*获取品牌基本信息*/
      getBrandDetail() {
        this.requestApi.getWikiBrandDetail({ id: this.wikiBrandId }).then(res => {
          let data = JSON.parse(JSON.stringify(res.data))
          /*品牌logo改为数组*/
          if (data.logoUrl) {
            let pushInfo = {}
            pushInfo.url = data.logoUrl
            let setPIC = []
            setPIC.push(pushInfo)
            data.logoUrl = setPIC
          } else {
            data.logoUrl = []
          }
          /*备案截图改为数组*/
          if (data.company.filingPic) {
            let pushInfo02 = {}
            pushInfo02.url = data.company.filingPic
            let setPIC02 = []
            setPIC02.push(pushInfo02)
            data.company.filingPic = setPIC02
          } else {
            data.company.filingPic = []
          }
          this.informationForm = data
          if (this.informationForm.company.filingDate.indexOf('-') == -1) {
            this.informationForm.company.filingDate = null
          }
          if (this.informationForm.company.filingPowerDate.indexOf('-') == -1) {
            this.informationForm.company.filingPowerDate = null
          }
          if (this.informationForm.company.filingPowerTerm.indexOf('-') == -1) {
            this.informationForm.company.filingPowerTerm = null
          }
          if(this.informationForm.categoryId){
            this.informationForm.categoryId = parseInt(this.informationForm.categoryId)
          }else{
            this.informationForm.categoryId = ''
          }
          if(this.informationForm.category){
            this.informationForm.categoryparentId = this.informationForm.category.parent.id
          }else{
            this.informationForm.categoryparentId =''
          }
          /*
          * 回填时，根据返回的参数渲染城市以及品类的二级列表
          * */
          if (this.informationForm.categoryparentId) {
            this.categorL2List = this.initcategorL2.filter(item => {
              return item.parentId == this.informationForm.categoryparentId
            })
          }
          if(this.informationForm.headOfficeProvince){
            let findCity = this.initCityList.filter(item => {
              return item.name == this.informationForm.headOfficeProvince
            })
            if(findCity !=''){
              this.cityL2List = findCity[0].cityList
            }
          }
        })
      },
      /*选择二级市*/
      selectProvince(e) {
        this.informationForm.headOfficeCity = ''
        this.cityL2List = []
        let findCity = this.initCityList.filter(item => {
          return item.name == e
        })
        this.cityL2List = findCity[0].cityList
      },
      /*选择二级分类*/
      selectCategorL2(e) {
        this.categorL2List = [];
        this.informationForm.categoryId = ''
        this.categorL2List = this.initcategorL2.filter(item => {
          return item.parentId == e
        })
      },
      /*封装oss上传*/
      uploader(_index, param, type) {
        ossupload.ossuploadFile('', param.file, 'wikiBrand').then(pictureUrl => {
          let pushInfo = {}
          pushInfo.url = pictureUrl
          if (type == 'logoUrl') {
            this.informationForm.logoUrl.push(pushInfo)
          } else if (type == 'filingPic') {
            this.informationForm.company.filingPic.push(pushInfo)
          }
        })
      },
      beforeRemove(file, fileList, type) {
        let _this = this
        setTimeout(function() {
          if (type == 'logoUrl') {
            _this.informationForm.logoUrl = []
          } else if (type == 'filingPic') {
            _this.informationForm.company.filingPic = []
          }
        }, 400)
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      submitInfoBtn(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _informationForm = JSON.parse(JSON.stringify(this.informationForm))
            /*备案截图以及品牌logo 后台传值改为字符串*/
            console.log(_informationForm.logoUrl[0])
            if(_informationForm.logoUrl[0]){
              _informationForm.logoUrl = _informationForm.logoUrl[0].url
            }else{
              _informationForm.logoUrl = ''
            }
            if(_informationForm.company.filingPic[0]){
              _informationForm.company.filingPic = _informationForm.company.filingPic[0].url
            }else{
              _informationForm.company.filingPic = ''
            }
            /*品牌regDate == company的regDate*/
            _informationForm.regDate = _informationForm.company.regDate;
            if(this.wikiBrandId){
              /*修改已有品牌信息时，删除不需要回传的字段*/
              delete _informationForm.categoryparentId
              delete _informationForm.category
              delete _informationForm.company.id

              this.requestApi.updateWikiBrandDetail(_informationForm).then(res => {
                this.$alert('基本信息编辑成功', '通知', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path: `/brandWiki/brand/brandLibrary`
                    })
                  }
                })
              })
            }else{
              /*新增品牌信息*/
              this.requestApi.addWikiBrandDetail(_informationForm).then(res =>{
                this.$alert('新增品牌成功', '通知', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path: `/brandWiki/brand/brandLibrary`
                    })
                  }
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .brandInfo .el-form-item {
    padding-right: 5%;
  }
  .brandInfo .el-upload--picture-card {
    height: auto;
    width: auto;
    line-height: 0;
    border: none;
  }
  .brandInfo input::-webkit-outer-spin-button,
  .brandInfo input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .brandInfo input[type="number"] {
    -moz-appearance: textfield;
  }
  .brandInfo .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .brandInfo .el-upload-list--picture-card .el-upload-list__item {
    margin: 0;
  }
  .brandInfo .el-loading-spinner{
    top: 25% !important;
  }
</style>
<style lang="scss" scoped>
  .w32 {
    width: 32%;
  }
  .w40 {
    width: 40%;
  }
  .w48 {
    width: 48%;
  }
  .w50 {
    width: 50%;
  }
  .w85 {
    width: 85%;
  }
  .w100 {
    width: 100%;
  }
  .mt-15 {
    margin-top: 15px;
  }
  .d-i {
    display: inline;
  }
  .wAuto {
    width: auto;
  }
  .page_title {
    padding-bottom: 10px;
  }
</style>
