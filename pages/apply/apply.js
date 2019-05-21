import { promisify } from '../../assets/js/promise.util';
import { $init, $digest } from '../../assets/js/common.util';

var app = getApp();
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

    //
    codeDisabled:false,
    codeText: '发送验证码',
    currentTime:60,
    

    applicant:{
      realName: '',
      applyPhone: '',
      applyCode: '',
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
    var warn  = '';
    if (that.data.qualification.images.length < 1) {
      warn = '请选择图片'
    } else if (that.data.qualification.images.length > 3) {
      warn = '之多只能上传三张图片'
    }
    if(warn !='' || warn != null){
      wx.showToast({
        title: warn,
        duration:2000,
        icon: 'none'
      })
    }
    //1.先调用上传
    var arr = [];
    let studentIdCards = that.data.qualification.images;
    for(var i=0;i<studentIdCards.length;i++){
     const uploadTask =  wx.uploadFile({
        url: app.appData.serverUrl + 'upload', //开发者服务器 url
        filePath: studentIdCards[i],
        name: 'file',
        success: function (res) {
          console.log(res)
          let data = JSON.parse(res.data)
          let url = data.data;
          arr.push(url);
          if( i == studentIdCards.length -1){
            that.setData({
              'qualification.images': arr
            })
          }
        },
        fail: function (res) {
          console.log(res)
        },
      })
      uploadTask.onProgressUpdate((res) =>{
        console.log(res)
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    }
    console.log('images:',studentIdCards)
    let applyPhone = that.data.applicant.applyPhone;
    let applyCode = that.data.applicant.applyCode;
    let realName = that.data.applicant.realName;
    let schoolName = that.data.school.schoolName;
    let schoolAddress = that.data.school.schoolAddress;
    let schoolDetailAddress = that.data.school.roomNo;
    studentIdCards = that.data.qualification.images;
    //2.提交申请
    wx.request({
      url: app.appData.serverUrl + 'user/apply',
      data:{
        loginName: applyPhone,
        verifyCode: applyCode,
        realName: realName,
        schoolName: schoolName,
        schoolAddress: schoolAddress,
        schoolDetailAddress: schoolDetailAddress,
        studentIdCards: studentIdCards
      },
      success:function(res){
        console.log(res)
        let data = res.data;
        if(data.status != 200){
          wx.showToast({
            title: '申请失败',
            icon:'none',
            duration:2000
          })
        }else{
          wx.reLaunch({
            url: '/pages/thanks/thanks',
          })
        }
      },
      fail:function(res){
        console.log(res)
      }
    })
    
  },

nextStepTwo:function(e){
  var that = this;
  this.setData({
    excludeType:''
  })

  var warn = ''
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
  
  if(warn =='' || warn == undefined){
    wx.navigateTo({
      url: '/pages/apply/apply?pageIndex=3' ,
    })
  }else{
    wx.showToast({
      title: warn,
      duration:2000,
      icon: 'none'
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

  onProvinceSelected:function(e){
    let that= this;
    let provinceId = e.currentTarget.dataset.id;
    that.setData({
      province: provinceId
    })
  },


  getApplyCode:function(e){
    var that = this;
    var realName = that.data.applicant.realName;
    var applyPhone = that.data.applicant.applyPhone;
    var applyCode = that.data.applicant.applyCode;
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    let warn = '';
    if (realName == '' || realName == undefined) {
      warn = '请填写真实姓名';
    } else if (applyPhone == '' || applyPhone == undefined || !phoneReg.test(applyPhone) || applyPhone.trim().length != 11) {
      warn = '请填写正确的手机号';
    } else if (applyCode == '' || applyCode == undefined) {
        warn = '请输入验证码';
    }
    if(warn == null || warn ==''){
      wx.showToast({
        title: warn,
        icon:'none'
      })
      return;
    }
    let currentTime = that.data.currentTime;
    let sendUrl = app.appData.serverUrl + 'verify/code/send';
      wx.request({
        url: sendUrl,
        data: {
          phone: that.data.applicant.applyPhone,
          type:2
        },
        success:function(e){
          console.log(e)
          let data = e.data;
          if(data.status != 200){
            wx.showToast({
              title: data.msg,
              duration:2000,
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: '发送成功',
              duration:2000,
              icon:'none'
            });
            //start
            //设置一分钟的倒计时
            var interval = setInterval(function () {
              currentTime--; //每执行一次让倒计时秒数减一
              that.setData({
                codeDisabled: true,
                text: currentTime + 's', //按钮文字变成倒计时对应秒数
              })
              //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  text: '重新发送',
                  currentTime: 61,
                  codeDisabled: false,
                  color: '#59b550'
                })
              }
            }, 1000);
           

           // end
          }
        },
        fail:function(e){
          console.log(e)
          wx.showToast({
            title: '发送失败',
            icon: 'none'
          })
        }
      })
  },

  nono:function(e){
    console.log(e)
  },

  checkInput:function(){
    var that = this;
    var warn = '';
    let pageIndex = Number(that.data.pageIndex)
    if(pageIndex ==1){
      
      return;
    }else if(pageIndex ==2){
      
    }else if(pageIndex == 3){
       
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
    var warn  = '';
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
    if(warn == null || warn == ''){
      wx.showToast({
        title: warn,
        icon: 'none',
        duration:2000
      })
      return
    }
    if(that.data.warn == '' || that.data.warn == undefined){
        wx.navigateTo({
          url: '/pages/apply/apply?pageIndex=2' 
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

