/*
 * @Description:
 * @Author: ll
 * @Date: 2021-08-19 10:39:28
 * @LastEditors: ll
 * @LastEditTime: 2021-08-20 10:53:14
 * @FilePath: /vue-h5-template/src/api/upload.js
 */
import api from './index'
// axios
import request from '@/utils/request'

// 用户名称 get 方法
export function uploadFile(params) {
  return request({
    url: api.UploadFile,
    method: 'post',
    data: params,
    headers: {
      'content-type': 'multipart/form-data'
    },
    timeout: 120000
  })
}
export function uploadPDF(params) {
  return request({
    url: api.UploadPDF,
    method: 'post',
    data: params,
    headers: {
      'content-type': 'application/json'
    },
    timeout: 120000
  })
}
