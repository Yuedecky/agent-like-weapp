var app = getApp();
Component({

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  data: {
    adminShow: false,//管理      
    shopcarData: [],//购物车数据      
    total: 0,//总金额      
    allsel: false,//全选      
    selarr: [],//选择的货物      

    checkedCount:0,
    
    totalNum:0,
    submitText:'',
    //---
    deliveryName:'',
    deliveryPhone:'',
    deliveryAddress:'',
    totalRebate:0,
    //--
    //----
    shopcar: [],
    cartColor: 'red',
    hasDefaultAddress:false,

    pageNum:1,
    pageSize:5,

    canRequest:false,
    maxCount: 250,
    loadFlag: true,
    count: 0,
    pullLoading: false,
    dataList: [],
    contentWaitingShow: false,


    touchDown:0,
    innerHeight:0,
    startScroll:0,
    height:0,
    scrollTop:0,
  },
  properties:{
    name:{
      type:String,
      value:'cart'
    },

   
  },

  observers:{
    'shopcarData':function(field){
        console.log('触发了observer,field:',field)
    }
  },

  lifetimes:{
    created:function(){
    },
    attached: function () {
      // 显示设置
      var res = wx.getSystemInfoSync();
      var device = new RegExp("iOS");
      var result = device.test(res.system);
      let tmp = 180;
      let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
      this.setData({
        mainHeight: h,
      });
      this.getCartMainData();
    },
    ready: function () {
      console.log('cart ready')
    },
    detached: function () { 
      console.log('cart detached')
    },
  },
  methods:{
    getCartMainData:function(){
      //是否首次加载
      let auth = wx.getStorageSync('token')
      this.getDefaultAddress();
      this.loadChooseList(auth,this,null);
    },

    scrollDown:function(){
      let that = this;
      if (that.data.canRequest) {
        wx.showLoading({
          title: '加载中',
        })
        if (that.data.count < that.data.maxCount) {
          let auth = wx.getStorageSync('token')
          let pageNum = that.data.pageNum+1;
          that.setData({
            pageNum:pageNum
          })
          if (that.data.loadFlag) {
            that.setData({
              pullLoading: true
            })
            wx.request({
              url: app.globalData.serverUrl + 'choose/list',
              header: { 'Authorization': auth },
              data: {
                pageNum: that.data.pageNum,    // 继续请求
                pageSize: that.data.pageSize,    // 每次请求的数目
              },
              success: function (res) {
                let data = res.data;
                if (data.status == 200) {
                  if(res.data.data.list != null 
                  && res.data.data.list.length >0){
                    let tempData = that.data.shopcarData.concat(res.data.data.list);
                    that.setData({
                      count: that.data.count + that.data.pageNum * that.data.pageSize,
                      shopcarData: tempData,
                      loadFlag: tempData.length >= parseInt(res.data.data.page.total) ? false : true,
                      pullLoading: false,
                      canRequest: tempData.length >= parseInt(res.data.data.page.total) ? false : true,
                      pageNum: ++pageNum
                    })
                  }
                  
                } else {
                  wx.showToast({
                    title: data.msg,
                    duration: 1500,
                    icon: 'none'
                  })
                }
              },
              fail: function (err) {
                wx.showToast({
                  title: '下拉加载商品失败',
                  duration: 1500,
                  icon: 'none'
                })
              },
              complete:function(){
                wx.hideLoading()
              }
            })
          } else {
            return
          }
        } else {
          console.log('已经不能加载了')
          this.setData({
            canRequest: false,
            loadFlag: false,
          })
        }
      }
    },

    /**
     * 获取默认地址
     */
    getDefaultAddress:function(){
      let that = this;
      let auth = wx.getStorageSync('token');
      wx.request({
        url: app.globalData.serverUrl + 'address/default',
        header: {
          'Authorization': auth
        },
        method: 'get',
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            if (data.data != null) {
              let address = data.data.address;
              let phone = data.data.phone;
              let addressee = data.data.addressee;
              let addressId = data.data.id;
              that.setData({
                addressId: addressId,
                deliveryName: addressee,
                deliveryPhone: phone,
                deliveryAddress: address,
                hasDefaultAddress: true
              })
            } 
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '获取收货地址失败',
            icon: 'none',
            duration: 2000
          })
        }
      });
    },

    onPullDownRefresh: function () {
      // 我们用total和count来控制分页，total代表已请求数据的总数，count代表每次请求的个数。
      // 刷新时需把total重置为0，代表重新从第一条请求。
      let that = this;
      // this.data.dataArray 是页面中绑定的数据源
      that.data.shopcarData = [];
      // 网络请求，重新请求一遍数据
      let auth = wx.getStorageSync('token')
      this.loadChooseList(auth,this,that.data.maxCount);
      // 小程序提供的api，通知页面停止下拉刷新效果
      wx.stopPullDownRefresh;
    },

   

    //点击全选  
    allcheckTap: function () {
      let shopcar = this.data.shopcarData;
      let that = this;
      let allsel = !that.data.allsel;//点击全选后allsel变化
      let total = 0;
      let selarr = []
      let totalRebate = 0;
      for (let i = 0, len = shopcar.length; i < len; i++) {
        shopcar[i].check = allsel;//所有商品的选中状态和allsel值一样
        if (allsel) {//如果为选中状态则计算商品的价格
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
          cartColor: 'red'
        })
      }
    },
    //点击移除商品  
    deleteshopTap: function () {
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
        for (var i = 0, len = selarr.length; i < len; i++) {//将选中的商品从购物车移除
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
      wx.request({
        url: app.globalData.serverUrl + 'choose/del',
        data: {
          chooseIds: del.join(',')
        },
        header: {
          'Authorization': auth
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '移出成功',
              duration: 2000,
              icon: 'success'
            })
            that.setData({
              shopcarData: allsel ? [] : shopcar,
              total: 0,
              totalRebate: 0,
              selarr: [],
              checkedCount: 0,
              totalNum: shopcar.length,
            });
            that.setData({
              cartDisabled: that.data.selarr.length < 1
            })
            if (that.data.cartDisabled) {

            } else {
              that.setData({
                cartColor: 'red'
              })
            }
          }
        }
      })
    },

    loadMore:function(){
      console.log('in load more...')
    },


    start_fn(e) {
     let self = this;
     let touchDown = e.touches[0].clientY;
     this.data.touchDown = touchDown;
         // 获取 inner-wrap 的高度
    var innerWrap = wx.createSelectorQuery();
      innerWrap.select('#inner-wrap')
      innerWrap.boundingClientRect();
      innerWrap.exec(function(rect){
        if (rect != null) {
          self.data.innerHeight = rect.height;
        } else {
          self.data.innerHeight = 100;
        }
    });
      
   // 获取 scroll-wrap 的高度和当前的 scrollTop 位置
   var cartScrollWrap =wx.createSelectorQuery();
   cartScrollWrap.select('#cart-scroll-wrap').fields({
               scrollOffset: true,
               size: true
    }, function (rect) {
      if(rect != null){
        self.data.startScroll = rect.scrollTop;
        self.data.height = rect.height;
      }else{
        self.data.startScroll = 100;
        self.data.height=100;
      }
    }).exec();
  },

    end_fn(e) {
         let currentY= e.changedTouches[0].clientY;
         let self = this;
          let { startScroll, innerHeight, height, touchDown } = this.data;
          /**
           * 1、下拉刷新
           * 2、上拉加载
           */
      if (currentY > touchDown &&
       currentY - touchDown > 20 
       && startScroll == 0) {
               // 下拉刷新 的请求和逻辑处理等
          console.log('开始下拉刷新...')
          that.scrollDown()
      } else if (currentY < touchDown && touchDown - currentY >= 20 && innerHeight - height == startScroll) {
               // 上拉加载 的请求和逻辑处理等
        console.log("开始上拉加载...")
        that.scrollDown();
      }
    },



    goIndexPage: function (e) {
      wx.reLaunch({
        url: '/pages/home/home?currentTab=0',
      })
    },

    //点击管理按钮，是否显示管理的选项  
    adminTap: function () {
      let that = this;
      that.setData({
        adminShow: !that.data.adminShow
      });
    },

    //点击单个选择按钮  
    checkTap: function (e) {
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
          cartColor: 'red'
        })
      }
      this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
    },

    //点击加减按钮  
    numchangeTap: function (e) {
      let that = this;
      let index = e.currentTarget.dataset.index;//点击的商品下标值        
      let shopcar = that.data.shopcarData;
      let types = e.currentTarget.dataset.types;//是加号还是减号        
      let total = that.data.total;//总计
      let totalRebate = that.data.totalRebate;
      let auth = wx.getStorageSync('token')
      switch (types) {
        case 'add':
          shopcar[index].num++;//对应商品的数量+1      
          shopcar[index].check && (total += parseInt(shopcar[index].platformPrice)) && (totalRebate += parseInt(shopcar[index].rebatePrice));//如果商品为选中的，则合计价格+商品单价      
          wx.request({
            url: app.globalData.serverUrl + 'choose/modify/count',
            data: {
              chooseId: shopcar[index].id,
              count: 1,
              type: 1
            },
            header: {
              'Authorization': auth
            },
            success: function (res) {
              let data = res.data;
              if (data.status != 200) {
                wx.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                shopcar[index].count++
                that.setData({
                  shopcarData: shopcar
                })
              }
            }
          })
          break;
        case 'minus':
          if (shopcar[index].count == 1) {
            wx.showModal({
              title: '提示',
              content: '确定删除该商品',
              success: function (res) {
                if (res.cancel) {

                } else {
                  that.delCount(shopcar[index].id, that)
                }
              }
            })
            break;
          }
          shopcar[index].num--;//对应商品的数量-1 
          shopcar[index].check
            && (total -= parseInt(shopcar[index].platformPrice))
            && (totalRebate += parseInt(shopcar[index].rebatePrice));//如果商品为选中的，则合计价格-商品单价    
          wx.request({
            url: app.globalData.serverUrl + 'choose/modify/count',
            data: {
              chooseId: shopcar[index].id,
              count: 1,
              type: 2
            },
            header: {
              'Authorization': auth
            },
            success: function (res) {
              let data = res.data;
              if (data.status != 200) {
                wx.showToast({
                  title: data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                shopcar[index].count--
                that.setData({
                  shopcarData: shopcar
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '失败',
                duration: 2000,
                icon: 'none'
              })
            }
          })
          break;
      }
      this.setData({
        shopcarData: shopcar,
        total: total,
        totalRebate: totalRebate
      });
    },
    submitOrder: function (e) {
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
      let auth = wx.getStorageSync('token')
      orderIds = orderIds.join(',')
      let addressId = that.data.addressId;
      wx.request({
        url: app.globalData.serverUrl + 'order/add',
        data: {
          chooseIds: orderIds,
          addressId: addressId,
        },
        header: {
          'Authorization': auth
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            wx.removeStorageSync('selarr')
            wx.reLaunch({
              url: '/pages/home/home?currentTab=2'
            })
          }
        }
      })
    },



    //判断是否为全选  
    judgmentAll: function () {
      let that = this;
      let shopcar = that.data.shopcarData;
      let shoplen = shopcar.length;
      let lenIndex = 0;//选中的物品的个数    
      for (let i = 0; i < shoplen; i++) {//计算购物车选中的商品的个数    
        shopcar[i].check && lenIndex++;
      }
      that.setData({
        allsel: lenIndex == shoplen//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
      });
    },


    onSwithAddress: function (e) {
      wx.navigateTo({
        url: '/pages/address/address',
      })
    },


    delCount: function (id, that) {
      let auth = wx.getStorageSync('token')
      let chooseIds = []
      chooseIds.push(id)
      wx.request({
        url: app.globalData.serverUrl + 'choose/del',
        header: {
          'Authorization': auth
        },
        data: {
          chooseIds: chooseIds.join(',')
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '删除成功',
              duration: 2000,
              icon: 'success'
            })
            that.loadChooseList(auth, that,1)
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '删除商品失败',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    },

    loadChooseList: function (auth, that,pageNum) {
      let curPage = pageNum ==null? 
                that.data.pageNum:
                pageNum;
      let pageSize = that.data.pageSize;
      let selarr = that.data.selarr;
      wx.request({
        url: app.globalData.serverUrl + 'choose/list',
        method: 'get',
        header: {
          'Authorization': auth
        },
        data:{
            pageNum: curPage,
            pageSize:pageSize
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            let list = data.data.list;
            let page = data.data.page;
            if (list != null && list.length>0) {
              var shopcarData = list;
              let total = that.data.total;
              let totalRebate = that.data.totalRebate;
              let canRequest = false;
              if(page.total <= that.data.pageSize){
              }else{
                canRequest = true;
              }
              if (shopcarData && selarr) {
                for (var i = 0; i < shopcarData.length; i++) {
                  if (shopcarData[i].check) {
                    total += shopcarData[i].count * shopcarData[i].platformPrice;
                    totalRebate += shopcarData[i].count * shopcarData[i].rebatePrice;
                  }
                  for (var j = 0; j < selarr.length; j++) {
                    let sel = selarr[j];
                    if (sel.id = shopcarData[i].id) {
                      shopcarData[i].check = true
                    }
                  }
                }
                that.setData({
                  total: total,
                  totalRebate: totalRebate,
                  shopcarData: shopcarData,
                  count: page.size,
                  canRequest:canRequest
                });
                that.judgmentAll();//判断是否全选  
              }
            } else {
              that.setData({
                total: 0,
                totalRebate: 0,
                shopcarData: [],
                selarr: [],
                shopcar: []
              })
              that.judgmentAll()
              return
            }

          }
        }
      })
    }

  }

  
  
 
  
 
  
  


  

  // onLoad: function (options) {
  //   let that = this;
  //   if(that.data.selarr.length >0){
  //     that.setData({
  //       cartColor: 'red',
  //       cartDisabled: false
  //     })
  //   }else{
  //     that.setData({
  //       cartDisabled:true
  //     })
  //   }
  // },

  
  // onReady: function () {
    
  // },

  
  

 
  /**  
   * 生命周期函数--监听页面显示 
   */
  // onShow: function () {
    
  // },

 
})