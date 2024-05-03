module.exports = {
  HOST: "localhost",    // Host Name
  USER: "Test",     // User Name
  PASSWORD: "1111",    // Password
  DB: "taichung",         // Database Name
  dialect: "postgres",  // 資料庫類別
  pool: {
    max: 5,             //　連結池中最大的 connection 數
    min: 0,
    acquire: 30000,     //　連結 Timeout 時間(毫秒)
    idle: 10000         //　連結被釋放的 idle 時間(毫秒)
  }
};