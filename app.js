//app.js
App({
  onLaunch: function () {
    this.getSystemInfo();
    let auth = wx.getStorageSync('token')
    if(auth){
      wx.request({
        url: this.globalData.serverUrl + 'user/token/expires',
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
            }else{
              wx.reLaunch({
                url: '/pages/home/home?currentTab=0',
              })
            }
          }
        },
        fail:function(e){
          wx.showToast({
            title: '请求失败，请稍候重试',
            duration:2000,
            icon:'none'
          })
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


  onShow: function () {
    //隐藏系统tabbar
    //1.检查网络状态
    this.checkNetStat();
    //2.
  },
  
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },

/**
 * 检查网络状态
 */
  checkNetStat:function(){
    let t = this;
    wx.getNetworkType({
      success: function(res) {
          let networkType = res.networkType
          t.globalData.networkType = networkType
      },
    })
  },

  editTabbar: function () {
    let tabbar = this.globalData.tabbars;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    logoName: '微券加盟',
    logoUrl: 'https://www.wqyp.shop/data/images/logo/logo.jpeg?timestamp='+new Date(),
    version: 0.1,
    serverUrl:"https://www.wqyp.shop/",
    tabbars:[],
    networkType: '4G'
  }
})