const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Utility = require('./../utils/Utility');
const PostgreSQL = require('./posgreSQL/index');
const url = require('url');

const getPathInfo = async (fileUrl) => {
  let info = [];
  try {
    let response = await axios.get(fileUrl);
    console.log(fileUrl+' 讀取成功');
    // await Utility.delay(500)
    const htmlData = response.data.replace(/[\n\r]/g, '');
    const h1 = cheerio.load(htmlData)('h1').text();
    let lines = htmlData.split('<br>');
    
    for(let line of lines) {
      if(line.indexOf('資料夾')>-1 && line.indexOf('2015')>-1) {
        const $ = cheerio.load(line);
        const href = $('a').attr('href');
        let lineInfo = await getPathInfo(`https://govstat.taichung.gov.tw/TCSTAT/Page/${href}`)
        info = info.concat(lineInfo)
      }
      else if(line.indexOf('json')>-1) {
        const reg = new RegExp(/^\d{4}\/\d{2}\/\d{2} +.{2} +\d{2}:\d{2}:\d{2}　+(.+json$)/);
        const jsonName = line.match(reg)[1];
        const queryParams = url.parse(fileUrl, true);
        info.push({
          fileUrl: `https://govstat.taichung.gov.tw/TCSTAT/Resources/StatisticData/${jsonName}`,
          fileName: jsonName,
          date: line.slice(0,22),
          query_param: queryParams.query.SelectDirs,
          rpt_no: jsonName.split('_')[0],
          rpt_name: jsonName.split('_')[1].replace('.json',''),
          data_date: moment(line.slice(0,10)).format('YYYY-MM-DD')
        });
      }
    }
  } catch (error) {
    console.log(url+'讀取失敗: ', error);
  }
  return info;
};

const downloadFile = async (data) => {
  fs.writeFileSync(`${__dirname}/files/taichungOD_${moment().format('YYYYMMDDHHmmss')}.json`, JSON.stringify(data, null, 4))
  // for(let filePath of filePaths) {
  //   const pathName = filePath.replace('https://govstat.taichung.gov.tw/TCSTAT/Resources/StatisticData/', '').split('/')
  //   const fileName = pathName.pop();
  //   const folderPath = pathName.join('/');
  //   Utility.checkFolderAndMaker(`${__dirname}/files/data/${folderPath}`)
  //   if(fileName !== '_.json') {
  //     await Utility.downloadJSON(filePath,`${__dirname}\/files\/data\/${folderPath}\/${fileName}`)
  //   }
  // }
};
(async () => {
  let resluts = await PostgreSQL.getSrtImportData();
  let fileList = await getPathInfo('https://govstat.taichung.gov.tw/TCSTAT/Page/List.aspx');
  fileList.forEach(file => {
    let storeFile = resluts.find(item => item.query_param === file.query_param && item.rpt_no === file.rpt_no && item.rpt_name === file.rpt_name)
    if(storeFile) {
      console.log('已存在: ', file.fileName);
    } else {
      console.log('不存在: ', file.fileName);
    }
  })
  downloadFile(fileList)
  // let filePaths = await TaichungOD.downloadFile();
})()