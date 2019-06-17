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
}

export {CodeModel}