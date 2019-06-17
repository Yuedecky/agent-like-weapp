import {
  CartModel
} from '../../models/cartModel.js';

import {
  Config
} from '../../config.js';

let app = getApp()
const cartModel = new CartModel();

Page({
  data: {
    currentTab: 0,
    items: [],
    shopcarData: []
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

  onAddCart: function(event) {
    let {
      pid
    } = event.detail;
    cartModel.addCart(pid).then((res) => {
      if (res.status != 200) {
        wx.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '加购成功',
          duration: 2000,
          icon: 'success'
        })
      }
    })
    let cart = this.selectComponent("#cart");
    const shopcarData = cart.data.shopcarData;
    const pageNum = shopcarData.length % Config.cart.pageSize == 0 ? cart.data.pageNum + 1 : cart.data.pageNum;
    cartModel.getCartList({
      pageNum: pageNum
    }).then((res) => {
      let data = res.data;
      let tempData = shopcarData;
      tempData.concat(data.list);
      cart.setData({
        shopcarData: tempData,
        count: tempData.length,
        canRequest: tempData.length < data.page.total,
        loadFlag: tempData.length < data.page.total
      })
    })
  },



  onLoad: function(option) {
    let that = this;
    let role = wx.getStorageSync('role')
    if (!option.currentTab) {
      that.setData({
        currentTab: 0
      })
    } else {
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
  onShow: function() {}
})