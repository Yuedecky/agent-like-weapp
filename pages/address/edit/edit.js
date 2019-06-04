
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var cellId;
var t = 0;
var show = false;
var moveY = 200;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,

    title: '编辑收货地址',
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: '',

    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],

    acceptorName:'',
    acceptorPhone:'',
    location:'',

    gender:1,
    detailAddress:'',
    defaultAddr: false,

    defaultChoose: 2,
    sexes:[
      {
        name: '先生',
        value: 1,
        checked:true
      },
      {
        name:'女士',
        value:2,
        checked:false
      }
    ]
  },

  getAcceptorName: function (e) {
    let that = this;
    that.setData({
      acceptorName: e.detail.value
    })
  },

  getAcceptorPhone:function(e){
    let that = this;
    that.setData({
      acceptorPhone:e.detail.value
    })
  },

  getlocationValue:function(e){
    let that =this;
    that.setData({
      location: e.detail.value
    })
  },

  getDetailAddressValue:function(e){
    let that = this;
    that.setData({
      detailAddress: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let auth = wx.getStorageSync('token');
    if(options.id){
      that.setData({
        id: options.id
      })
      wx.request({
        url: app.appData.serverUrl+'address/detail',
        data:{
          addressId:options.id
        },
        header:{
          "Authorization":auth
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
            let resData = data.data;
            let defaultAddr = resData.defaultChoose;
            if(defaultAddr ==1){
              that.setData({
                defaultAddr: true
              })
            }else{
              that.setData({
                defaultAddr:false
              })
            }
            let gender = resData.gender;
            if(gender ==1){
              that.setData({
                sexes:[{
                  name: '先生',
                  value:1,
                  checked:true
                },
                {
                  name: '女士',
                  value:2,
                  checked:false
                }]
              })
            }else{
              that.setData({
                sexes: [{
                  name: '先生',
                  value: 1,
                  checked: false
                },
                {
                  name: '女士',
                  value: 2,
                  checked: true
                }]
              })
            }
            that.setData({
              acceptorName: resData.name,
              acceptorPhone:resData.phone,
              detailAddress:resData.detailAddress,
              location:resData.province + ' ' + resData.city+ ' '+resData.area,
              gender:resData.gender
            })
          }
        }
      })
      if(options.title){
        that.setData({
          title: options.title,
        })
      }
    }
    
    wx.setNavigationBarTitle({
      title: that.data.title,
    })

    //获取省市区县数据
    let pid = 0;
    let cid = 0;
    let pname = '';
    let cname = '';
    that.getProvinceData().then(res1 => {
      pid = res1.data.data[0].id;
      pname = res1.data.data[0].name;
      that.getCityArr(pid).then(res2 => {
        cid = res2.data.data[0].id;
        cname = res2.data.data[0].name;
        that.getCountyInfo(cid).then(res3 => {
          that.setData({
            province: pname,
            city: cname,
            county: res3.data.data[0].name,
          })
        }).catch(res3 => {
        })
      }).catch(res2 => {
      })
    }).catch(res1 => {
    })
  },

  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    let that = this;
    let provinces = that.data.provinces;
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      if(provinces != null && provinces.length >0){
        let pid = provinces[val[0]].id;
        let province = provinces[val[0]].name;
        that.setData({
          province: province
        })
        that.getCityArr(pid).then(res => {
          let cityData = res.data.data;
          if (cityData != null && cityData.length > 0) {
            let city = cityData[0].name;
            that.setData({
              citys: res.data.data,
              city: city
            })
            let cid = res.data.data[0].id
            that.getCountyInfo(cid).then(countys => {
              ///获取地级市数据
              let countysData = countys.data.data;
              if (countysData != null && countysData.length > 0) {
                let county = countysData[0].name;
                that.setData({
                  countys: countys.data.data,
                  county: county
                })
              }
            })
          }
        });
      }
      
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        let citys = that.data.citys;
        let cid = citys[val[1]].id;
        getCountyInfoSync(cid).then(res => {
          //获取区县数据
          let resData = res.data.data;
          if(resData != null){
            let county = resData[0].name
            that.setData({
              countys: res.data.data,
              county: county
            })
          }
        })
      }
    }
    //更新数据
    index = val;
    let citys = that.data.citys;
    let countys = that.data.countys;
    that.setData({
      value: [val[0], val[1], val[2]]
    })
  },

  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (id == 'makeSure') {
      let addressName = that.data.province + ' ' + that.data.city + ' ' + that.data.county;
      that.setData({
        location: addressName
      })
    }
    animationEvents(this, moveY, show);
  },



  saveAddress:function(e){
    let that = this;
    let id=that.data.id;
    let auth = wx.getStorageSync('token')
    let name = that.data.acceptorName;
    let phone = that.data.acceptorPhone;
    let gender = that.data.gender;
    let province = that.data.province;
    let city = that.data.city;
    let area = that.data.county;
    let detailAddress = that.data.detailAddress;
    let defaultChoose = that.data.defaultChoose;
    let warn = '';
    if(gender == null || gender == undefined){
      warn = '性别不能为空';
    }
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (phone == '' || phone == undefined) {
      warn = "手机号码不能为空";
    } else if (phone.trim().length != 11 || !phoneReg.test(phone)) {
      warn = "手机号格式不正确";
    }
    if(warn != ''){
      wx.showToast({
        title: warn,
        duration:2000,
        icon:'none'
      })
      return
    }
    if(id >0){
      //edit
      wx.request({
        url: app.appData.serverUrl+'address/add',
        header:{
          'Authorization':auth
        },
        data:{
          id: id,
          name: name,
          phone: phone,
          gender: gender,
          province: province,
          city: city,
          area: area,
          detailAddress: detailAddress,
          defaultChoose: defaultChoose
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
            wx.showToast({
              title: '修改成功',
              duration:1000,
              icon:'none'
            })
            wx.navigateBack({
              
            })
          }
        },
        fail:function(res){
          wx.showToast({
            title: res.errMsg,
            icon:'none',
            duration:2000
          })
        }
      })      
    }else{
    //save
      wx.request({
        url: app.appData.serverUrl + 'address/add',
        data: {
          name: name ,
          phone: phone ,
          gender:gender ,
          province: province,
          city: city,
          area: area,
          detailAddress: detailAddress,
          defaultChoose: defaultChoose
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
            wx.navigateBack({
            })
          }
        }
      })
    }
    
  },

  getSexValue:function(e){
    let that =this;
    that.setData({
      gender: e.currentTarget.dataset.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    that.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    that.animation.translateY(200 + 'vh').step();
    that.setData({
      animation: this.animation.export(),
      show: show
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    

  },



  // 获取地级市数据
  getCityArr: function (pid) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.appData.serverUrl + 'suggest/city',
        data: {
          provinceId: pid
        },
        success: function (res) {
          that.setData({
            citys: res.data.data
          })
          resolve(res);
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  //获取省份数据
  getProvinceData: function () {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.appData.serverUrl + 'suggest/province',
        method: 'get',
        success: (res) => {
          that.setData({
            provinces: res.data.data
          })
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },


  // 获取区县数据
  getCountyInfo: function (cid) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.appData.serverUrl + 'suggest/area',
        data: {
          cityId: cid
        },
        success: function (res) {
          that.setData({
            countys: res.data.data
          })
          resolve(res);
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
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
  changeSwitch:function(e){
    //点击切换是否为默认地址
    let data = e.detail.value;
    let that = this;
    if(data){
      that.setData({
        defaultChoose: 1
      })
    }else{
      that.setData({
        defaultChoose:2
      })
    }
    
  }
})

  /**
   * 动画事件
*/
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

