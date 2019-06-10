var app = getApp()
Component({


  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['待配送', '配送中','已完成'],
    activeIndex: 0,
    sliderOffset: 20,
    sliderLeft: 0,
    silderWidth: 120,

    orderToSend:[],
    orderSending:[],
    orderSent:[],
    customerPhone:'',
  },
  properties:{
    
    name:{
      type:String,
      value:'send'
    }
  },
  methods:{
    contactCustomer:function(e){
      let customerPhone = e.currentTarget.dataset.customerPhone;
      let customerName = e.currentTarget.dataset.customerName;
      console.log('contact customer,phone,name',customerPhone,customerName)
      this.doContact(customerPhone,customerName)
    },

    doContact: function (phoneNumber,phoneName) {
      let that = this;
      //显示“呼叫”、“添加联系人”弹窗
      wx.showActionSheet({
        itemList: [phoneNumber, '呼叫', '添加联系人'],
        success: function (res) {
          if (res.tapIndex == 1) {//直接呼叫
            wx.makePhoneCall({
              phoneNumber: phoneNumber,
              success: function (res_makephone) {
                console.log("呼叫电话返回：", res_makephone)
              }
            })
          } else if (res.tapIndex == 2) {//添加联系人
            wx.addPhoneContact({
              firstName: phoneName,
              mobilePhoneNumber: phoneNumber,
              success: function (res_addphone) {
                console.log("电话添加联系人返回：", res_addphone)
              }
            })
          }
        }
      })
    },

    switchTabIndex: function (index, auth) {
      let that = this;
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      if (index == 0) {
        //代配送
        let status = [1].join(',')
        wx.request({
          url: app.globalData.serverUrl + 'order/listV2',
          data: {
            status: status,
            pageNum: 1,
            pageSize: 100
          },
          header: {
            'Authorization': auth
          },
          success: function (res) {
            let data = res.data;
            console.log('代配送：', data)
            if (data.status != 200) {
              wx.showToast({
                title: data.msg,
                duration: 2000,
                icon: 'none'
              })
            } else {
              that.setData({
                orderToSend: data.data.data,
              })
            }
          },
          fail:function(){
            wx.showToast({
              title: '加载失败',
              duration:1500,
              icon:'none'
            })
          },
          complete:function(){
            wx.hideLoading()
          }
        })
      } else if (index == 1) {
        let status = [2].join(',')
        wx.request({
          url: app.globalData.serverUrl + 'order/listV2',
          data: {
            status: status,
            pageNum: 1,
            pageSize: 100
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
              if (data.data.data != null) {
                that.setData({
                  orderSending: data.data.data,
                })
              }
            }
          },
          fail:function(){
            wx.showToast({
              title: '加载失败',
              duration:1500,
              icon:'none'
            })
          },
          complete:function(){
            wx.hideLoading()
          }
        })
      } else {
        let status = [4, 8].join(',')
        wx.request({
          url: app.globalData.serverUrl + 'order/listV2',
          data: {
            status: status,
            pageNum: 1,
            pageSize: 100
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
              console.log('已完成配送:', data.data)
              if (data.data != null) {
                that.setData({
                  orderSent: data.data.data,
                })
              }
            }
          },
          fail:function(e){
            wx.showToast({
              title: '加载失败',
              duration:1500,
              icon:'none'
            })
          },
          complete:function(e){
            wx.hideLoading()
          }
        })
      }
    },


    cancelOrderSending: function (e) {
      let that = this;
      let orderId = e.currentTarget.dataset.orderId;
      let auth = wx.getStorageSync('token')
      wx.showModal({
        title: '提示',
        content: '确定取消该订单？',
        success: function (res) {
          if (res.cancel) {
          } else {
            that.cancelOrder(auth, orderId, that)
            wx.reLaunch({
              url: '/pages/home/home?currentTab=3',
            })
          }
        }
      })
    },
    cancelOrderToSend: function (e) {
      let that = this;
      let orderId = e.currentTarget.dataset.orderId;
      let auth = wx.getStorageSync('token')
      wx.showModal({
        title: '提示',
        content: '确定取消该订单？',
        success: function (res) {
          if (res.cancel) {
          } else {
            that.cancelOrder(auth, orderId, that)
            wx.reLaunch({
              url: '/pages/home/home?currentTab=3',
            })
          }
        }
      })
    },

    /**
     * 取消订单
     */
    cancelOrder: function (auth, orderId, that) {
      wx.request({
        url: app.globalData.serverUrl + 'order/cancel',
        header: {
          'Authorization': auth
        },
        data: {
          orderId: orderId
        },
        success: function (res) {
          let data = res.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500,
            })
            return false;
          }
          return true;
        }
      })
    },

    sendFinished: function (e) {

      let orderId = e.currentTarget.dataset.orderId;
      let auth = wx.getStorageSync('token')
      wx.showModal({
        title: '提示',
        content: '该订单确定已配送完成',
        success: function (e) {
          if (e.cancel) {

          } else {
            //
            wx.request({
              url: app.globalData.serverUrl + 'delivery/complete',
              data: {
                orderId: orderId
              },
              header: {
                "authorization": auth
              }, success: function (res) {
                let data = res.data;
                if (data.status != 200) {
                  wx.showToast({
                    title: data.msg,
                    duration: 1500,
                    icon: 'none'
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/home/home?currentTab=3',
                  })
                }
              }
            })
          }
        }
      })
    },



    beginSend: function (e) {
      let orderId = e.currentTarget.dataset.orderId;
      let auth = wx.getStorageSync('token')
      wx.request({
        url: app.globalData.serverUrl + 'delivery/begin',
        header: {
          'Authorization': auth
        },
        data: {
          orderId: orderId
        },
        success: function (e) {
          let data = e.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 1500
            })
          } else {
            wx.reLaunch({
              url: '/pages/home/home?currentTab=3',
            })
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '请求错误，请联系客服',
            duration: 1500,
            icon: 'none'
          })
        }
      })
    },



    tabClick: function (e) {
      let that = this;
      that.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
      let id = e.currentTarget.id;
      let auth = wx.getStorageSync('token')
      that.switchTabIndex(Number(id), auth)
    },
  },
  lifetimes:{
    attached: function () {
      // 显示设置
      var res = wx.getSystemInfoSync();
      var device = new RegExp("iOS");
      var result = device.test(res.system);
      let tmp = 48;
      let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
      this.setData({
        mainHeight: h,
      });
      var that = this;
      let sliderWidth = that.data.silderWidth;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
            sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
          });
        }
      });
      let activeIndex = that.data.activeIndex;
      let auth = wx.getStorageSync('token')
      that.switchTabIndex(activeIndex, auth)
    }
},

 

 
  

  

 


})