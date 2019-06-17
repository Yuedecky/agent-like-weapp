Component({
  properties: {
    count: Number,
    cartId: Number,
  },
  data: {

  },
  methods: {
    numAdd: function(event) {
      this.triggerEvent("numchangeTap", {
        id: this.properties.cartId,
        type: 'add'
      }, {})
    },
    numDecrease: function(event) {
      this.triggerEvent("numchangeTap", {
        id: this.properties.cartId,
        type: 'minus'
      }, {})
    }
  }
})