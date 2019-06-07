var app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    brands: [],
    products:[],
    current: 0, //当前选中的cate_id
    index: 0 // 当前选中的index
  },
  properties:{
    brands:{
      type:Array
    },
    products:{
      type:Array
    },
    current:{
      type: Number
    },
    index:{
      type:Number
    }
  },

  pageLifetimes:{
    show:function(){
      let that = this;
      let current = that.data.current;
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
            that.setData({
              'brands': list,
            });
            let brandCode = 0;
            for (var i = 0; i < list.length; i++) {
              var brand = list[i]
              if (current != 0) {
                if (brand.id == current) {
                  brandCode = brand.code;
                  break;
                }
              }
            }
            brandCode = list[0].code;
            wx.request({
              url: app.globalData.serverUrl + 'goods/query',
              data: {
                brandCode: brandCode,
                pageNum: 1,
                pageSize: 40
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
                  that.setData({
                    products: data.data.list
                  })
                }
              }
            })
          }
        }
      })
    },
    hide:function(){

    },

  },

  methods:{

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
            wx.showToast({
              title: '加购成功',
              duration: 2000,
              icon: 'success'
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
      let list = []
      wx.request({
        url: app.globalData.serverUrl + 'goods/query',
        data: {
          brandCode: brandCode,
          pageNum: 1,
          pageSize: 10
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
            that.setData({
              'products': products.list,
              current: bid
            })
          }
        }
      })
    },

  },

  
})