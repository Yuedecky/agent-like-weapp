var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAddresses:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('address onload:',options)
    let that = this;
    let auth = wx.getStorageSync('token')
    wx.request({
      url: app.appData.serverUrl +'address/list',
      header:{
        'Authorization':auth
      },
      success:function(res){
        let data = res.data;
        console.log(data);
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            duration:2000,
            icon:'none'
          })
        }else{
          let addrList = data.data;
          for(var i=0;i<addrList.length;i++){
            if(addrList[i].defaultChoose ==1){
              addrList[i].defaultAddr = true
            }else{
              addrList[i].defaultAddr = false
            }
          }
          that.setData({
            myAddresses: addrList
          })
        }
      }
    })
  },


onEditAddress:function(e){
 let aid = e.currentTarget.dataset.id;
 wx.navigateTo({
   url: '/pages/address/edit/edit?id='+aid
 })
},
addAddress:function(){
  wx.navigateTo({
    url: '/pages/address/edit/edit?title=新增收货地址',
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