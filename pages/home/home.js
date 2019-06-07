let app = getApp()

Page({
  data: {
    currentTab: 0,
    items: []
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (option) {
    let that = this;
    let role = wx.getStorageSync('role')
    if(role == 16){
      that.setData({
        items: 
             [{
                "pagePath": "/pages/index/index",
                "text": "首页",
                "iconPath": "/assets/images/index-black.png",
                "selectedIconPath": "/assets/images/index.png"
              },
                {
                  "pagePath": "/pages/cart/cart",
                  "text": "购物车",
                  "iconPath": "/assets/images/cart-black.png",
                  "selectedIconPath": "/assets/images/cart.png"
                },
                {
                  "pagePath": "/pages/order/order",
                  "text": "订单",
                  "iconPath": "/assets/images/order-black.png",
                  "selectedIconPath": "/assets/images/order.png"
                },
                {
                  "pagePath": "/pages/send/send",
                  "text": "派送",
                  "iconPath": "/assets/images/send-black.png",
                  "selectedIconPath": "/assets/images/send.png"
                }]
      })
    }else{
      that.setData({
        items:[
          {
                  "pagePath": "/pages/index/index",
                  "text": "首页",
                  "iconPath": "/assets/images/index-black.png",
                  "selectedIconPath": "/assets/images/index.png"
                },
                {
                  "pagePath": "/pages/cart/cart",
                  "text": "购物车",
                  "iconPath": "/assets/images/cart-black.png",
                  "selectedIconPath": "/assets/images/cart.png"
                },
                {
                  "pagePath": "/pages/order/order",
                  "text": "订单",
                  "iconPath": "/assets/images/order-black.png",
                  "selectedIconPath": "/assets/images/order.png"
                }
        ]
      })
    }
  },
  onShow:function(){
    let that = this;
    let tab=that.data.currentTab;
    console.log(typeof tab)
  }
})
