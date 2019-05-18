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
    //----
    cartList: [{//购物车   
      id: '1',
      name: 'oppo reno',
      price: '3440',
      num: 1,
      types: '白色/39码',
      check: true
    }, {
      id: '2',
      name: '啊哈额和福特好热惊讶所以就如同撒打发士大夫',
      price: '332',
      num: 1,
      types: '粉色/38码'
    }, {
      id: '3',
      name: '啊如何呀还是大范围推广哇额饿啊日hers的说法的事发生的',
      price: '120',
      num: 1,
      types: '白色/41码',
      check: true
    }, {
      id: '4',
      name: '阿桑的歌也会更好的反对犯得上的事发生的',
      price: '320',
      num: 1,
      types: '黑色/37码',
      check: true
    }, {
      id: '5',
      name: '阿桑的歌微软噶士大夫啊士大夫但是飞洒地方士大夫撒',
      price: '630',
      num: 1,
      types: '白色/39码',
      check: true
    }]

  },

  //点击全选  
  allcheckTap: function () {
    let shopcar = this.data.shopcarData,
      allsel = !this.data.allsel,//点击全选后allsel变化
      total = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].check = allsel;//所有商品的选中状态和allsel值一样
      if (allsel) {//如果为选中状态则计算商品的价格
        total += shopcar[i].price * shopcar[i].num;
      }
    }
    this.data.selarr = allsel ? shopcar : [];//如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空    
    this.setData({
      allsel: allsel,
      shopcarData: shopcar,
      total: total,
      selarr: this.data.selarr
    });
  },
  //点击移除商品  
  deleteshopTap: function () {
    var allsel = this.data.allsel,
      shopcar = this.data.shopcarData,
      selarr = this.data.selarr;
    if (allsel) {
      shopcar = [];
      this.setData({
        allsel: false
      });
    } else {
      console.log(selarr);
      for (var i = 0, len = selarr.length; i < len; i++) {//将选中的商品从购物车移除        
        console.log(selarr[i].id);
        for (var lens = shopcar.length - 1, j = lens; j >= 0; j--) {
          console.log(shopcar[j].id);
          if (selarr[i].id == shopcar[j].id) {
            shopcar.splice(j, 1);
          }
        }
      }
    }
    this.setData({
      shopcarData: shopcar,
      total: 0
    });
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
    let Index = e.currentTarget.dataset.index,
      shopcar = this.data.shopcarData,
      total = this.data.total,
      selarr = this.data.selarr;
    shopcar[Index].check = !shopcar[Index].check || false;
    if (shopcar[Index].check) {
      total += shopcar[Index].num * shopcar[Index].price;
      selarr.push(shopcar[Index]);
    } else {
      total -= shopcar[Index].num * shopcar[Index].price;
      for (let i = 0, len = selarr.length; i < len; i++) {
        if (shopcar[Index].id == selarr[i].id) {
          selarr.splice(i, 1);
          break;
        }
      }
    }
    this.setData({
      shopcarData: shopcar,
      total: total,
      selarr: selarr
    });
    this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
  },
  //点击加减按钮  
  numchangeTap: function (e) {
    let Index = e.currentTarget.dataset.index,//点击的商品下标值        
      shopcar = this.data.shopcarData,
      types = e.currentTarget.dataset.types,//是加号还是减号        
      total = this.data.total;//总计    
    switch (types) {
      case 'add':
        shopcar[Index].num++;//对应商品的数量+1      
        shopcar[Index].check && (total += parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格+商品单价      
        break;
      case 'minus':
        shopcar[Index].num--;//对应商品的数量-1      
        shopcar[Index].check && (total -= parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格-商品单价      
        break;
    }
    this.setData({
      shopcarData: shopcar,
      total: total
    });
  },
  //判断是否为全选  
  judgmentAll: function () {
    let shopcar = this.data.shopcarData,
      shoplen = shopcar.length,
      lenIndex = 0;//选中的物品的个数    
    for (let i = 0; i < shoplen; i++) {//计算购物车选中的商品的个数    
      shopcar[i].check && lenIndex++;
    }
    this.setData({
      allsel: lenIndex == shoplen//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
    });
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  /**   * 生命周期函数--监听页面显示   */
  onShow: function () {
    var shopcarData = this.data.cartList,//这里我是把购物车的数据放到app.js里的，这里取出来，开发的时候视情况加载自己的数据
      total = 0,
      selarr = this.data.selarr;
    for (let i = 0, len = shopcarData.length; i < len; i++) {//这里是对选中的商品的价格进行总结    
      if (shopcarData[i].check) {
        total += shopcarData[i].num * shopcarData[i].price;
        selarr.push(shopcarData[i]);
      }
    }
    this.setData({
      shopcarData: shopcarData,
      total: total,
      selarr: selarr
    });
    this.judgmentAll();//判断是否全选  
  }

})