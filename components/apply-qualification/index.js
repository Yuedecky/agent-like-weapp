Component({
    properties: {

    },
    data: {
        images: [],//临时图片地址
    },
    methods: {
        chooseImage: function () {
            this.triggerEvent('choose', {}, {})
        },
        previewImage() {
            this.triggerEvent('preview', {}, {})
        },
        submitApply() {
            this.triggerEvent('submit', {}, {})
        }
    },
})