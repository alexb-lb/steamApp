// built-in modules
const path = require('path');
const fs = require('fs');

// third-party modules
const axios = require('axios');

// models
const Database = require('./database');
const logger = require('./logger');

// variables
const db = new Database();
const steamApiKey = require('../config/steamApiKey');

// data paths
const temp = path.join(__dirname, '../temp');
const dataPathAll = path.join(temp, 'steamDataAll.txt');
const dataPathPrices = path.join(temp, 'steamDataPrices.txt');

// request config
const requestOptions = {
  method: 'get',
  url: `http://api.csgo.steamlytics.xyz/v2/pricelist?key=${steamApiKey}`,
  responseType: 'stream'
};

const streamAllDataToFile = (steamDataAll) => {
  return new Promise((res, rej) => {
    // ensure temp directory exists
    fs.existsSync(temp) || fs.mkdirSync(temp);

    // stream response data to file
    const stream = steamDataAll.data.pipe(fs.createWriteStream(dataPathAll));
    stream.on("finish", res);
    stream.on("error", (err) => {
      return rej(err);
    });
  });
};

const readStreamedData = () => {
  return new Promise((res, rej) => {
    fs.readFile(dataPathAll, 'utf8', (err, data) => {
      if (err) {
        return rej(err);
      } else {
        res(data);
      }
    });
  })
};

const writePricesIntoFile = (allSteamData) => {
  return new Promise((res, rej) => {
    // parse data from str to obj
    let pricesString = '';
    const parsedSteamData = JSON.parse(allSteamData);

    // get only prices for each item
    for (let item in parsedSteamData.items) {
      const skin = parsedSteamData.items[item];
      pricesString += `\t${skin.name}\t${Math.round(skin.safe_price * 100)}\t${Math.round(skin.safe_net_price * 100)}\n`
    }

    // write prices text into another file
    fs.writeFile(dataPathPrices, pricesString, function (err) {
      if (err) {
        return rej(err);
      } else {
        res();
      }
    });
  });
};

/** Init function **/
module.exports = () => {
  axios(requestOptions)
    .then((response) => streamAllDataToFile(response))
    .then(() => readStreamedData())
    .then((allSteamData) => writePricesIntoFile(allSteamData))
    .then(() => db.query('TRUNCATE prices'))
    .then(() => db.query(`LOAD DATA LOCAL INFILE '${dataPathPrices}' INTO TABLE prices`))
    .then(() => {
      db.close();
      logger.writeInfo('Steam prices successfully loaded into DB');
    })
    .catch((err) => logger.writeError(err));
};