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
    if (options.pageIndex == 1) {
      wx.setNavigationBarTitle({
        title: '基本信息',
      })
      that.setData({
        pageIndex :1
      })
      wx.clearStorageSync()
    } else if (options.pageIndex == 2) {
      wx.setNavigationBarTitle({
        title: '证件信息',
      })
      that.setData({
        pageIndex:2
      })
    }
  },

})