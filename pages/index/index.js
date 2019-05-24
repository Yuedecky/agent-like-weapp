var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brands: [
      {
        code: 1,
        name: "",
        ishaveChild: true,
        logo:''
      },
    ],
      products:[{
        id: 2,
        name: "",
        color: '',
        memory:'',
        remark:'',
        coverImg:'',
        platformPrice:'',
        rebatePrice:''
      }],
    current: 1, //当前选中的cate_id
    index: 0 // 当前选中的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
      wx.request({
        url: app.appData.serverUrl+'brand/query',
        method:'get',
        success:function(res){
            let data= res.data;
            if(data.status !=200){
                wx.showToast({
                  title: data.msg,
                  icon:'none',
                  duration:2000
                })
            }else{
              let list = data.list;
              that.setData({
                'brands': list,
              })
            }
        }
      })
  },

  onAddCart:function(e){
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    wx.showToast({
      title: '加入成功',
      duration:2000,
      icon:'success'
    })
    const query= wx.createSelectorQuery();
    query.select("#the-cart" + pid).boundingClientRect(function(rect){
      console.log('rect:',rect)
    })
  },

  onClick: function (e) {
    this.setData({
      current: e.target.dataset.id,
      index: e.target.dataset.index
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