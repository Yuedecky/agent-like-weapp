Component({
    properties: {
        realName: String,
        applyPhone: String,
        applyCode: String,
    },
    data: {
        isCode: false,
        text: '请输入验证码',
        codeDisabled: false
    },
    methods: {
        next() {
            this.triggerEvent('next', {}, {})
        }
    },
})