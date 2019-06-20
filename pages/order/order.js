var app = getApp();
Component({
  

  /* 开启全局样式设置 */
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    tabs:['未完成','已完成'],
    activeIndex:0,
    sliderOffset: 0,
    sliderLeft:30, 
    silderWidth:100,
    modalHidden:true,
    modalFinished:true,

    phoneNumber:[{
      'name':'张先生',
      'phone':'18721634186'
    },
    {
      "name":"牛先生",
      "phone":'17321120155'
    }],
    orderPTotal:0,
    orderPReturn: 0,
    ordersP:[],
    orderListProcessing:[],
    orderListFinished: []
  },
  properties:{
    name:{
      type:String,
      value:'order'
    }
  },

  attached: function (options) {
    // 显示设置
    var res = wx.getSystemInfoSync();
    var device = new RegExp("iOS");
    var result = device.test(res.system);
    let tmp = 46;
    let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
    this.setData({
      mainHeight: h,
      networkType: app.globalData.networkType
    });
    var that = this;
    let activeIndex = 0;
    if(options != undefined && options.activeIndex != undefined){
      activeIndex = options.activeIndex;
    }
    that.setData({
      activeIndex: activeIndex
    })
    let sliderWidth = that.data.silderWidth;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    let auth = wx.getStorageSync('token')
    that.switchTabIndex(activeIndex, auth)
  },
    pageLifetimes: {
      show: function (options) {
        var that = this;
        let activeIndex = 0;
        if (options != undefined && options.activeIndex != undefined) {
          activeIndex = options.activeIndex;
        }
        that.setData({
          activeIndex: activeIndex
        })
        let sliderWidth = that.data.silderWidth;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
          }
        });
        let auth = wx.getStorageSync('token')
        that.switchTabIndex(activeIndex, auth)
      },
    },
    methods: {
      switchTabIndex: function (index, auth) {
        let that = this;
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        if (index == 0) {
          let status = [1, 2].join(',')
          wx.request({
            url: app.globalData.serverUrl + 'order/list',
            data: {
              status: status
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
                that.setData({
                  orderListProcessing: data.data,
                })
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
        } else {
          let status = [4, 8].join(',')
          wx.request({
            url: app.globalData.serverUrl + 'order/list',
            data: {
              status: status
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
                that.setData({
                  orderListFinished: data.data,
                })
              }
            },
            fail:function(e){
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
        }
        
      },



      cancelOrder: function (e) {
        let oid = e.currentTarget.dataset.orderid;
        let that = this;
        let auth = wx.getStorageSync('token')
        wx.showModal({
          title: '提示',
          content: '确定取消该订单？',
          success: function (res) {
            if (res.cancel) {
              //
            } else {
              wx.request({
                url: app.globalData.serverUrl + 'order/cancel',
                data: {
                  orderId: oid
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
                    wx.reLaunch({
                      url: '/pages/home/home?currentTab=2',
                    })
                  }
                }
              })
            }
          }
        })

      },

      /**
    * 确认
    */
      onContactUsProcess: function (e) {
        var that = this;
        wx.showActionSheet({
          itemList: ['微信联系', '电话联系'],
          success: function (res) {
            if (res.tapIndex == 0) {
              //微信联系客服
              that.setData({
                modalHidden: false
              })
            } else if (res.tapIndex == 1) {
              that.doContact()
            }
          }
        })
      },

      onContactUsFinished: function (e) {
        var that = this;
        wx.showActionSheet({
          itemList: ['微信联系', '电话联系'],
          success: function (res) {
            if (res.tapIndex == 0) {
              //微信联系客服
              that.setData({
                modalFinished: false
              })
            } else if (res.tapIndex == 1) {
              that.doContact()
            }
          }
        })
      },



      /**
       *  点击确认
       */
      modalConfirmProcess: function (e) {
        let that = this;
        that.setData({
          modalHidden: true
        });

        wx.saveImageToPhotosAlbum({
          filePath: '/assets/images/customer.jpeg',
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },


      /**
          * 
          *点击确认
         */
      modalConfirmFinished: function (e) {
        let that = this;
        // do something
        that.setData({
          modalFinished: true
        });
        wx.saveImageToPhotosAlbum({
          filePath: '/assets/images/customer.jpeg',
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },

      modalCancelProcess: function (e) {
        let that = this;
        that.setData({
          modalHidden: true
        })
      },


      modalCancelFinished: function (e) {
        let that = this;
        that.setData({
          modalFinished: true
        })
      },

      doContact: function () {
        let that = this;
        //显示“呼叫”、“添加联系人”弹窗
        let phoneNumber = that.data.phoneNumber[0].phone;
        let phoneNumberName = that.data.phoneNumber[0].name;
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
                firstName: phoneNumberName,
                mobilePhoneNumber: that.data.phoneNumber[0].phone,
                success: function (res_addphone) {
                  console.log("电话添加联系人返回：", res_addphone)
                }
              })
            }
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
      }

    }
    

})