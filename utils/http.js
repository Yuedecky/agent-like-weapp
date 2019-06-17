import {
  Config
} from '../config.js'
const tips = {
  500: '',
  1000: '用户未登录',
}
class Http {
  request({
    url,
    data = {},
    method = 'GET'
  }) {
    const token = wx.getStorageSync('token')
    return new Promise((resolve, reject) => {
      this._request(token, url, resolve, reject, data, method)
    })
  }
  _request(token, url, resolve, reject, data = {}, method = 'GET') {
    wx.request({
      url: Config.apiUrl + url,
      method: method,
      data: data,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: token
      },
      success: (res) => {
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          reject()
          const errorMsg = res.data.msg
          this._showError(errorMsg)
        }
      },
      fail: (err) => {
        reject()
        this._show_error(1)
      }
    })
  }

  _showError(errMsg) {
    wx.showToast({
      title: errMsg,
      icon: 'none',
      duration: 2000
    })
  }


}

export {
  Http
}