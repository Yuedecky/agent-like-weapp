var app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    tabs:['未完成','已完成'],
    activeIndex:0,
    sliderOffset: 0,
    sliderLeft:0, 
    silderWidth:110,
    popup: '',


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
    // ====
    orderPTotal:0,
    orderPReturn: 0,
    ordersP:[],
    orderListProcessing:[],
    orderListFinished: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      activeIndex:options.activeIndex || 0
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
    let activeIndex = that.data.activeIndex;
    let auth = wx.getStorageSync('token')
    that.switchTabIndex(activeIndex,auth)
  },

  switchTabIndex:function(index,auth){
    let that = this;
    if (index == 0) {
      let status = JSON.stringify([1, 2])
      wx.request({
        url: app.appData.serverUrl + 'order/list',
        data: {
          status: status.replace('[', '').replace(']', '')
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
            console.log(res)
            that.setData({
              orderListProcessing: data.data,
            })
          }
        }
      })
    } else {
      let status = JSON.stringify([4, 8])
      wx.request({
        url: app.appData.serverUrl + 'order/list',
        data: {
          status: status.replace('[', '').replace(']', '')
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
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that =this;
    that.setData({
      popup: this.selectComponent('#popup')
    })
    console.log(that.data.popup)
  },

  popupCancel: function (e) {
    this.popup.hide()
  },

  cancelOrder:function(e){
    let oid = e.currentTarget.dataset.orderid;
    let that = this;
    let auth = wx.getStorageSync('token')
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success:function(res){
        if(res.cancel){
          //
        }else{
          wx.request({
            url: app.appData.serverUrl + 'order/cancel',
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
                  url: '/pages/order/order?activeIndex=1',
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
      itemList: ['微信联系','电话联系'],
      success:function(res){
        if (res.tapIndex ==0){
          //微信联系客服
            that.setData({
              modalHidden: false
            })
        }else if(res.tapIndex ==1){
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
    // do something
      that.setData({
        modalHidden: true
      });
    
    wx.saveImageToPhotosAlbum({
      filePath: '/assets/images/customer.jpeg',
      success:function(res){
        wx.showToast({
          title: '保存成功',
          icon:'success',
          duration:2000
        })
      },
      fail:function(res){
        wx.showToast({
          title: '保存失败',
          icon:'none',
          duration:2000
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

  modalCancelProcess:function(e){
      let that = this;
      that.setData({
        modalHidden:true
      })
  },

  modalCancelFinished: function (e) {
    let that = this;
    that.setData({
      modalFinished: true
    })
  },

  doContact:function(){
    let that = this;
    //显示“呼叫”、“添加联系人”弹窗
    let phoneNumber = that.data.phoneNumber[0].phone;
    let phoneNumberName = that.data.phoneNumber[0].name;
    wx.showActionSheet({
      itemList: [phoneNumber, '呼叫', '添加联系人'],
      success: function (res) {
        console.log("点击电话 res：", res)
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
    that.switchTabIndex(Number(id),auth)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 //这个数是，tabBar从左到右的下标，从0开始
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
})