import {
  Http
} from '../utils/http.js';
import {
  Config
} from '../config.js';
class CartModel extends Http {

  getCartList({
    pageSize = Config.cart.pageSize || 5,
    pageNum = 1
  }) {
    return this.request({
      url: 'choose/list',
      data: {
        pageNum: pageNum,
        pageSize: pageSize
      }
    })
  }

  /**
   * 
   */
  changeNum(params) {
    if (params.type == 'minus') {
      return this.request({
        url: 'choose/modify/count',
        data: {
          type: 2,
          count: params.count,
          chooseId: params.pid
        },
        method: 'POST'
      })
    } else {
      return this.request({
        url: 'choose/modify/count',
        data: {
          type: 1,
          count: params.count,
          chooseId: params.pid
        },
        method: 'POST'
      })
    }

  }

  addCart(pid) {
    return this.request({
      url: 'choose/add',
      data: {
        goodsId: pid,
        count: 1
      },
      method: 'POST'
    })
  }


  removeCart(ids) {
    return this.request({
      url: 'choose/del',
      data: {
        chooseIds: ids
      },
      method: 'POST'
    })
  }

  applySend(ids, addressId) {
    return this.request({
      url: 'order/add',
      data: {
        chooseIds: ids,
        addressId: addressId
      },
      method: 'POST'
    })
  }
}

export {
  CartModel
}