Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname:'',
    applyPhone:'',
    applyCode:'',
  },

  getRealNameValue:function(e){
    let that = this;
    that.setData({
      realname: e.detail.realname
    })
  },
  getPhoneValue:function(e){
    let that = this;
    that.setData({
      applyPhone: e.detail.applyPhone
    })
  },
  getCodeValue:function(e){
    let that = this;
    that.setData({
      applyCode: e.detail.applyCode
    })
  },
  nextStepOne: function (e) {
    console.log(e)
    let that = this;
    let realname=that.data.realname;
    let applyPhone = that.data.applyPhone;
    let applyCode = that.data.applyCode;
    let warn = '';
    if(realname =='' || realname == undefined){
      warn = '请填写真实姓名';
    }else if(applyPhone == '' || applyPhone == undefined){
      warn = '请填写手机号';
    }else if(applyCode =='' || applyCode == undefined){
      warn = '请输入验证码';
    }
    if(warn != ''){
      wx.showModal({
        title: '提示',
        content: warn,
        duration:2000
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
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