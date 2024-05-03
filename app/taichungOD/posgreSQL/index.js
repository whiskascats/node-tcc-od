const config = require("./db.config.js"); 
const { DataTypes, Sequelize } = require('sequelize');

class PostgreSQL {
  static async connect() {
    try {
      const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect
      });
      await sequelize.authenticate();
      console.log("連接 PostgreSQL 成功");
      return sequelize;
    } catch (error) {
      console.error("Error PostgreSQL =>", error);
    }
  }
  static async getSrtImportData() {
    const sequelize = await this.connect();
    return  sequelize.query("SELECT * FROM public.srt_import_data", { type: Sequelize.QueryTypes.SELECT})
    .then(function(results) {
      return results;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

module.exports = PostgreSQL;
