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

  uploadimg: function (data) {
    var that = this;
    var i = data.i ? data.i : 0,//要上传的图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url, //开发者服务器 url
      filePath: data.path[i],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        success++;
        //do something
      },
      fail: function () {
        fail++;
      },
      compvare: function () {
        i++;
        if (i == data.path.length) {
          console.log("success：" + success + "fail" + fail);
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          uploadimg(data);
        }
      }
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
        
    }
    
    if (warn != '') {
      wx.showToast({
        title: warn,
        icon: '',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pageIndex: Number(options.pageIndex)
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