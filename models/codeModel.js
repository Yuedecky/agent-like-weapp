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

  verifyCodeSend(phone, type) {
    return this.request({
      url: "verify/code/send",
      method: 'POST',
      data: {
        phone: phone,
        type: type
      }
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

  sendCode(phone, type) {
    return this.request({
      url: 'verify/code/send',
      method: 'POST',
      data: {
        phone: phone,
        type: type
      }
    })
  }
}

export {
  CodeModel
}