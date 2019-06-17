import {
  Http
} from '../utils/http.js';
import {
  Config
} from '../config.js';

class ProductModel extends Http {

  getPageProducts({
    bcode,
    pageSize = Config.product.pageSize,
    pageNum = Config.pageNum
  }) {
    const data = {
      brandCode: bcode,
      pageNum: pageNum,
      pageSize: pageSize
    }
    return this.request({
      url: 'goods/query',
      data: data
    })
  }
}
export {
  ProductModel
}