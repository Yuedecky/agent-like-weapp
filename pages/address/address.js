var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAddresses:[
      {
        id:1,
        name: '张三',
        phone:'182****1234',
        address:"浙江省杭州市金华路123号203"
      },
      {
        id:2,
        name: '李四',
        phone: '182****1234',
        address: "浙江省杭州市西湖区穿杨新苑号20号楼203"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this;
    // that.setData({

    // })
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
    // wx.request({
    //   url: app.appData.serverUrl + 'address/list',
    //   data:{
    //   },
    //   success:function(res){
    //   }
    // })
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