import {
  Http
} from '../utils/http.js'
class BrandModel extends Http {
  getAllBrands() {
    const url = 'brand/query';
    return this.request({
      url: url
    });
  }
}


export {
  BrandModel
}