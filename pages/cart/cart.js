var app = getApp();
Page({
  data: {
    adminShow: true,//管理      
    shopcarData: [],//购物车数据      
    total: 0,//总金额      
    allsel: false,//全选      
    selarr: [],//选择的货物      
    hintText: '',//提示的内容      
    hintShow: false,//是否显示提示,


    //---
    deliveryName:'',
    deliveryPhone:'',
    deliveryAddress:'',
    totalRebate:0,
    //--
    //----
    shopcar: []
  },

  //点击全选  
  allcheckTap: function () {
      let shopcar = this.data.shopcarData;
      let that = this;
      let allsel = !that.data.allsel;//点击全选后allsel变化
      let total = 0;
      let totalRebate = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].check = allsel;//所有商品的选中状态和allsel值一样
      if (allsel) {//如果为选中状态则计算商品的价格
        total += shopcar[i].platformPrice * shopcar[i].count;
        totalRebate += shopcar[i].rebatePrice * shopcar[i].count;
      }
    }
    that.data.selarr = allsel ? shopcar : [];//如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空    
    that.setData({
      allsel: allsel,
      shopcarData: shopcar,
      total: total,
      totalRebate: totalRebate,
      selarr: that.data.selarr
    });
  },
  //点击移除商品  
  deleteshopTap: function () {
    let that = this;
    var allsel = that.data.allsel;
      var shopcar = that.data.shopcarData;
     var selarr = that.data.selarr;
     var del= []
     let auth = wx.getStorageSync('token')
    if (allsel) {
      shopcar = [];
      for(var i=0;i<shopcar.length;i++){
        del.push(shopcar[i].id)
      }
      that.setData({
        allsel: false
      });
    } else {
      for (var i = 0, len = selarr.length; i < len; i++) {//将选中的商品从购物车移除        
        console.log(selarr[i].id);
        for (var lens = shopcar.length - 1, j = lens; j >= 0; j--) {
          console.log(shopcar[j].id);
          if (selarr[i].id == shopcar[j].id) {
            shopcar.splice(j, 1);
            del.push(selarr[i].id)
          }
        }
      }
    }
    wx.request({
      url: app.appData.serverUrl+'choose/del',
      data:{
        chooseIds:JSON.parse(del)
      },
      header:{
        'Authorization': auth
      },
      success:function(res){
        console.log(res)
        let data = res.data;
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            duration:2000,
            icon:'none'
          })
        }else{
          that.setData({
            shopcarData: shopcar,
            total: 0,
            totalRebate:0
          });
        }
      }
    })
    
  },
  //点击加入收藏夹，这里按自己需求写吧  
  addcollectTap: function () {

  },
  //点击管理按钮，是否显示管理的选项  
  adminTap: function () {
    this.setData({
      adminShow: !this.data.adminShow
    });
  },
  //点击单个选择按钮  
  checkTap: function (e) {
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let shopcar =  that.data.shopcarData;
    let total = that.data.total;
    let totalRebate = that.data.totalRebate;
    let selarr = that.data.selarr;
    shopcar[index].check = !shopcar[index].check || false;
    if (shopcar[index].check) {
      total += shopcar[index].count * shopcar[index].platformPrice;
      totalRebate +=shopcar[index].count * shopcar[index].rebatePrice;
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
      selarr: selarr
    });
    this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
  },
  //点击加减按钮  
  numchangeTap: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;//点击的商品下标值        
     let  shopcar = that.data.shopcarData;
      let types = e.currentTarget.dataset.types;//是加号还是减号        
     let  total = that.data.total;//总计
     let totalRebate = that.data.totalRebate; 
      let auth = wx.getStorageSync('token') 
    switch (types) {
      case 'add':
        shopcar[index].num++;//对应商品的数量+1      
        shopcar[index].check && (total += parseInt(shopcar[index].platformPrice)) && (totalRebate += parseInt(shopcar[index].rebatePrice));//如果商品为选中的，则合计价格+商品单价      
        wx.request({
          url: app.appData.serverUrl + 'choose/modify/count',
          data: {
            chooseId: shopcar[index].id,
            count:1,
            type:1
          },
          header:{
            'Authorization': auth
          },
      success:function(res){
        let data = res.data;
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration:2000
          })
        }else{
          shopcar[index].count++
          that.setData({
            shopcarData: shopcar
          })
        }
      }
        })
        break;
      case 'minus':
        shopcar[index].num--;//对应商品的数量-1      
        shopcar[index].check 
        && (total -= parseInt(shopcar[index].platformPrice))
        && (totalRebate += parseInt(shopcar[index].rebatePrice));//如果商品为选中的，则合计价格-商品单价    
        wx.request({
          url: app.appData.serverUrl + 'choose/modify/count',
          data: {
            chooseId: shopcar[index].id,
            count: 1,
            type: 2
          },
          header:{
            'Authorization': auth
          },
          success: function (res) {
            let data = res.data;
            if(data.status !=200){
              wx.showToast({
                title: data.msg,
                icon:'none',
                duration:2000
              })
            }else{
            shopcar[index].count--
            that.setData({
              shopcarData: shopcar
            })
            }
          },
          fail:function(res){
            wx.showToast({
              title: '失败',
              duration:2000,
              icon:'none'
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


  //判断是否为全选  
  judgmentAll: function () {
    let that =this;
    let shopcar = that.data.shopcarData;
      let shoplen = shopcar.length;
     let  lenIndex = 0;//选中的物品的个数    
    for (let i = 0; i < shoplen; i++) {//计算购物车选中的商品的个数    
      shopcar[i].check && lenIndex++;
    }
    that.setData({
      allsel: lenIndex == shoplen//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
    });
  },
  onLoad: function (options) {
    
  },

  
  onReady: function () {
    let that = this;
    let auth = wx.getStorageSync('token')
    wx.request({
      url: app.appData.serverUrl + 'address/query',
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
          let address = data.data.address;
          let phone = data.data.phone;
          let addressee = data.data.addressee;
          that.setData({
            deliveryName: addressee,
            deliveryPhone: phone,
            deliveryAddress: address
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '获取收货地址失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  submitOrder:function(e){
    let that = this;
    let orderIds=[];
    let shopcar = that.data.selarr;
    for(var i=0;i<shopcar.length;i++){
      orderIds.push(shopcar[i].id)
    }
    if(orderIds.length <1){
      wx.showToast({
        title: '请选择商品',
        duration:2000,
        icon:'none'
      })
      return
    }
    let auth = wx.getStorageSync('token')
    orderIds = JSON.stringify(orderIds)
    wx.request({
      url: app.appData.serverUrl+'order/add',
      data:{
        chooseIds: orderIds.replace('[','').replace(']','')
      },
      header:{
        'Authorization': auth
      },
      success:function(res){
        let data = res.data;
        if(data.status !=200){
          wx.showToast({
            title: data.msg,
            duration:2000,
            icon:'none'
          })
        }else{
          wx.reLaunch({
            url: '/pages/order/order?activeIndex=0'
          })
        }
      }
    })
  },
  /**   * 生命周期函数--监听页面显示   */
  onShow: function () {
    let that = this;
    let auth = wx.getStorageSync('token')
    wx.request({
      url: app.appData.serverUrl + 'choose/list',
      method: 'get',
      header: {
        'Authorization': auth
      },
      success: function (res) {
        console.log(res)
        let data = res.data;
        if (data.status != 200) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          let list = data.data;
          if (list) {
            for (var i = 0; i < list.length; i++) {
              var product = list[i]
              product.check = false;
              product.platformPrice = Number(product.platformPrice)
              product.rebatePrice = Number(product.rebatePrice)
            }
            that.setData({
              shopcarData: list,
              allsel: false
            })
          }
        }
      }
    })
    var shopcarData = that.data.shopcarData;//这里我是把购物车的数据放到app.js里的，这里取出来，开发的时候视情况加载自己的数据
     let  total = 0;
     let totalRebate = 0;
      let selarr = that.data.selarr;
    for (let i = 0, len = shopcarData.length; i < len; i++) {//这里是对选中的商品的价格进行总结    
      if (shopcarData[i].check) {
        total += shopcarData[i].num * shopcarData[i].platformPrice;
        totalRebate += shopcarData[i].count * shopcarData[i].rebatePrice;
        selarr.push(shopcarData[i]);
      }
    }
    this.setData({
      total: total,
      totalRebate:totalRebate,
      selarr: selarr
    });
    this.judgmentAll();//判断是否全选  
  }

})