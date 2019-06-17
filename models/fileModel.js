import {
  Http
} from '../utils/http.js';
import {
  Config
} from '../config.js';
class FileModel extends Http {

  uploadFile(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: Config.apiUrl + 'upload',
        filePath: filePath,
        name: 'file',
        success: (res) => {
          resolve(res.data)
        },
        fail: (res) => {
          reject()
        }
      })
    });
  }

  chooseImage() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 3, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          resolve(res.tempFilePaths)
        },
        fail: (res) => {
          reject()
        }
      })
    })

  }

}

export {
  FileModel
}