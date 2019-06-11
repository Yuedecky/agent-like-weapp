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
    brands: [],
    current: 0, //当前选中的cate_id,
    pageNum:1,
    pageSize:10,
    
    loadFlag: true,
    count: 0,
    pullLoading: false,
    dataList: [],
    contentWaitingShow: false,
    canRequest: true,
    maxCount: 250,
    //--
  },
  properties:{
   name:{
     type: String,
     value:'index'
   }
  },

  lifetimes:{
    attached:function(){
      // 显示设置
      var res = wx.getSystemInfoSync();
      var device = new RegExp("iOS");
      var result = device.test(res.system);
      let tmp = 0;
      let h = res.windowHeight - res.windowWidth / 750 * 116 - tmp;
      this.setData({
        mainHeight: h,
        networkType: app.globalData.networkType
      });
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      //初始化
      this.getBrandsData(this);
    },

  },


  methods:{

/**
 * 加载商品分类
 */
    getBrandsData:function(that){
      let auth = wx.getStorageSync('token')
      wx.request({
        url: app.globalData.serverUrl + 'brand/query',
        method: 'get',
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
            let list = data.data;
            if (list !=null &&list.length > 0) {
              let brandCode = list[0].code;
              let bid = list[0].id;
              for (var i = 0; i < list.length; i++) {
                if (that.data.current == list[i].id) {
                  brandCode = list[i].code;
                  bid = list[i].id;
                  break;
                }
              }
              that.setData({
                brands: list,
                brandCode: brandCode
              });
              that.getProductsData(true,brandCode,bid)
            }else{
              that.setData({
                loadFlag:false
              })
            }
          }
        },
        fail:function(res){
          wx.showToast({
            title: '商品分类加载失败',
            duration:1500,
            icon:'none'
          })
        }
      })
    },


    //首页数据
    getProductsData(firstLoading,brandCode,bid) {
      let that = this;
      if (firstLoading) {
        that.setData({
          contentWaitingShow: false,
        })
      }else{
        that.setData({
          dataList:[],
          pageNum:1,
          canRequest:true,
          loadFlag:true
        })
      }
      wx.showLoading({
        title: '加载中',
        mask:true
      })
      let auth = wx.getStorageSync('token')
        wx.request({
          url: app.globalData.serverUrl + 'goods/query',
          data: {
            brandCode: brandCode,
            pageNum: that.data.pageNum,
            pageSize: that.data.pageSize
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
              let products = data.data;
              let page = data.page;
              let canRequest = false;
              if(products.list != null && products.list.length >0){
                let pageNum = that.data.pageNum;
                let tempData = that.data.dataList.concat(products.list);
                if(products.page.total <= that.data.pageSize){
                }else{
                  canRequest = true;
                }
                that.setData({
                  dataList: tempData,
                  current: bid,
                  contentWaitingShow: true,
                  loadingFlag: tempData.length >= parseInt(products.page.total) ? false : true,
                  canRequest:canRequest,
                  count:tempData.length,
                })
              }
            }
          },
          fail: function (err) {
            wx.showToast({
              title: '加载商品失败',
              duration: 1500,
              icon: "none"
            })
            that.setData({
              pageNum:1,
              canRequest:true
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
    },

    scrollDown() {
      let that = this;
      if (that.data.canRequest) {
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        if (that.data.count < that.data.maxCount) {
          that.setData({
            canRequest: true
          })
          let auth = wx.getStorageSync('token')
          let brandCode = that.data.brandCode;
          that.setData({
            pageNum: ++that.data.pageNum
          })
          if (that.data.loadFlag) {
            that.setData({
              pullLoading: true
            })
            wx.request({
              url: app.globalData.serverUrl + 'goods/query',
              header: { 'Authorization': auth },
              data: {
                brandCode: brandCode,
                pageNum: that.data.pageNum,    // 继续请求
                pageSize: that.data.pageSize,    // 每次请求的数目
              },
              success: function (res) {
                let data = res.data;
                if (data.status == 200) {
                  let list = data.data.list;
                  let page = data.data.page;
                  if(list != null && list.length >0){
                    let tempData = that.data.dataList.concat(list);
                    that.setData({
                      count: that.data.count + that.data.pageNum * that.data.pageSize,
                      dataList: tempData,
                      loadFlag: tempData.length >= parseInt(page.total) ? false : true,
                      pullLoading: false,
                      canRequest: tempData.length >= parseInt(page.total) ? false : true,
                    })
                  }
                 
                }else{
                  wx.showToast({
                    title: data.msg,
                    duration:1500,
                    icon:'none'
                  })
                }
              },
              fail: function (err) {
                wx.showToast({
                  title: '下拉加载商品失败',
                  duration:1500,
                  icon:'none'
                })
              }
            })
          } else {
            return
          }
        } else {
          this.setData({
            canRequest:false,
            loadFlag: false,
          })
        }
        wx.hideLoading()
      }
    },

    onAddCart: function (e) {
      let that = this;
      let pid = e.currentTarget.dataset.pid;
      let auth = wx.getStorageSync('token')
      wx.request({
        url: app.globalData.serverUrl + 'choose/add',
        data: {
          goodsId: pid,
          count: 1
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
            wx.reLaunch({
              url: '/pages/home/home?currentTab=1',
            })
          }
        }
      })
    },

    onClick: function (e) {
      let that = this;
      let bid = e.currentTarget.dataset.bid;
      let brandCode = e.currentTarget.dataset.code;
      let auth = wx.getStorageSync('token')
      that.setData({
        brandCode: brandCode,
        bid:bid
      })
      that.getProductsData(false,brandCode,bid)
    }

}



})
  
