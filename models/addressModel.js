import {
  Http
} from '../utils/http.js'

class AddressModel extends Http {

  getDefaultAddress() {
    return this.request({
      url: 'address/default',
    })
  }
}

export {AddressModel}