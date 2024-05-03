const fs = require('fs');
const path = require('path');
const axios = require("axios");

class Base {
    /**
     * @param {number} interval 
     * @return {Promise<void>}
     */
    static delay(interval) {
      return new Promise(function (resolve) {
          setTimeout(resolve, interval)
      })
    }

    static checkFolderAndMaker(filePath) {
      // 路徑正規化
      const targetFolder = path.normalize(filePath)
      const folders = targetFolder.split(path.sep)
      let path_temp = ''
      for(let folder of folders) {
        path_temp += `${folder}${path.sep}`
        if(!fs.existsSync(path_temp) && folder !== folders[0]) {
          fs.mkdirSync(path_temp)
        } else {

        }
      }
    }

    static async downloadJSON(url, dir) {
      try {
        console.log('下載JSON: ',url)
        await axios.get(url).then(response => {
          fs.writeFileSync(dir, JSON.stringify(response.data, null, 2));
        })
        .catch(err => {
          console.log('下載JSON失敗: ', url);
        })
      } catch (error) {
        console.log('儲存JSON檔發生錯誤: ', error.meaage);
      }
    }
}

module.exports = Base
