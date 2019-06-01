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
    that.setData({
      myAddresses:[
        {
          id: 1,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default:true
        },
        {
          id: 2,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default:false
        },
        {
          id: 3,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default: true
        },
        {
          id: 4,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default: false
        },
        {
          id: 5,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default: true
        },
        {
          id: 6,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default: false
        },
        {
          id: 7,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default: true
        },
        {
          id: 8,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default: false
        },
        {
          id: 9,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default: true
        },
        {
          id: 10,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default: false
        },
        {
          id: 11,
          name: '张三',
          phone: '182****1234',
          address: "浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号203浙江省杭州市金华路123号20323232323232323",
          default: true
        },
        {
          id: 12,
          name: '李四',
          phone: '182****1234',
          address: "浙江省杭州市西湖区2321212222穿杨新苑号20号楼203",
          default: false
        }
      ]
    })
  },

  onEditAddress:function(e){
    let addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/edit/edit?id=' + addressId,
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