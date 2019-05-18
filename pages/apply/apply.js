import { promisify } from '../../assets/js/promise.util';
import { $init, $digest } from '../../assets/js/common.util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  submitApply: function (data) {
    var that = this;
    let images = that.data.qualification.images;
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
  onLoad: function (options) {
      $init(this);
      let that = this;
      that.setData({
        pageIndex: options.pageIndex
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