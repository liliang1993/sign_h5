<!--
 * @Description: 
 * @Author: ll
 * @Date: 2021-08-19 18:27:29
 * @LastEditors: ll
 * @LastEditTime: 2021-08-19 18:38:57
 * @FilePath: /vue-h5-template/src/views/uploadIdCard.vue
-->
<template>
  <div class="upload-idCard-container">
    <div>
      <van-uploader>
        <!-- <van-button icon="plus" type="primary">上传文件</van-button> -->
        <div class="front-container">上传身份证正面</div>
      </van-uploader>
    </div>
    <div>
      <van-uploader>
        <div class="back-container">上传身份证正面</div>
      </van-uploader>
    </div>
    <van-button block type="primary"> 提交身份证信息 </van-button>
  </div>
</template>

<script>
export default {
    
}
</script>

<style></style>
