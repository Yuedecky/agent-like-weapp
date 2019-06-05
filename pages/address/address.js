var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAddresses:[],
  },

  
  onLongTapAddress:function(e){
    let that = this;
    let aid = e.currentTarget.dataset.id;
    let auth = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '确定删除该地址？',
      success:function(res){
        if(res.cancel){

        }else{
          wx.request({
            url: app.appData.serverUrl + 'address/delete',
            header:{
              'Authorization':auth
            },
            data:{
              addressId: aid
            },
            success:function(e){
              let data = e.data;
              console.log(data)
              if(data.status != 200){
                wx.showToast({
                  title: data.msg,
                  icon:'none',
                  duration:1500
                })
              }else{
                wx.showToast({
                  title: '删除地址成功',
                  duration:1500,
                  icon:'success'
                })
                wx.switchTab({
                  url: '/pages/address/address',
                })
                that.loadAddressList(auth,that)
              }
            },
            fail:function(e){
              wx.showToast({
                title: '请求失败',
                duration:2000,
                icon:'none'
              })
            }
          })
        }
      }
    })
  },

  onCatchAddressTap:function(e){
    let that = this;
    let auth = wx.getStorageSync('token')
    let aid = e.currentTarget.dataset.id;
    wx.request({
      url: app.appData.serverUrl+'address/set/default',
      header:{
        'Authorization':auth
      },
      data:{
        addressId: aid
      },
      success:function(res){
        let data = res.data;
        if(data.status != 200){
          wx.showToast({
            title: data.msg,
            duration:1500,
            icon:'success'
          })
        }else{
          wx.reLaunch({
            url: '/pages/cart/cart',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let auth = wx.getStorageSync('token')
    this.loadAddressList(auth,this)
  },

  loadAddressList:function(auth,that){
    wx.request({
      url: app.appData.serverUrl + 'address/list',
      header: {
        'Authorization': auth
      },
      success: function (res) {
        let data = res.data;
        console.log(data);
        if (data.status != 200) {
          wx.showToast({
            title: data.msg,
            duration: 2000,
            icon: 'none'
          })
        } else {
          let addrList = data.data;
          console.log(addrList)
          for (var i = 0; i < addrList.length; i++) {
            if (addrList[i].defaultChoose == 1) {
              addrList[i].defaultAddr = true
              addrList[i].addressImg = '/assets/images/address.png'
            } else {
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