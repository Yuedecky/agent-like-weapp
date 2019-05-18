Page({

  /**
   * 页面的初始数据
   */
  data: {
    level: [
      {
        cate_id: 1,
        cate_name: "华为",
        ishaveChild: true,
        children:
          [
            {
              child_id: 1,
              name: '联想Z5',
              image: "https://img10.360buyimg.com/mobilecms/s500x500_jfs/t1/7514/35/14480/132195/5c650f61E7fab2029/39353c4818bbb3eb.jpg",
              desc:'这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 2,
              name: '华为P8',
              image: "https://img11.360buyimg.com/mobilecms/s500x500_jfs/t10357/244/2831662005/146980/ba7823ad/5cdb5f8aN4a876602.png",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 3,
              name: '畅想9S',
              image: "https://img12.360buyimg.com/n1/s450x450_jfs/t1/24205/2/14862/179077/5cb6d175E92733807/46e7ace99f41dd41.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 4,
              name: '荣耀8X',
              image: "https://img14.360buyimg.com/n7/jfs/t1/21333/14/5246/180334/5c3ad7b6Ef7d727c0/c16e93d0bf77a31f.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            }
          ]
      },
      {
        cate_id: 2,
        cate_name: "OPPO",
        ishaveChild: true,
        children:
          [
            {
              child_id: 10,
              name: 'oppo reno',
              image: "https://img13.360buyimg.com/n1/s450x450_jfs/t1/31078/6/11532/738001/5cb562bdE1d08d00a/87364a478e3e887b.png",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 11,
              name: 'OPPO k3',
              image: "https://img10.360buyimg.com/n7/jfs/t28192/156/1399223319/112787/40eef728/5cde16a7N2455e8ac.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 13,
              name: 'OPPO A9x',
              image: "https://img13.360buyimg.com/n7/jfs/t10753/133/2938096226/161040/5b30efe2/5cdd26c6N6c4e0f69.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 14,
              name: 'OPPO k1',
              image: "https://img14.360buyimg.com/n7/jfs/t28060/311/116648663/262308/9d2b10d4/5be84358Nbc650d88.jpg"
            },
            {
              child_id: 15,
              name: 'OPPO R17',
              image: "https://img11.360buyimg.com/n7/jfs/t27439/15/91473556/192803/cd10d3fe/5b84b36dN0f3e396f.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 16,
              name: 'OPPO A5',
              image: "https://img14.360buyimg.com/n7/jfs/t25636/139/1182405101/82126/4e7a2eca/5b8ca676Nbba80612.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 18,
              name: 'OPPO A7',
              image: "https://img11.360buyimg.com/n7/jfs/t25564/327/2615611632/135559/d3c69840/5bebd32eN3bf6f987.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            }
          ]
      },
      {
        cate_id: 3,
        cate_name: "VIVO",
        ishaveChild: true,
        children:
          [
            {
              child_id: 21,
              name: 'VIVO Z3',
              image: "https://img14.360buyimg.com/n7/jfs/t27616/251/1425719819/224805/20c2401e/5bc831fdN61f8d9d2.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 22,
              name: 'vivo x27Pro',
              image: "https://img13.360buyimg.com/n7/jfs/t1/11399/24/15514/162895/5caaa600E914adbf6/a7ccdc94f46460ed.jpg"
            },
            {
              child_id: 23,
              name: 'vivo iQOO',
              image: "https://img12.360buyimg.com/n7/jfs/t1/31199/14/3993/287777/5c791bb5Ebaa929af/044c52520956ebfb.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            },
            {
              child_id: 24,
              name: 'vivo z3x',
              image: "https://img13.360buyimg.com/n7/jfs/t1/42351/11/593/190176/5cc2d0b5Ede0e520e/22f6b0b07075f1b7.jpg",
              desc: '这是简介',
              salePrice: 2344.34,
              commission: 129
            }
          ]
      },
      {
        cate_id: 4,
        cate_name: "小米",
        ishaveChild: true,
        children: [{
            child_id: 43,
            name: '小米8SE',
          image: "https://img11.360buyimg.com/n7/jfs/t22330/332/515182850/188708/3dbe80f8/5b0fbaabN3229c7a3.jpg",
          desc: '这是简介',
          salePrice: 2344.34,
          commission: 129
        },
        {
          child_id: 44,
          name: '小米 redmi note7',
          image: "https://img13.360buyimg.com/n7/jfs/t1/9085/2/12381/146200/5c371c5bE08328383/4f4ba51aed682207.jpg",
          desc: '这是简介',
          salePrice: 2344.34,
          commission: 129
        },{
          child_id:45,
          name:'小米 redmi note7 pro',
          image:'https://img11.360buyimg.com/n7/jfs/t1/19699/33/11137/76839/5c8b69acEaa4b91dd/3054e7cd8d3d0e68.jpg',
          desc: '深空黑8G+128G',
          salePrice: 2344.34,
          commission: 129
        }]
      }
    ],

    current: 1, //当前选中的cate_id
    index: 0 // 当前选中的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onAddCart:function(e){
    let that = this;
    let pid = e.currentTarget.dataset.pid;
    wx.showToast({
      title: '加入成功',
      duration:2000,
      icon:'success'
    })
    const query= wx.createSelectorQuery();
    query.select("#the-cart" + pid).boundingClientRect(function(rect){
      console.log('rect:',rect)
    })
  },

  onClick: function (e) {
    this.setData({
      current: e.target.dataset.id,
      index: e.target.dataset.index
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    
  }
})