Component({
  properties: {
    address: Object,
  },
  data: {

  },
  methods: {
    onSwithAddress(event) {
      this.triggerEvent('addressTap', {
      }, {})
    }
  }
})