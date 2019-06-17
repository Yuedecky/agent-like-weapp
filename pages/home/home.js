let app = getApp()

Page({
  data: {
    currentTab: 0,
    items: [],
  },

  swichNav: function(e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      let current = e.target.dataset.current;
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  onUpdateCart:function(){
    console.log("in home onUpdateCart")
    const cart =this.selectComponent("#cart");
    console.log(cart)
  },

  onLoad: function(option) {
    let that = this;
    let role = wx.getStorageSync('role')
    if(!option.currentTab){
      that.setData({
        currentTab: 0
      })
    }else{
      that.setData({
        currentTab: option.currentTab
      })
    }
    if (role == 16) {
      that.setData({
        items: [{
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
          }
        ]
      })
    } else {
      that.setData({
        items: [{
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
  onShow: function() {
  }
})