import {
    CodeModel
} from '../../models/codeModel.js';

var codeModel = new CodeModel();
Component({
    properties: {
    },
    data: {
        realName: '',
        applyPhone: '',
        applyCode: '',
        text: '获取验证码',
        codeDisabled: false
    },
    methods: {

        getRealNameValue: function (e) {
            let that = this;
            that.setData({
                realName: e.detail.value
            })
        },

        getCodeValue: function (e) {
            let that = this;
            that.setData({
                applyCode: e.detail.value
            })
        },


        getPhoneNumberValue: function (e) {
            let that = this;
            that.setData({
                applyPhone: e.detail.value
            })
        },

        checkInput() {
            var realName = this.data.realName;
            var applyPhone = this.data.applyPhone;
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
                return false;
            }
            return true;
        },
        getApplyCode: function (e) {
            var that = this;
            const res = that.checkInput();
            if (!res) {
                return;
            }
            let currentTime = that.data.currentTime;
            codeModel.verifyCodeSend(that.data.applyPhone, 2).then((res) => {
                if (res.status == 200) {
                    wx.showToast({
                        title: '发送成功',
                        duration: 2000,
                        icon: 'none'
                    });
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
                } else {
                    wx.showToast({
                        title: res.msg,
                        duration: 2000,
                        icon: 'none'
                    })
                }
            });
        },

    },



    submit() {
        var warn = '';
        if (warn != '') {
            wx.showToast({
                title: warn,
                duration: 2000,
                icon: 'none'
            })
            return
        }
        //1.先调用上传
        let realName = this.data.realName;
        let applyPhone = this.data.applyPhone;
        let applyCode = this.data.applyCode;
        //2.提交申请
        wx.request({
            url: app.globalData.serverUrl + 'user/apply',
            data: {
                loginName: applyPhone,
                verifyCode: applyCode,
                realName: realName,
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
            },
        })

    },

})