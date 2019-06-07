var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['待配送', '配送中','已完成'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    silderWidth: 110,

    orderToSend:[],
    orderSending:[],
    orderSent:[]
  },

  cancelOrderSending:function(e){
    let that = this;
    let orderId = e.currentTarget.dataset.orderId;
    let auth = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.cancel) {
        } else {
           that.cancelOrder(auth, orderId, that)
            wx.reLaunch({
              url: '/pages/send/send?activeIndex=2',
            })
        }
      }
    })
  },
  cancelOrderToSend:function(e){
    let that = this;
    let orderId = e.currentTarget.dataset.orderId;
    let auth = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success:function(res){
          if(res.cancel){
          }else{
           that.cancelOrder(auth,orderId,that)
             wx.reLaunch({
               url: '/pages/send/send?activeIndex=2',
             })
          }
      }
    })
  },

/**
 * 取消订单
 */
  cancelOrder:function(auth,orderId,that){
    wx.request({
      url: app.globalData.serverUrl + 'order/cancel',
      header: {
        'Authorization': auth
      },
      data:{
        orderId: orderId
      },
      success:function(res){
        let data = res.data;
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:1500,
          })
          return false;
        }
        return true;
      }
    })
  },

  sendFinished:function(e){

    let orderId = e.currentTarget.dataset.orderId;
    let auth = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '该订单确定已配送完成',
      success:function(e){
        if(e.cancel){

        }else{
          //
          wx.request({
            url: app.globalData.serverUrl+'delivery/complete',
            data:{
              orderId: orderId
            },
            header:{
              "authorization":auth
            },success:function(res){
              let data = res.data;
              if(data.status !=200){
                wx.showToast({
                  title: data.msg,
                  duration:1500,
                  icon:'none'
                })
              }else{
                wx.reLaunch({
                  url: '/pages/send/send?activeIndex=2',
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.editTabbar();
    var that = this;
    that.setData({
      activeIndex: options.activeIndex || 0
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
    let activeIndex = that.data.activeIndex;
    let auth = wx.getStorageSync('token')
    that.switchTabIndex(activeIndex, auth)
  },
  switchTabIndex: function (index, auth) {
    let that = this;
    if (index == 0) {
      //代配送
      let status = [1].join(',')
      wx.request({
        url: app.globalData.serverUrl + 'order/listV2',
        data: {
          status: status,
          pageNum:1,
          pageSize:100
        },
        header: {
          'Authorization': auth
        },
        success: function (res) {
          let data = res.data;
          console.log('代配送：',data)
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            that.setData({
              orderToSend: data.data.data,
            })
          }
        }
      })
    } else if(index ==1){
      let status = [2].join(',')
      wx.request({
        url: app.globalData.serverUrl + 'order/listV2',
        data: {
          status: status,
          pageNum:1,
          pageSize:100
        },
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
            if(data.data.data !=null){
              that.setData({
                orderSending: data.data.data,
              })
            }
          }
        }
      })
    }else{
      let status = [4,8].join(',')
      wx.request({
        url: app.globalData.serverUrl + 'order/listV2',
        data: {
          status: status,
          pageNum:1,
          pageSize:100
        },
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
            console.log('已完成配送:', data.data)
            if(data.data!=null){
              that.setData({
                orderSent: data.data.data,
              })
            }
          }
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  tabClick: function (e) {
    let that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    let id = e.currentTarget.id;
    let auth = wx.getStorageSync('token')
    that.switchTabIndex(Number(id), auth)
  },

  beginSend:function(e){
    let orderId= e.currentTarget.dataset.orderId;
    let auth = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.serverUrl+'delivery/begin',
      header:{
        'Authorization':auth
      },
      data:{
        orderId: orderId
      },
      success:function(e){
        let data = e.data;
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:1500
          })
        }else{
          wx.reLaunch({
            url: '/pages/send/send?activeIndex=1',
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '请求错误，请联系客服',
          duration:1500,
          icon:'none'
        })
      }
    })
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