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