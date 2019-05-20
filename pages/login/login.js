const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoName: '',
    logoUrl:'',
    loginDisabled: false,
    codeDisabled:false,
    phone: '',
    code:'',
    text:'获取验证码',
    currentTime: 60
  },

  onApplyOpen:function(e){
    wx.navigateTo({
      url: '/pages/apply/apply?pageIndex=2',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      logoName: app.appData.logoName,
      logoUrl: app.appData.logoUrl,
    })
  },

getPhoneValue:function(e){
    this.setData({
      phone: e.detail.value
    })
},
getCodeValue:function(e){
  this.setData({
    code:e.detail.value
  })
},
  getCode:function(e){
    let that = this;
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var phone = that.data.phone;
    var currentTime = that.data.currentTime //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (phone == '' || phone == undefined) {
      warn = "手机号码不能为空";
    } else if (phone.trim().length != 11 || ! phoneReg.test(phone)) {
      warn = "手机号格式不正确";
    } else {
      //当手机号正确的时候提示用户短信验证码已经发送
      wx.showToast({
        title: '短信验证码已发送',
        icon: 'none',
        duration: 2000
      });
    }

    

      //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
      if (warn != null) {
        wx.showModal({
          title: '提示',
          content: warn
        })

        that.setData({
          codeDisabled: false,
          color: '#59b550'
        })
        return;
      }else{
        wx.request({
          url: '',
          success:function(res){
            that.setData({
              isCode: res.data.isCode
            })
          }
        })
      }

    //设置一分钟的倒计时
    var interval = setInterval(function () {
      currentTime--; //每执行一次让倒计时秒数减一
      that.setData({
        codeDisabled: true,
        text: currentTime + 's', //按钮文字变成倒计时对应秒数
      })
      //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          text: '重新发送',
          currentTime: 61,
          codeDisabled: false,
          color: '#59b550'
        })
      }
    }, 1000);
  },

  //提交表单信息
  submitInfo: function () {
    var phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    let that = this;
    if (that.data.phone == "" || that.data.phone == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!phoneReg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (that.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (that.data.code != '1111') {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.setStorageSync('phone', this.data.phone);
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})