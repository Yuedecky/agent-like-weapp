// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#8a8a8a",
        "selectedColor": "#1296db",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "/assets/images/index-black.png",
            "selectedIconPath": "icon/index.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/cart/cart",
            "iconPath": "/assets/images/cart-black.png",
            "selectedIconPath":"/assets/images/cart.png",
            "text": "购物车"
          },
          {
            "pagePath": "/pages/order/order",
            "iconPath": "/assets/images/order-black.png",
            "selectedIconPath": "/assets/images/order.png",
            "text": "订单"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})