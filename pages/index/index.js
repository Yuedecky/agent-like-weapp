var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brands: [
      {
        id:'',
        code: 0,
        name: "",
        ishaveChild: true,
        logo:''
      },
    ],
    products:[],
    current: 0, //当前选中的cate_id
    index: 0 // 当前选中的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
  },

  onAddCart:function(e){
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    let auth = wx.getStorageSync('token')
    
    wx.request({
      url: app.appData.serverUrl+'choose/add',
      data:{
        goodsId: pid,
        count:1
      },
      header:{
        'Authorization': auth
      },
      success:function(res){
        let data = res.data;
        if(data.status!=200){
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:2000
          })
        }else{
          wx.showToast({
            title: '加购成功',
            duration: 2000,
            icon: 'success'
          })
        }
      }
    })
  },

  onClick: function (e) {
    let that = this;
    let bid = e.currentTarget.dataset.bid;
    let brandCode = e.currentTarget.dataset.code;
   
    let auth = wx.getStorageSync('token')
    let list = []
    wx.request({
      url: app.appData.serverUrl+'goods/query',
      data:{
        brandCode:brandCode,
        pageNum:1,
        pageSize:10
      },
      header:{
        'Authorization': auth
      },
      success:function(res){
        let data = res.data;
        if(data.status != 200){
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:2000
          })
        }else{
          let products=data.data;
          that.setData({
            'products': products.list,
            current: bid
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let current = that.data.current;
    let auth = wx.getStorageSync('token')
    wx.request({
      url: app.appData.serverUrl + 'brand/query',
      method: 'get',
      header: {
        'Authorization': auth
      },
      success: function (res) {
        let data = res.data;
        if (data.status != 200) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          let list = data.data;
          that.setData({
            'brands': list,
          });
          wx.request({
            url: app.appData.serverUrl + 'goods/query',
            data: {
              brandCode: list[current].code,
              pageNum: 1,
              pageSize: 40
            },
            header: {
              'Authorization': auth
            },
            success: function (res) {
              let data = res.data;
              if (data.status != 200) {
                wx.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                that.setData({
                  products: data.data.list,
                  current: list[current].id
                })
              }
            }
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