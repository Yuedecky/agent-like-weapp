const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#8a8a8a",
    selectedColor: "#1296db",
    list: []  //tabBar的数据
  },
  lifetimes: {
    //组件实例刚刚被创建好时， created 生命周期被触发。
    //此时，组件数据 this.data 就是在 Component 构造器中定义的数据 data
    // 此时还不能调用 setData 。 
    //通常情况下，这个生命周期只应该用于给组件 this 添加一些自定义属性字段。
    created(){
      console.log('in custom-tab-bar created(),tabbars: ',app.appData.tabbars)
    },
    //组件的生命周期函数
    attached() {
      console.log('in custom-tab-bar attached(),tabbars:',app.appData.tabbars)
      this.setData({
        list: app.appData.tabbars
      })
    },
    //在组件离开页面节点树后， detached 生命周期被触发。
    //退出一个页面时，如果组件还在页面节点树中，则 detached 会被触发
    detached(){

    }

  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})