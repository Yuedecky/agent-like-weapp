var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs:['未完成','已完成'],
    activeIndex:0,
    sliderOffset: 0,
    sliderLeft:0, 
    silderWidth:110,


    // ====
    orderPTotal:0,
    orderPReturn: 0,
    ordersP:[],
    orderListProcessing:[
      {
        order:{
        id: 0,
        orderNo: '',
        status :0,
        totalPaymentPrice:'',
        totalRebatePrice:'',
      },
        orderDetails: [{
          goodsId: 0,
          name: '',
          coverImage: "",
          types: '',
          remark: '',
          platformPrice: 0.00,
          rebatePrice: 0,
          count: 0
        }]
      }],
    orderListFinished: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      activeIndex:options.activeIndex || 0
    })
    let sliderWidth = that.data.silderWidth;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    let auth = wx.getStorageSync('token')
    let status = JSON.stringify([1,2])
    wx.request({
      url: app.appData.serverUrl+'order/list',
      data:{
        status: status.replace('[','').replace(']','')
      },
      header:{
        'Authorization': auth
      },
      success:function(res){
        let data = res.data;
        if(data.status != 200){
          wx.showToast({
            title: data.msg,
            duration:2000,
            icon:'none'
          })
        }else{
          console.log(res)
          let ordersD =[]
          let ordersP = []
          for(var i=0;i<data.data.length;i++){
              ordersP.push(data.data[i].order)
              ordersP.d=[]
              ordersP.d.push(data.data[i].orderDetails)
          }
          that.setData({
            ordersP: ordersP,
            ordersD: ordersP.d
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  tabClick: function (e) {
    console.log('tabClick,e:',e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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