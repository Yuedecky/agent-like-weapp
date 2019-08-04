import {
  CartModel
} from '../../models/cartModel.js';

import {
  Config
} from '../../config.js';

import {
  AddressModel
} from '../../models/addressModel'
const cartModel = new CartModel();
const addressModel = new AddressModel();
Page({
  data: {
    currentTab: 0,
    items: [],
    shopcarData: []
  },

  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      let current = e.target.dataset.current;
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (current == 1) {
        that.loadCartList()
      }
    }
  },

  loadCartList() {
    let cart = this.selectComponent("#cart");
    let shopcarData = cart.data.shopcarData || [];
    let pageNum = 1;
    if (shopcarData.length != 0) {
      if (shopcarData.length % Config.cart.pageSize == 0) {
        pageNum = cart.data.pageNum + 1;
      } else {
        pageNum = cart.data.pageNum;
      }
    }
    let address = addressModel.getDefaultAddress();
    const cartList = cartModel.getCartList({
      pageNum: pageNum
    })
    Promise.all([address, cartList]).then((res) => {
      const dAddress = res[0].data;
      const carts = res[1].data;

      let list = carts.list;
      const page = carts.page;
      if (page.total > 0) {
        if (page.current > parseInt(shopcarData.length / Config.cart.pageSize)) {
          //需要判断是否为第一页
          if (page.current <= 1) {
            shopcarData = Array.from(list == null ? [] : list)
          } else {
            shopcarData.splice((page.current - 1) * Config.cart.pageSize);
            if (data.list != null) {
              shopcarData = shopcarData.concat(data.list)
            }
          }
        }
      } else {
        shopcarData = []
      }
      cart.setData({
        shopcarData: shopcarData,
        count: shopcarData.length,
        canRequest: shopcarData.length < page.total,
        loadFlag: shopcarData.length < page.total,
        pageNum: page.current,
        allsel: false,
        address: dAddress
      })
    })
  },

  onAddCart: function (event) {
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

  },



  onLoad: function (option) {
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
  onShow: function () {
    console.log(this.data.currentTab)
    if (this.data.currentTab === 1) {
      this.loadCartList()
    }
  }
})