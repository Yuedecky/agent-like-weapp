import {
  Http
} from '../utils/http.js';
class CodeModel extends Http {
  preCheck(code, phone, type) {
    return this.request({
      url: 'verify/code/pre/check',
      data: {
        phone: phone,
        verifyCode: code,
        type: type
      },
      method: 'POST'
    })
  }

  checkTokenExpire() {
    const token = wx.getStorageSync('token')
    return this.request({
      url: 'user/token/expires',
      method: 'GET',
      header: {
        Authorization: token
      }
    })
  }
}

export {
  CodeModel
}