//app.js
import {
  CodeModel
} from './models/codeModel.js';
const codeModel = new CodeModel();
App({
  onLaunch: function() {
    this.getSystemInfo();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  checkTokenExpires: function() {
    codeModel.checkTokenExpire().then(res => {
      if (res.status != 200) {
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        })
      } else {
        if (!res.data) {
          wx.reLaunch({
            url: '/pages/home/home?currentTab=0',
            complete: function() {}
          })
          return
        }
      }
      wx.reLaunch({
        url: '/pages/login/login'
      })
    })
  },


  onShow: function(options) {
    //隐藏系统tabbar
    //1.检查网络状态
    this.checkNetStat();
    const path = options.path;
    const entries = ['pages/apply/apply']
    if(!entries.includes(path)){
      this.checkTokenExpires();
    }
  },

  getSystemInfo: function() {
    let t = this;
    wx.getSystemInfo({
      success: function(res) {
        t.globalData.systemInfo = res;
      }
    });
  },

  /**
   * 检查网络状态
   */
  checkNetStat: function() {
    let t = this;
    wx.getNetworkType({
      success: function(res) {
        let networkType = res.networkType
        t.globalData.networkType = networkType
      },
    })
  },


  globalData: {
    logoName: '微券加盟',
    logoUrl: 'https://xxx.your-domain.com/data/images/logo/logo.jpeg?timestamp=' + new Date(),
    version: 0.1,
    serverUrl: "https://www.your-domain.com/",
    networkType: '4G',
  }
})