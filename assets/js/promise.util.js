/**
 * 将wx的callback形式的API转换成支持Promise的形式
 */
function wxPromisify(fn){
  return 
   new Promise((resolve, reject) => {
    obj.success = function (res) {
      resolve(res)
    },
      obj.fail = function (res) {
        reject(res)
      }
  })
}

module.exports = {

  promisify: (api) => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  },
  wxPromisify: wxPromisify
  

}