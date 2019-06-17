import {
  BrandModel
} from '../../models/brandModel.js';
import {
  ProductModel
} from '../../models/productModel.js';
import {
  CartModel
} from '../../models/cartModel.js';
import {
  Config
} from '../../config.js';
const app = getApp()
const brandModel = new BrandModel()
const productModel = new ProductModel()
const cartModel = new CartModel();
Component({
  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },
  properties: {
    pageNum: {
      type: Number,
      value: Config.product.pageNum || 1
    },
  },

  /**
   * 页面的初始数据
   */
  data: {
    brands: [],
    loadFlag: true,
    count: 0,
    products: [],
    canRequest: true,
    current: 0,
  },


  attached: function() {
    // 显示设置
    let that = this;
    const res = wx.getSystemInfoSync();
    const device = new RegExp("iOS");
    const result = device.test(res.system);
    let tmp = 0;
    let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
    this.setData({
      mainHeight: h,
      networkType: app.globalData.networkType
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    brandModel.getAllBrands().then((res) => {
      const brands = res.data;
      let current = 0;
      if (brands != null && brands.length > 0) {
        current = brands[0].code;
      }
      this.properties.current = current;
      that.setData({
        current: current,
        brands: brands,
      })
      return productModel.getPageProducts({
        bcode: current
      });
    }).then((res) => {
      that.setData({
        products: res.data.list,
        count: res.data.list.length
      });
      wx.hideLoading()
    });
  },

  methods: {
    productScrollDown() {
      let that = this;
      if (that.data.canRequest) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        if (that.data.count < Config.maxCount) {
          that.setData({
            canRequest: true
          })
          let brandCode = that.data.current;
          ++this.properties.pageNum;
          productModel.getPageProducts({
            bcode: brandCode,
            pageNum: this.properties.pageNum
          }).then((res) => {
            let products = res.data.list;
            const tempData = that.data.products.concat(products);
            that.setData({
              products: tempData,
              count: tempData.length,
              canRequest: (tempData.length) < res.data.page.total,
              loadFlag: (tempData.length) < res.data.page.total
            })
          });
        } else {
          this.setData({
            canRequest: false,
          })
        }
        wx.hideLoading()
      }
    },

    onAddCart: function(e) {
      let that = this;
      let pid = e.currentTarget.dataset.pid;
      cartModel.addCart(pid).then((res) => {
        if (res.status != 200) {
          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: 'none'
          })
        } else {
          that.triggerEvent('onUpdateCart', {}, {})
          wx.showToast({
            title: '加购成功',
            duration: 2000,
            icon: 'success'
          })
        }
      })
    },

    brandTap: function(e) {
      let that = this;
      let bcode = e.currentTarget.dataset.code;
      that.setData({
        current: bcode
      })
      wx.showLoading({
        title: '加载中...',
      })
      productModel.getPageProducts({
        bcode: bcode
      }).then((res) => {
        that.setData({
          products: res.data.list,
          count: 0,
        })
        wx.hideLoading()
      })
    }
  },





})