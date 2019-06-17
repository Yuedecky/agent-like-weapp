const promisify = require('../../assets/js/promise.util.js');
import {
  $init,
  $digest
} from '../../assets/js/common.util';
import {
  FileModel
} from '../../models/fileModel.js';

import {
  CodeModel
} from '../../models/codeModel.js';

var app = getApp();

const fileModel = new FileModel();
const codeModel = new CodeModel();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //
    codeDisabled: false,
    codeText: '发送验证码',
    currentTime: 60,


    applicant: {
      realName: '',
      applyPhone: '',
      applyCode: '',
    },

    qualification: {
      images: [],
      upImgUrl: '',
    },

    pageIndex: 1,
    warn: '',

    barTitle: ''
  },


  submitApply: function(data) {
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
      return
    }
    //1.先调用上传
    let studentIdCards = wx.getStorageSync('qualification.images');
    let realName = wx.getStorageSync('applicant.realName')
    let applyPhone = wx.getStorageSync('applicant.applyPhone')
    let applyCode = wx.getStorageSync('applicant.applyCode')
    studentIdCards = that.data.qualification.images.join(',')
    //2.提交申请
    wx.request({
      url: app.globalData.serverUrl + 'user/apply',
      data: {
        loginName: applyPhone,
        verifyCode: applyCode,
        realName: realName,
        studentIdCards: studentIdCards
      },
      success: function(res) {
        let data = res.data;
        if (data.status != 200) {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '/pages/thanks/thanks',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '申请失败，请联系客服',
          duration: 2000,
          icon: 'none'
        })
      },
      complete: function() {}
    })

  },



  getPhoneNumberValue: function(e) {
    let that = this;
    that.setData({
      'applicant.applyPhone': e.detail.value
    })
    wx.setStorageSync('applicant.applyPhone', e.detail.value)
  },








  getApplyCode: function(e) {
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
      success: function(e) {
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
        var interval = setInterval(function() {
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
      fail: function(e) {
        console.log(e)
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }
    })
  },


  getRealNameValue: function(e) {
    let that = this;
    that.setData({
      'applicant.realName': e.detail.value
    })
    wx.setStorageSync('applicant.realName', e.detail.value)
  },

  getCodeValue: function(e) {
    let that = this;
    that.setData({
      'applicant.applyCode': e.detail.value
    })
    wx.setStorageSync('applicant.applyCode', e.detail.value)
  },

  nextStepOne: function(e) {
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
    } else if (applyCode == '' || applyCode == undefined || applyCode.length != 6) {
      warn = '请填写6位验证码';
    }
    if (warn != '') {
      wx.showToast({
        title: warn,
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      codeModel.preCheck(applyCode, applyPhone, 2).then(res => {
        if (res.status == 200) {
          wx.navigateTo({
            url: '/pages/apply/apply?pageIndex=2'
          })
        } else {
          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      })
    }
  },


  longPress: function(e) {
    console.log(e)
    let that = this;
    let images = that.data.qualification.images;
    let index = e.currentTarget.dataset.index;
    wx.showModal({ //使用模态框提示用户进行操作
      title: '提示',
      content: '确定删除该图片?',
      success: function(res) {
        if (res.confirm) { //判断用户是否点击了确定
          images.splice(index, 1)
          that.setData({
            'qualification.images': images
          })
        }
      }
    })
  },

  chooseImage: function() {
    var that = this;
    wx.setStorageSync('chooseImageFlag', true)
    let imgArr = that.data.qualification.images || [];
    fileModel.chooseImage().then((res) => {
      let data = res[0];
      return fileModel.uploadFile(data)
    }).then(res => {
      imgArr.push(JSON.parse(res).data)
      that.setData({
        'qualification.images': imgArr
      })
    })
  },

  previewImage: function(e) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('进来了onUnload')
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },




  /**
   * 
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      pageIndex: options.pageIndex
    })
    if (options.pageIndex == 1) {
      wx.setNavigationBarTitle({
        title: '基本信息',
      })
      wx.clearStorageSync()
    } else if (options.pageIndex == 2) {
      wx.setNavigationBarTitle({
        title: '证件信息',
      })
    }
  },

})