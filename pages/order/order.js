Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['未完成','已完成'],
    activeIndex:1,
    sliderOffset: 0,
    sliderLeft:0, 
    silderWidth:120,


    // ====
    orderNoF:'201901012323454545',
    orderNoP:'20190404342322434',
    orderFStatus: '一完成',
    orderPStatus:'待配送',
    orderPTotal:3456,
    orderPReturn: 234,
    orderListProcessing:[{
        pid: 1,
        name: '联想Z5',
        image: "https://img10.360buyimg.com/mobilecms/s500x500_jfs/t1/7514/35/14480/132195/5c650f61E7fab2029/39353c4818bbb3eb.jpg",
        desc: '这是简介',
        salePrice: 2344.34,
        commission: 129,
        num:4
      },
      {
        pid: 2,
        name: '华为P8',
        image: "https://img11.360buyimg.com/mobilecms/s500x500_jfs/t10357/244/2831662005/146980/ba7823ad/5cdb5f8aN4a876602.png",
        desc: '这是简介',
        salePrice: 2344.34,
        commission: 129,
        num:2
      },
      {
        pid: 3,
        name: '畅想9S',
        image: "https://img12.360buyimg.com/n1/s450x450_jfs/t1/24205/2/14862/179077/5cb6d175E92733807/46e7ace99f41dd41.jpg",
        desc: '这是简介',
        salePrice: 2344.34,
        commission: 129,
        num:1
    }],
    orderListFinished: [{
      pid: 1,
      name: '联想Z5',
      image: "https://img10.360buyimg.com/mobilecms/s500x500_jfs/t1/7514/35/14480/132195/5c650f61E7fab2029/39353c4818bbb3eb.jpg",
      desc: '这是简介',
      salePrice: 2344.34,
      commission: 129,
      num:2
    },
      {
        pid: 2,
        name: '华为P8',
        image: "https://img11.360buyimg.com/mobilecms/s500x500_jfs/t10357/244/2831662005/146980/ba7823ad/5cdb5f8aN4a876602.png",
        desc: '这是简介',
        salePrice: 2344.34,
        commission: 129,
        num:3
      },
      {
        pid: 3,
        name: '畅想9S',
        image: "https://img12.360buyimg.com/n1/s450x450_jfs/t1/24205/2/14862/179077/5cb6d175E92733807/46e7ace99f41dd41.jpg",
        desc: '这是简介',
        salePrice: 2344.34,
        commission: 129,
        num:4
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("order's onload:",options)
    let sliderWidth = that.data.silderWidth;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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