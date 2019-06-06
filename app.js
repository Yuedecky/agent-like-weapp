//app.js
App({
  onLaunch: function () {
    let auth = wx.getStorageSync('token')
    if(auth){
      wx.request({
        url: this.appData.serverUrl + 'user/token/expires',
        header: {
          'Authorization': auth
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            if (data.data) {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          }
        }
      })
    }else{
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    
    // 展示本地存储能力
    
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
  appData: {
    logoName: '微券加盟',
    logoUrl: 'http://image.qfstatic.com/897/2019/201904/20190429/8D5C9103C78643A190513340FA3FA294.jpeg',
    version: 0.1,
    serverUrl:"https://www.wqyp.shop/",
    tabbars:[]
  }
})