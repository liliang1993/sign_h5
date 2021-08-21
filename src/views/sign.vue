<!--
 * @Description: sign
 * @Author: ll
 * @Date: 2021-08-18 21:48:00
 * @LastEditors: ll
 * @LastEditTime: 2021-08-21 13:12:56
 * @FilePath: /vue-h5-template/src/views/sign.vue
-->
<template>
  <div class="index-container">
    <div id="pdfDom">
      <div class="agreement-wrapper">
        <h2>承诺书</h2>
        <p>
          本人/单位系深圳深中源科技有限公司电子烟产品的经销商，关于经销深圳深中源科技有限公司电子烟事宜，本人/单位在此向深圳深中源科技有限公司作出以下承诺：
        </p>
        <p>
          在推广、销售深圳深中源科技有限公司的电子烟等产品过程中，本人/单位承诺遵守国家法律法规、国家政策、公司规章制度以及公序良俗，不向未成年人及孕妇、哺乳期妇女、重大疾病患者及其他不适合使用电子烟的人员出售，坚决不在不允许经营的场所推广、销售，不在微信朋友圈、线上商城、自动贩卖机、车载便利店和烟草等渠道开展推广、销售。否则，造成的一切后果全部由本人承担负责，深圳深中源科技有限公司因此遭受损失的，损失由本人/单位承担。深圳深中源科技有限公司可以根据实际情况需要调整、更新规章制度，本人/单位承诺无条件遵守深圳深中源科技有限公司更新后的规定。
        </p>
        <p>特此承诺！</p>
      </div>
      <div class="sign-show-wrapper">
        <img v-if="url" width="200" height="100%" :src="url" alt="" />
        <p>{{ signDate }}</p>
      </div>
    </div>
    <div class="action-wrap">
      <!-- <div class="sign-show-box">
        <img v-if="url" width="100" height="auto" :src="url" alt="" />
        <span v-else>签名显示处</span>
      </div> -->
      <!-- <van-button style="flex: 1; height: 100%" type="primary" @click="handlePostMessage">测试返回小程序</van-button> -->
      <van-button style="flex: 1; height: 100%" :type="url ? 'danger' : 'info'" @click="showSignPad = true">{{
        url ? '重签' : '签名'
      }}</van-button>
      <van-button style="flex: 1; height: 100%" type="info" v-show="url" @click="getPdf">同意</van-button>
    </div>
    <div v-if="showSignPad" class="sign-wrap">
      <div class="sign-head">
        <div class="title">用户签名</div>
      </div>
      <signature ref="signature"></signature>
      <div class="sign-bottom">
        <div class="button-wrapper">
          <van-button id="reset" @click="showSignPad = false"> 取消 </van-button>
          <van-button id="reset" @click="reset"> 重置 </van-button>
          <van-button id="get" @click="getData"> 确定 </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadFile, uploadPDF } from '@/api/upload.js'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import wx from 'weixin-js-sdk'
import moment from 'moment'

export default {
  data() {
    return {
      signDate: '',
      value: null,
      options: {
        // isFullScreen: true,
        isDpr: false, // 是否使用dpr兼容高倍屏 [Boolean] 可选
        lastWriteSpeed: 1, // 书写速度 [Number] 可选
        lastWriteWidth: 2, // 下笔的宽度 [Number] 可选
        lineCap: 'round', // 线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
        lineJoin: 'bevel', // 线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
        canvasWidth: 350, // canvas宽高 [Number] 可选
        canvasHeight: 370, // 高度  [Number] 可选
        isShowBorder: true, // 是否显示边框 [可选]
        bgColor: '#fcc', // 背景色 [String] 可选
        borderWidth: 1, // 网格线宽度  [Number] 可选
        borderColor: '#ff787f', // 网格颜色  [String] 可选
        writeWidth: 5, // 基础轨迹宽度  [Number] 可选
        maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
        minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
        writeColor: '#101010', // 轨迹颜色  [String] 可选
        isSign: true, // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        imgType: 'png' // 下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      },
      url: '',
      showSignPad: false,
      htmlTitle: '协议',
      imgUrl: ''
    }
  },
  watch: {
    url(val) {
      this.signDate = moment(new Date()).format('yyyy年MM月DD日')
    }
  },
  methods: {
    reset() {
      console.log(" this.$refs['signature']", this.$refs['signature'])
      this.$refs['signature'].reset()
    },
    getData() {
      const file = this.$refs['signature'].getFile()
      const blob = this.$refs['signature'].getBase64PNG()
      console.log('file', file, blob)
      this.rotateBase64Img(blob, 270, value => {
        console.log('value', value)
        this.url = value
        this.showSignPad = false
      })
    },

    rotateBase64Img(src, edg, callback) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var imgW //图片宽度
      var imgH //图片高度
      var size //canvas初始大小
      if (edg % 90 != 0) {
        console.error('旋转角度必须是90的倍数!')
        throw '旋转角度必须是90的倍数!'
      }
      edg < 0 && (edg = (edg % 360) + 360)
      const quadrant = (edg / 90) % 4 //旋转象限
      const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 } //裁剪坐标
      var image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = src
      image.onload = () => {
        imgW = image.width
        imgH = image.height
        size = imgW > imgH ? imgW : imgH
        canvas.width = size * 2
        canvas.height = size * 2
        switch (quadrant) {
          case 0:
            cutCoor.sx = size
            cutCoor.sy = size
            cutCoor.ex = size + imgW
            cutCoor.ey = size + imgH
            break
          case 1:
            cutCoor.sx = size - imgH
            cutCoor.sy = size
            cutCoor.ex = size
            cutCoor.ey = size + imgW
            break
          case 2:
            cutCoor.sx = size - imgW
            cutCoor.sy = size - imgH
            cutCoor.ex = size
            cutCoor.ey = size
            break
          case 3:
            cutCoor.sx = size
            cutCoor.sy = size - imgW
            cutCoor.ex = size + imgH
            cutCoor.ey = size + imgW
            break
        }
        ctx.translate(size, size)
        ctx.rotate((edg * Math.PI) / 180)
        ctx.drawImage(image, 0, 0)
        var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey)
        if (quadrant % 2 === 0) {
          canvas.width = imgW
          canvas.height = imgH
        } else {
          canvas.width = imgH
          canvas.height = imgW
        }
        ctx.putImageData(imgData, 0, 0)
        // $('textarea', $tools).val(canvas.toDataURL())
        callback(canvas.toDataURL())
      }
    },

    handleAgree() {
      const params = new FormData()
      const blob = this.dataURLtoBlob(this.url)
      const file = this.blobToFile(blob)
      params.append('file', file)
      uploadFile(params)
        .then(res => {})
        .catch(e => {
          console.log('e')
        })
    },

    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    //将blob转换为file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },

    getPdf() {
      var title = this.htmlTitle
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
      }).then(canvas => {
        var contentWidth = canvas.width
        var contentHeight = canvas.height
        var pageHeight = (contentWidth / 592.28) * 841.89
        var leftHeight = contentHeight
        var position = 0
        var imgWidth = 595.28
        var imgHeight = (592.28 / contentWidth) * contentHeight
        var pageData = canvas.toDataURL('image/jpeg', 1.0)
        // var PDF = new JsPDF('', 'pt', 'a4')
        // // PDF.setProperties({
        // //   title: 'PDF Title'
        // // })
        // if (leftHeight < pageHeight) {
        //   PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        // } else {
        //   while (leftHeight > 0) {
        //     PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        //     leftHeight -= pageHeight
        //     position -= 841.89
        //     if (leftHeight > 0) {
        //       PDF.addPage()
        //     }
        //   }
        // }
        // // PDF.save('签名.pdf')
        // this.pdfData = PDF.output('blob')
        // console.log(PDF)
        const params = new FormData()
        const blob = this.dataURLtoBlob(pageData)
        const file = this.blobToFile(blob)
        params.append('file', file)
        // params.append('name', 'sign.pdf')
        uploadFile(params)
          .then(res => {
            console.log('res', res)
            const { url } = res
            this.imgUrl = url
            this.handlePostMessage()
          })
          .catch(e => {
            console.log('e')
          })
      })
    },

    handlePostMessage() {
      wx.miniProgram.postMessage({
        data: {
          info: '返回数据了'
        }
      })
      wx.miniProgram.navigateTo({
        url: '/pages/upload/upload?url=' + this.imgUrl
      })
    }
  }
}
</script>

<style>
.index-container {
  font-size: 14px;
  /* padding: 10px 0 100px; */
  overflow: scroll;
}
#pdfDom {
  padding: 0 10px;
}
.agreement-wrapper > h2 {
  text-align: center;
}
.agreement-wrapper > p {
  text-indent: 2em;
}
.sign-canvas {
  display: block;
  /* margin: 20px auto; */
}
.action-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  height: 50px;
  width: 100%;
}
.sign-show-wrapper {
  text-align: right;
  padding-bottom: 10px;
}
.sign-show-wrapper p {
  margin: 0;
}
.sign-show-box {
  width: 100px;
  text-align: center;
  line-height: 50px;
}
.sign-wrap {
  position: fixed;
  display: flex;
  flex-direction: row-reverse;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  background: #fff;
  animation: show 0.5s;
}

@keyframes show {
  0% {
    transform: rotate(-40deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.sign-head {
  background: #ccc;
  position: relative;
  width: 60px;
  overflow: hidden;
  /* width: 100vh; */
  /* right:15px;
  top: 300px;
  display: flex;
  align-items: center;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg); */
  /* right: -50px; */
}
.title {
  width: 80px;
  text-align: center;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: -14px;
  transform: translate(-50%, -50%);
  transform: rotate(90deg);
}
.sign-bottom {
  /* position: absolute;
  top: 300px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  right: 240px;
  display: flex;
  align-items: center; */
  position: relative;
  background-color: #ccc;
  width: 100px;
}
.button-wrapper {
  display: flex;
  justify-content: space-between;
  width: 400px;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 35px;
  transform: translate(-50%, -50%) rotate(90deg);
}
button {
  height: 40px;
  width: 100px;
}
</style>
