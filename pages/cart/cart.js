import {
  AddressModel
} from '../../models/addressModel.js';
import {
  CartModel
} from '../../models/cartModel.js';

import {
  Config
} from '../../config.js';

var app = getApp();
const addressModel = new AddressModel();
const cartModel = new CartModel();
Component({

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  data: {
    adminShow: false, //管理      
    shopcarData: [], //购物车数据      
    total: 0, //总金额      
    allsel: false, //全选      
    selarr: [], //选择的货物      
    addressId: 0,
    checkedCount: 0,

    totalNum: 0,
    submitText: '',
    totalRebate: 0,

    shopcar: [],
    cartColor: '#006699',
    hasDefaultAddress: false,

    canRequest: true,
    loadFlag: true,
    pageNum: 1,
    count: 0,

    touchDown: 0,
    innerHeight: 0,
    startScroll: 0,
    height: 0,
    scrollTop: 0,
  },
  properties: {
    cartList: {
      type: Array,
    },
  },

  observers: {

  },

  lifetimes: {
    created: function() {},
    attached: function() {
      // 显示设置
     
      let that = this;
      if (that.data.selarr.length > 0) {
        that.setData({
          cartColor: '#006699',
          cartDisabled: false
        })
      } else {
        that.setData({
          cartDisabled: true
        })
      }
      this.getCartMainData();
    },
    ready: function() {
      var res = wx.getSystemInfoSync();
      let tmp = 180;
      let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
      if(res.platform =='android'){
        h=res.windowHeight-res.windowWidth/750*116-170;
      }
      this.setData({
        mainHeight: h,
      });
    },
    detached: function() {},
  },
  methods: {
    onAddressDetail(event) {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    },

    getCartMainData: function() {
      let that = this;
      let address = addressModel.getDefaultAddress();
      let cart = cartModel.getCartList({
        pageNum: 1
      });
      Promise.all([address, cart]).then((res) => {
        const address = res[0].data;
        const cartList = res[1].data.list;
        const page = res[1].data.page;
        that.setData({
          address: address.address,
          name: address.addressee,
          phone: address.phone,
          addressId: address.id
        });
        if (cartList != null) {
          that.setData({
            shopcarData: cartList,
            count: cartList.length,
            canRequest: cartList.length < page.total,
            pageNum: page.current,
          })
        }
      })
    },


    cartScrollDown: function() {
      let that = this;
      if (that.data.canRequest) {
        wx.showLoading({
          title: '加载中',
        })
        if (that.data.count < Config.maxCount) {
          if (that.data.loadFlag) {
            let shopcarData = that.data.shopcarData;
            let pageNum = 1;
            if (shopcarData.length != 0) {
              if (that.data.count % Config.cart.pageSize == 0) {
                pageNum = that.data.pageNum + 1;
              } else {
                pageNum = that.data.pageNum;
              }
            }
            cartModel.getCartList({
              pageSize: Config.cart.pageSize,
              pageNum: pageNum
            }).then((res) => {
              let data = res.data;
              if (res.status == 200) {
                let list = data.list;
                if (list != null && list.length > 0) {
                  if (that.data.allsel) {
                    for (var i = 0; i < list.length; i++) {
                      list[i].check = true
                    }
                  }
                  if (data.page.current > parseInt(shopcarData.length / Config.cart.pageSize)) {
                    //需要判断是否为第一页
                    let carLength = shopcarData.length;
                    if (data.page.current <= 1) {
                      shopcarData = Array.from(data.list)
                    } else {
                      shopcarData.splice((data.page.current - 1) * Config.cart.pageSize);
                      shopcarData = shopcarData.concat(data.list)
                    }
                  }
                  that.setData({
                    count: shopcarData.length,
                    loadFlag: shopcarData.length < parseInt(data.page.total),
                    canRequest: shopcarData.length < parseInt(data.page.total),
                    pageNum: data.page.current,
                    canRequest: shopcarData.length < data.page.total,
                    shopcarData: shopcarData
                  })
                  that.computePriceAndRebate(shopcarData, that.data.allsel);
                } else {
                  that.setData({
                    loadFlag: false,
                    canRequest: false
                  })
                }
              } else {
                wx.showToast({
                  title: data.msg,
                  duration: 1500,
                  icon: 'none'
                })
              }
            })
          }
        } else {
          this.setData({
            canRequest: false,
            loadFlag: false,
          })
        }
        wx.hideLoading()
      } else {
        that.setData({
          loadFlag: false
        })
      }
    },


    //点击全选  
    allcheckTap: function() {
      let shopcar = this.data.shopcarData;
      let that = this;
      let allsel = !that.data.allsel; //点击全选后allsel变化
      that.computePriceAndRebate(shopcar, allsel);
    },

    computePriceAndRebate(shopcar, allsel) {
      let that = this;
      let selarr = [];
      let total = 0;
      let totalRebate = 0;
      for (let i = 0, len = shopcar.length; i < len; i++) {
        shopcar[i].check = allsel; //所有商品的选中状态和allsel值一样
        if (allsel) { //如果为选中状态则计算商品的价格
          total += shopcar[i].platformPrice * shopcar[i].count;
          totalRebate += shopcar[i].rebatePrice * shopcar[i].count;
        }
        if (shopcar[i].check) {
          selarr.push(shopcar[i])
        }
      }
      that.setData({
        allsel: allsel,
        shopcarData: shopcar,
        total: total,
        totalRebate: totalRebate,
        selarr: selarr,
        checkedCount: selarr.length,
        totalNum: shopcar.length,
        cartDisabled: selarr.length < 1
      });
      if (that.data.cartDisabled) {

      } else {
        that.setData({
          cartColor: '#006699'
        })
      }
    },
    //点击移除商品  
    deleteshopTap: function() {
      let that = this;
      var allsel = that.data.allsel;
      var shopcar = that.data.shopcarData;
      var selarr = that.data.selarr;
      var del = []
      let auth = wx.getStorageSync('token')
      if (allsel) {
        for (var i = 0; i < shopcar.length; i++) {
          del.push(shopcar[i].id)
        }
        that.setData({
          allsel: false
        });
      } else {
        for (var i = 0, len = selarr.length; i < len; i++) { //将选中的商品从购物车移除
          for (var lens = shopcar.length - 1, j = lens; j >= 0; j--) {
            if (selarr[i].id == shopcar[j].id) {
              shopcar.splice(j, 1);
              del.push(selarr[i].id)
            }
          }
        }
      }
      if (del.length < 1) {
        wx.showToast({
          title: '请选择要移出的商品',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      cartModel.removeCart(del).then((res) => {
        return cartModel.getCartList({})
      }).then((res) => {
        let page = res.data.page;
        that.setData({
          shopcarData: res.data.list == null ? [] : res.data.list,
          allsel: false,
          selarr: [],
          checkedCount: 0,
          cartDisabled: true,
          total: 0,
          totalRebate: 0,
          pageNum: page.current
        })
        wx.showToast({
          title: '移出成功',
          duration: 2000,
          icon: 'success'
        })
      })

    },


    goIndexPage: function(e) {
      wx.reLaunch({
        url: '/pages/home/home?currentTab=0',
      })
    },

    //点击管理按钮，是否显示管理的选项  
    adminTap: function() {
      let that = this;
      that.setData({
        adminShow: !that.data.adminShow
      });
    },

    //点击单个选择按钮  
    checkTap: function(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      let shopcar = that.data.shopcarData;
      let total = that.data.total;
      let totalRebate = that.data.totalRebate;
      let selarr = that.data.selarr;
      shopcar[index].check = !shopcar[index].check || false;
      if (shopcar[index].check) {
        total += shopcar[index].count * shopcar[index].platformPrice;
        totalRebate += shopcar[index].count * shopcar[index].rebatePrice;
        selarr.push(shopcar[index]);
      } else {
        total -= shopcar[index].count * shopcar[index].platformPrice;
        totalRebate -= shopcar[index].count * shopcar[index].rebatePrice;
        for (let i = 0, len = selarr.length; i < len; i++) {
          if (shopcar[index].id == selarr[i].id) {
            selarr.splice(i, 1);
            break;
          }
        }
      }
      this.setData({
        shopcarData: shopcar,
        total: total,
        totalRebate: totalRebate,
        selarr: selarr,
        checkedCount: selarr.length,
        totalNum: shopcar.length,
        cartDisabled: selarr.length < 1
      });
      if (that.data.cartDisabled) {

      } else {
        that.setData({
          cartColor: '#006699'
        })
      }
      this.judgmentAll(); //每次按钮点击后都判断是否满足全选的条件  
    },

    //点击加减按钮  
    numchangeTap: function(e) {
      let that = this;
      const pid = e.detail.id; //点击的商品下标值        
      const shopcar = that.data.shopcarData;
      const index = shopcar.findIndex((ele) => ele.id == pid)
      let types = e.detail.type; //是加号还是减号        
      let total = that.data.total; //总计
      let totalRebate = that.data.totalRebate;
      switch (types) {
        case 'add':
          shopcar[index].num++; //对应商品的数量+1      
          shopcar[index].check && (total += parseInt(shopcar[index].platformPrice)) && (totalRebate += parseInt(shopcar[index].rebatePrice)); //如果商品为选中的，则合计价格+商品单价      
          cartModel.changeNum({
            pid: pid,
            count: 1,
            type: types
          }).then((res) => {
            if (res.status != 200) {
              wx.showToast({
                title: res.msg,
                duration: 2000,
                icon: 'none'
              })
              return
            } else {
              return cartModel.getCartList({
                pageNum: 1
              });
            }
          }).then((res) => {
            that.setData({
              shopcarData: res.data.list,
            })
          })
          break;
        case 'minus':
          if (shopcar[index].count == 1) {
            wx.showModal({
              title: '提示',
              content: '确定删除该商品',
              success: function(res) {
                let chooseIds = []
                if (res.cancel) {} else {
                  chooseIds.push(pid)
                  cartModel.removeCart(chooseIds).then((res) => {
                    if (res.status != 200) {
                      wx.showToast({
                        title: res.msg,
                        duration: 2000,
                        icon: 'none'
                      })
                      return
                    } else {
                      return cartModel.getCartList({
                        pageNum: 1
                      })
                    }
                  }).then((res) => {
                    if (res.data.list == null) {
                      that.setData({
                        shopcarData: [],
                        allsel: false,
                        selarr: [],
                        total: 0,
                        totalRebate: 0,
                      })
                    } else {
                      that.setData({
                        shopcarData: res.data.list,
                      })
                    }
                  });
                }
              }
            })
            break;
          }
          shopcar[index].num--; //对应商品的数量-1 
          shopcar[index].check &&
            (total -= parseInt(shopcar[index].platformPrice)) &&
            (totalRebate += parseInt(shopcar[index].rebatePrice));
          cartModel.changeNum({
            pid: pid,
            count: 1,
            type: types
          }).then((res) => {
            if (res.status != 200) {
              wx.showToast({
                title: res.msg,
                duration: 2000,
                icon: 'none'
              })
              return
            } else {
              return cartModel.getCartList({
                pageNum: 1
              });
            }
          }).then((res) => {
            that.setData({
              shopcarData: res.data.list,
            })
          })
          break;
      }
      this.setData({
        shopcarData: shopcar,
        total: total,
        totalRebate: totalRebate
      });
    },
    submitOrder: function(e) {
      let that = this;
      let orderIds = [];
      let shopcar = that.data.selarr;
      for (var i = 0; i < shopcar.length; i++) {
        orderIds.push(shopcar[i].id)
      }
      if (orderIds.length < 1) {
        wx.showToast({
          title: '请选择商品',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      if (that.data.addressId == null || that.data.addressId == 0) {
        wx.showToast({
          title: '请选择收货地址',
          duration: 2000,
          icon: 'none'
        })
        return
      }
      orderIds = orderIds.join(',')
      let addressId = that.data.addressId;
      cartModel.applySend(orderIds, addressId).then((res) => {
        wx.reLaunch({
          url: '/pages/home/home?currentTab=2',
        })
      })
    },



    //判断是否为全选  
    judgmentAll: function() {
      let that = this;
      let shopcar = that.data.shopcarData;
      let shoplen = shopcar.length;
      let lenIndex = 0; //选中的物品的个数    
      for (let i = 0; i < shoplen; i++) { //计算购物车选中的商品的个数    
        shopcar[i].check && lenIndex++;
      }
      that.setData({
        allsel: lenIndex == shoplen //如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
      });
    },

  }












  // onLoad: function (options) {
  // 
  // },


  // onReady: function () {

  // },





  /**  
   * 生命周期函数--监听页面显示 
   */
  // onShow: function () {

  // },


})