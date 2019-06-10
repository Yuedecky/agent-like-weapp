const promisify = require('../../assets/js/promise.util.js');
import { $init, $digest } from '../../assets/js/common.util';
var app = getApp();
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
    ///bind:::;

    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],



    //
    codeDisabled: false,
    codeText: '发送验证码',
    currentTime: 60,


    applicant: {
      realName: '',
      applyPhone: '',
      applyCode: '',
    },
    school: {
      schoolName: '',
      schoolAddress: '',
      roomNo: '',
    },
    qualification: {
      images: [],
      upImgUrl: '',
    },

    pageIndex: 1,
    warn: '',
  },

  uploadImageFile: function (idx) {
    let that = this;
    var imgList = that.data.qualification.images;
    let storeImages = wx.getStorageSync('qualification.images')
    if (!storeImages) {
      storeImages = []
    }
  },
  submitApply: function (data) {
    var that = this;
    var warn = '';
    if (that.data.qualification.images.length < 1) {
      warn = '请选择图片'
    } else if (that.data.qualification.images.length > 3) {
      warn = '至多只能上传三张图片'
    }
    if (warn != '') {
      wx.showToast({
        title: warn,
        duration: 2000,
        icon: 'none'
      })
    }
    //1.先调用上传
    let studentIdCards = wx.getStorageSync('qualification.images');
    let realName = wx.getStorageSync('applicant.realName')
    let applyPhone = wx.getStorageSync('applicant.applyPhone')
    let applyCode = wx.getStorageSync('applicant.applyCode')
    let schoolName = wx.getStorageSync('school.schoolName');
    let schoolAddress = wx.getStorageSync('school.schoolAddress')
    let schoolDetailAddress = wx.getStorageSync('school.roomNo');
    studentIdCards = that.data.qualification.images.join(',')
    //2.提交申请
    wx.request({
      url: app.globalData.serverUrl + 'user/apply',
      data: {
        loginName: applyPhone,
        verifyCode: applyCode,
        realName: realName,
        schoolName: schoolName,
        province:that.data.province,
        city:that.data.city,
        area: that.data.county,
        detailAddress:schoolDetailAddress,
        studentIdCards: studentIdCards
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
            url: '/pages/thanks/thanks',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '申请失败，请联系客服',
          duration: 2000,
          icon: 'none'
        })
      }
    })

  },

  nextStepTwo: function (e) {
    var that = this;
    wx.getStorageSync({
      key: 'school.schoolName',
      success: function (res) {
        that.setData({
          'school.schoolName': res.data
        })
      },
    })
    wx.getStorageSync({
      key: 'school.schoolAddress',
      success: function (res) {
        that.setData({
          'school.schoolAddress': res.data
        })
      },
    })
    wx.getStorageSync({
      key: 'school.roomNo',
      success: function (res) {
        that.setData({
          'school.roomNo': res.data
        })
      },
    })
    var warn = '';
    var schoolName = that.data.school.schoolName;
    var schoolAddress = that.data.school.schoolAddress;
    var roomNo = that.data.school.roomNo;
    if (schoolName == '' || schoolName == undefined) {
      warn = '请填写学校/小区名称';
    } else if (schoolAddress == '' || schoolAddress == undefined) {
      warn = '请输入学校/小区地址';
    } else if (roomNo == '' || roomNo == undefined) {
      warn = '请填写详细地址';
    }

    if (warn == '' || warn == undefined) {
      wx.navigateTo({
        url: '/pages/apply/apply?pageIndex=3',
      })
    } else {
      wx.showToast({
        title: warn,
        duration: 2000,
        icon: 'none'
      })
    }
  },
  getSchoolNameValue: function (e) {
    let that = this;
    that.setData({
      'school.schoolName': e.detail.value
    })
    wx.setStorageSync('school.schoolName', e.detail.value)
  },

  getPhoneNumberValue: function (e) {
    let that = this;
    that.setData({
      'applicant.applyPhone': e.detail.value
    })
    wx.setStorageSync('applicant.applyPhone', e.detail.value)
  },



  getRoomNoValue: function (e) {
    let that = this;
    that.setData({
      'school.roomNo': e.detail.value
    })
    wx.setStorageSync('school.roomNo', e.detail.value)
  },




  getApplyCode: function (e) {
    var that = this;
    var realName = wx.getStorageSync('applicant.realName');
    var applyPhone = wx.getStorageSync('applicant.applyPhone');
    var applyCode = wx.getStorageSync('applicant.applyCode');
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    let warn = '';
    if (realName == '' || realName == undefined) {
      warn = '请填写真实姓名';
    } else if (applyPhone == '' || applyPhone == undefined || !phoneReg.test(applyPhone) || applyPhone.trim().length != 11) {
      warn = '请填写正确的手机号';
    }
    if (warn != '') {
      wx.showToast({
        title: warn,
        icon: 'none'
      })
      return;
    }
    let currentTime = that.data.currentTime;
    let sendUrl = app.globalData.serverUrl + 'verify/code/send';
    wx.request({
      url: sendUrl,
      data: {
        phone: that.data.applicant.applyPhone,
        type: 2
      },
      success: function (e) {
        let data = e.data;
        if (data.status != 200) {
          wx.showToast({
            title: data.msg,
            duration: 2000,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '发送成功',
            duration: 2000,
            icon: 'none'
          });
        }
        //start
        //设置一分钟的倒计时
        var interval = setInterval(function () {
          currentTime--; //每执行一次让倒计时秒数减一
          that.setData({
            codeDisabled: true,
            codeText: currentTime + 's', //按钮文字变成倒计时对应秒数
          })
          //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
          if (currentTime <= 0) {
            clearInterval(interval)
            that.setData({
              codeText: '重新发送',
              currentTime: 61,
              codeDisabled: false,
              color: '#59b550'
            })
          }
        }, 1000);
      },
      fail: function (e) {
        console.log(e)
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    })
  },


  getRealNameValue: function (e) {
    let that = this;
    that.setData({
      'applicant.realName': e.detail.value
    })
    wx.setStorageSync('applicant.realName', e.detail.value)
  },

  getCodeValue: function (e) {
    let that = this;
    that.setData({
      'applicant.applyCode': e.detail.value
    })
    wx.setStorageSync('applicant.applyCode', e.detail.value)
  },

  nextStepOne: function (e) {
    var that = this;
    var realName = wx.getStorageSync('applicant.realName');
    var applyPhone = wx.getStorageSync('applicant.applyPhone');
    var applyCode = wx.getStorageSync('applicant.applyCode');
    let phoneReg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    let warn = '';
    if (realName == '' || realName == undefined) {
      warn = '请填写真实姓名';
    } else if (applyPhone == '' || applyPhone == undefined || !phoneReg.test(applyPhone) || applyPhone.trim().length != 11) {
      warn = '请填写正确的手机号';
    } else if (applyCode == '' || applyCode == undefined) {
      warn = '请填写验证码';
    }
    if (warn != '') {
      wx.showToast({
        title: warn,
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.request({
        url: app.globalData.serverUrl + 'verify/code/pre/check',
        data: {
          phone: wx.getStorageSync('applicant.applyPhone'),
          verifyCode: wx.getStorageSync('applicant.applyCode'),
          type: 2,
        },
        success: function (e) {
          let data = e.data;
          if (data.status != 200) {
            wx.showToast({
              title: data.msg,
              duration: 2000,
              icon: 'none'
            })
          } else {
            wx.navigateTo({
              url: '/pages/apply/apply?pageIndex=2'
            })
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '无法发送请求',
            duration: 2000,
            icon: 'none'
          })
        }
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
          images.splice(index, 1)
          that.setData({
            'qualification.images': images
          })
        }
      }
    })
  },
  chooseImage: function () {
    var that = this;
    var imgArr = that.data.qualification.images;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.serverUrl + 'upload', //开发者服务器 url
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            let data = JSON.parse(res.data)
            let url = data.data;
            imgArr.push(url);
            that.setData({
              'qualification.images': imgArr
            })
          },
          fail: function (res) {
            console.log(res)
            wx.showToast({
              title: res.errMsg,
              duration: 2000,
              icon: 'none'
            })
          },
        })
      }
    })
  },
  previewImage: function (e) {
    let that = this;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.qualification.images // 需要预览的图片http链接列表
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

 

  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    let that = this;
    let provinces = that.data.provinces;
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      if (provinces != null && provinces.length > 0) {
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
        let city = citys[val[1]].name;
        that.getCountyInfo(cid).then(res => {
          //获取区县数据
          let resData = res.data.data;
          if (resData != null) {
            let county = resData[0].name
            that.setData({
              countys: res.data.data,
              county: county,
              city: city
            })
          }
        })
      } else if (index[2] != val[2]) {
        //更新了區域
        let countys = that.data.countys;
        that.setData({
          county: countys[val[2]].name
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
  onLoad: function (options) {
    cellId = options.cellId;
    var that = this;
    that.setData({
      pageIndex: options.pageIndex
    })
    if (options.pageIndex == 1) {
      wx.clearStorageSync()
    }
    //获取省市区县数据
    let pid = 0;
    let cid =0;
    let pname='';
    let cname='';
    that.getProvinceData().then(res1=>{
      pid = res1.data.data[0].id;
      pname = res1.data.data[0].name;
      that.getCityArr(pid).then(res2 => {
        cid = res2.data.data[0].id;
        cname = res2.data.data[0].name;
        that.getCountyInfo(cid).then(res3=>{
          that.setData({
              province: pname,
              city: cname,
              county: res3.data.data[0].name,
            })
        }).catch(res3=>{
        })
      }).catch(res2=>{
      })
    }).catch(res1=>{
    })
  },

  // ---------------- 分割线 ---------------- 

  //获取省份数据
  getProvinceData: function() {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.serverUrl + 'suggest/province',
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

// 获取地级市数据
getCityArr:function(pid) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.serverUrl + 'suggest/city',
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


// 获取区县数据
getCountyInfo:function(cid){
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: app.globalData.serverUrl + 'suggest/area',
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


  // ------------------- 分割线 --------------------
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
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    moveY = 200;
    show = true;
    t = 0;
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (id == 'makeSure') {
      let addressName = that.data.province + ' ' + that.data.city + ' ' + that.data.county;
      that.setData({
        'school.schoolAddress': addressName
      })
      wx.setStorageSync('school.schoolAddress', addressName)
    }
    animationEvents(this, moveY, show);
  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
})

//动画事件
function animationEvents(that, moveY, show) {
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

 
  
