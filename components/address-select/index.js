Component({
  properties: {
    name: String,
    address: String,
    phone: String
  },
  data: {

  },
  methods: {
    onSwithAddress(event) {
      console.log(event)
      this.triggerEvent('addressTap', {

      }, {})
    }
  }
})