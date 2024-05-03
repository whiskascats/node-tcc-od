const fs = require('fs');
const path = require('path');

function getCSV() {
  const filePath = path.join(__dirname, '../public/files/srt_import_data.csv');
  const tableName = 'srt_import_data';

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err.message);
      return;
    }
    const rows = data.replace(/"/g, "\'").split('\r\n').map(row => row.split(','));
    const header = rows[0].map(item => item.replace(/'/g, ''))
    let sql = `INSERT INTO ${tableName} (${header.join(', ')}) VALUES`;
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i]
      sql += `(${values.join(', ')}),`
    }
    sql = sql.replace(/\u200d/g, '').slice(0,-1) + ';';
    fs.writeFile(path.join(__dirname, '../public/files/srt_import_data.txt'), sql, (err) => {

    });
  });
}
(function() {
  getCSV()
})()