import { promisify } from '../../assets/js/promise.util';
import { $init, $digest } from '../../assets/js/common.util';
var area = require('../../assets/lib/area');
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var cellId;
var t = 0;
var show = false;
var moveY = 200;

Page({
  /**
   * 页面的初始数据
   */
  data: {

    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: '',
    ///bind:::;

    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    

    applicant:{
      realName: '',
      applyPhone: '',
      applyCode: '',
      isCode:false,
    },
    school:{
      schoolName: '',
      schoolAddress:'',
      roomNo:'',
    },
    qualification:{
      images: [],
      upImgUrl: '',
    },
    
    pageIndex:1,

    warn: '',
    excludeType: ''
  },

  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;


    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name
    })

  },

  submitApply: function (data) {
    var that = this;
    let images = that.data.qualification.images;
    let realName = that.data.applicant.realName;
    let applyPhone = that.data.applicant.applyPhone;
    let applyCode = that.data.applicant.applyCode;
    console.log(images)

    // wx.uploadFile({
    //   url: data.url, //开发者服务器 url
    //   filePath: images,
    //   name: 'file',
    //   formData: {
    //   },
    //   success: function (res) {
    //   },
    //   fail: function () {
    //   },
    // })
    wx.reLaunch({
      url: '/pages/thanks/thanks',
    })
  },

nextStepTwo:function(e){
  var that = this;
  this.setData({
    excludeType:''
  })
  that.checkInput();
  that.setData({
    pageIndex: this.data.pageIndex+1
  })
  if(that.data.warn =='' || that.data.warn == undefined){
    wx.switchTab({
      url: '/pages/apply/apply?pageIndex=' + that.data.pageIndex,
    })
  }
  
},
  getSchoolNameValue:function(e){
    this.setData({
      'school.schoolName': e.detail.value
    })
  },
  getPhoneNumberValue:function(e){
    this.setData({
      'applicant.applyPhone': e.detail.value
    })
  },

  getSchoolAddressValue:function(e){
    this.setData({
    'school.schoolAddress': e.detail.value
  })
  },
  getRoomNoValue:function(e){
    this.setData({
      'school.roomNo': e.detail.value
    })
  },

  getApplyCode:function(e){
      var that = this;
      that.checkInput('code');
  },

  

  checkInput:function(){
    var that = this;
    var warn = '';
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if(that.data.pageIndex ==1){
      var realName = that.data.applicant.realName;
      var applyPhone = that.data.applicant.applyPhone;
      var applyCode = that.data.applicant.applyCode;
      if (realName == '' || realName == undefined) {
        warn = '请填写真实姓名';
      } else if (applyPhone == '' || applyPhone == undefined || !phoneReg.test(applyPhone)|| applyPhone.trim().length !=11) {
        warn = '请填写正确的手机号';
      }else if(that.data.excludeType != 'code'){
        if (applyCode == '' || applyCode == undefined) {
          warn = '请输入验证码';
        }
      }
    }else if(that.data.pageIndex ==2){
      var schoolName = that.data.school.schoolName;
      var schoolAddress = that.data.school.schoolAddress;
      var roomNo = that.data.school.roomNo;
      if (schoolName == '' || schoolName == undefined) {
        warn = '请填写学校名称';
      } else if (schoolAddress == '' || schoolAddress == undefined) {
        warn = '请填写学校地址';
      } else if (roomNo == '' || roomNo == undefined) {
        warn = '请填写详细地址';
      }
    }else if(that.data.pageIndex == 3){
        if(that.data.qualification.images.length <1){
          warn = '请选择图片'
        }else if(that.data.qualification.images.length>3){
          warn = '之多只能上传三张图片'
        }
    }
    
    if (warn != '') {
      wx.showToast({
        title: warn,
        image:'/assets/images/error.png',
        duration: 2000
      })
      that.setData({
        warn: warn
      })
      return;
    }else{
      that.setData({
        warn:''
      })
    }
  },

  getRealNameValue:function(e){
    this.setData({
      'applicant.realName': e.detail.value
    })
  },
  getPhoneValue:function(e){
    this.setData({
      'applicant.applyPhone': e.detail.value.applyPhone
    })
  },
  getCodeValue:function(e){
    this.setData({
      'applicant.applyCode': e.detail.value
    })
  },
  nextStepOne: function (e) {
    var that = this;
    this.setData({
      excludeType:""
    })
    that.checkInput();
    that.setData({
      pageIndex: this.data.pageIndex+1
    })
    if(that.data.warn == '' || that.data.warn == undefined){
        wx.switchTab({
          url: '/pages/apply/apply?pageIndex=' + that.data.pageIndex,
        })
      }
  },

  /**
   * 
   */
  getApplyCode:function(e){
    var that = this;
    this.setData({
      excludeType:'code'
    })
    that.checkInput();
    if(that.data.applicant.isCode != '1111'){
      that.setData({
        warn: '验证码不正确'
      })
    }else{
      var curIndex = that.data.pageIndex+1;
      wx.navigateTo({
        url: '/pages/apply/apply?pageIndex='+curIndex,
      })
    }

  },

  longPress: function (e) {
    console.log(e)
    let that = this;
    let images = that.data.qualification.images;
    let index = e.currentTarget.dataset.index;
    wx.showModal({ //使用模态框提示用户进行操作
      title: '提示',
      content: '确定删除该图片?',
      success: function (res) {
        if (res.confirm) { //判断用户是否点击了确定
          images.splice(index,1)
          that.setData({
            'qualification.images':images
          })
        }
      }
    })
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          'qualification.images': that.data.qualification.images.concat(tempFilePaths),
        })
      }
    })
    console.log(that.data.qualification.images.length)
  },
  previewImage: function (e) {
    let that = this;
    console.log('preview image,e:',e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.qualification.images // 需要预览的图片http链接列表
    })
  },
  
  /**
   * 上传图片
   */
  uploadImg: function (e) {
    var that = this;
    console.log(e)
    if (that.data.qualification.images.length > 0 && that.data.qualification.images.length <=3) {
      uploadImg({
        url: that.data.qualification.upImgUrl,//这里是你图片上传的接口
        path: that.data.qualification.images//这里是选取的图片的地址数组
      });
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   // 初始化动画变量
  //   var that = this;
  //   that.setData({
  //     pageIndex:options.pageIndex
  //   })
  //   var animation = wx.createAnimation({
  //     duration: 500,
  //     transformOrigin: "50% 50%",
  //     timingFunction: 'ease',
  //   })
  //   this.animation = animation;
  //   // 默认联动显示北京
  //   var id = address.provinces[0].id
  //   this.setData({
  //     provinces: address.provinces,
  //     citys: address.citys[id],
  //     areas: address.areas[address.citys[id][0].id],
  //   })
  //   console.log(this.data)
  // },
  // 显示
  showMenuTap: function (e) {
    console.log('selectState')
    //获取点击菜单的类型 1点击状态 2点击时间 
    var menuType = e.currentTarget.dataset.type
    // 如果当前已经显示，再次点击时隐藏
    if (this.data.isVisible == true) {
      this.startAnimation(false, -200)
      return
    }
    this.setData({
      menuType: menuType
    })
    this.startAnimation(true, 0)
  },
  hideMenuTap: function (e) {
    this.startAnimation(false, -200)
  },
  // 执行动画
  startAnimation: function (isShow, offset) {
    var that = this
    var offsetTem
    if (offset == 0) {
      offsetTem = offset
    } else {
      offsetTem = offset + 'rpx'
    }
    this.animation.translateY(offset).step()
    this.setData({
      animationData: this.animation.export(),
      isVisible: isShow
    })
    console.log(that.data)
  },
  // 选择状态按钮
  selectState: function (e) {
    console.log('selectState1')
    this.startAnimation(false, -200)
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    console.log(this.data)

  },
  // 日志选择
  bindDateChange: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        begin: e.detail.value
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        end: e.detail.value
      })
    }
  },
  sureDateTap: function () {
    this.data.pageNo = 1
    this.startAnimation(false, -200)
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

  },
  
  

// bind::::::



  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;

    console.log(index + " => " + val);

    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name
    })

  },
  onLoad: function (options) {
    cellId = options.cellId;
    var that = this;
    that.setData({
      pageIndex:options.pageIndex
    })
    var date = new Date()
    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");

    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });

  },
  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
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
    animationEvents(this, moveY, show);

  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  tiaozhuan() {
    wx.navigateTo({
      url: '../../pages/modelTest/modelTest',
    })
  }
})

//动画事件
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

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "北京市",
    city: "市辖区",
    county: "东城区",
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}

