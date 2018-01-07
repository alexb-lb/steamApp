const fs = require('fs');
const path = require('path');
const moment = require('moment');

const logDir = path.join(__dirname, '../logs');

// create logs dir if note exists
fs.existsSync(logDir) || fs.mkdirSync(logDir);

module.exports = {
  writeError(errorMsg) {
    const currentDate = moment().format('DD MMM YYYY, HH:mm:ss');
    const errorTxt = `${currentDate}\n${errorMsg}\n\n`;
    fs.appendFile(path.join(logDir, 'error.txt'), errorTxt, 'utf8', (err) => {
      if (err) throw err;
    });
  },

  writeInfo(msg) {
    const currentDate = moment().format('DD MMM YYYY, HH:mm:ss');
    const infoTxt = `${currentDate}\n${msg}\n\n`;
    fs.appendFile(path.join(logDir, 'info.txt'), infoTxt, 'utf8', (err) => {
      if (err) throw err;
    });
  },
};