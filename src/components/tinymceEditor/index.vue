<template>
  <div class="tinymce-editor">
    <editor v-model="myValue"
            :init="init"
            @onClick="onClick">
    </editor>
  </div>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/icons/default/icons.min.js'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/skins/ui/oxide/skin.css'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/code'
  import { ossupload } from '@/api/ossUploadFile'
  export default {
    components: {
      Editor
    },
    props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu code'
      },
      toolbar1: {
        type: [String, Array],
        default: 'undo redo |  formatselect | fontselect | fontsizeselect | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify'
      },
      toolbar2: {
        type: [String, Array],
        default: 'code | bullist numlist outdent indent | lists image media table | removeformat'
      }
    },
    data() {
      return {
        //初始化配置
        init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/lightgray',
          height: 300,
          plugins: this.plugins,
          toolbar1: this.toolbar1,
          toolbar2: this.toolbar2,
          branding: false,
          fontsize_formats:'12px 14px 18px 20px 22px 24px 26px 28px',
          menubar: 'edit format table',
          menu: {
            edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
            format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
            table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
          },
          images_upload_handler: (blobInfo, success, failure) => {
            /*
              根据实际情况更换获取签名的地址
              advert =》 广告
            */
            ossupload.ossuploadFile('',blobInfo.blob(),'advert').then(pictureUrl => {
              success(pictureUrl)
            })
          },
          file_picker_types: 'media',
          file_picker_callback: function(cb, value, meta) {
            //当点击meidia图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
            if (meta.filetype == 'media'){
              //创建一个隐藏的type=file的文件选择input
              let input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.onchange = function(){
                let file = this.files[0];//只选取第一个文件。如果要选取全部，后面注意做修改
                ossupload.ossuploadFile('',file,'advert').then(videoUrl => {
                  /*视频地址等信息显示在弹窗输入框中*/
                  cb(videoUrl, { title: file.name });
                })
              }
              //触发点击
              input.click();
            }
          }
        },
        myValue: this.value
      }
    },
    mounted() {
      tinymce.init({})
    },
    methods: {
      //事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
      //需要什么事件可以自己增加
      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = ''
      }
    },
    watch: {
      value(newValue) {
        this.myValue = newValue
      },
      myValue(newValue) {
        this.$emit('input', newValue)
      }
    }
  }

</script>
<style scoped>
</style>
