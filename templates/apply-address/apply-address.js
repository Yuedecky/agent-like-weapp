Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolName: '',
    schoolAddress:'',
    roomNo:'',

    provinces: [],
    citys: [],
    countys: [],
    value: [0, 0, 0],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      that.setData({
        schoolAddress:options.schoolAddress,
        schoolName:options.schoolName,
        roomNo:options.roomNo,
        provinces:options.provinces,
        citys:options.citys,
        countys:options.countys,
        value:options.value
      })
  },

  getSchoolNameValue:function(e){
    let that = this;
    that.setData({
      schoolName: e.detail.value
    })
  },

  getSchoolAddressValue:function(e){
    let that = this;
    that.setData({
      schoolAddress: e.detail.value
    })
  },

  getRoomNoValue:function(e){
    let that = this;
    that.setData({
      roomNo:e.detail.value
    })
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