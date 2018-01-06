// built-in modules
const path = require('path');
const fs = require('fs');

// third-party modules
const axios = require('axios');

// models
const Database = require('./database');

// variables
const db = new Database();
const steamApiKey = require('../config/steamApiKey');

// data paths
const temp = path.join(__dirname, '../temp');
const dataPathAll = path.join(temp, 'steamDataAll.txt');
const dataPathPrices = path.join(temp, 'steamDataPrices.txt');


const getRequest = () => {
  axios({
    method: 'get',
    url: `http://api.csgo.steamlytics.xyz/v2/pricelist?key=${steamApiKey}`,
    responseType: 'stream'
  })
    .then((response) => {
      return streamAllDataToFile(response);
    })
    .then(() => {
      return readStreamedData();
    })
    .then((allSteamData) => {
      return writePricesIntoFile(allSteamData);
    })
    .then(() => {
      return db.query('TRUNCATE prices')
    })
    .then(() => {
      // return db.query(`LOAD DATA LOCAL INFILE 'D:/Git/cs_prices_rest/temp/steamDataPrices.txt' INTO TABLE prices`);
      return db.query(`LOAD DATA LOCAL INFILE '${dataPathPrices}' INTO TABLE prices`);
    })
    .then(() => {
      return db.close();
    })
    .catch((err) => {
      console.log(err);
    });
};

const streamAllDataToFile = (steamDataAll) => {
  return new Promise((res, rej) => {
    // create folder if not exists
    if (!fs.existsSync(temp)) {
      fs.mkdirSync(temp);
    }

    // stream response data to file
    const stream = steamDataAll.data.pipe(fs.createWriteStream(dataPathAll));
    stream.on("finish", res);
    stream.on("error", rej);
  });
};

const readStreamedData = () => {
  return new Promise((res, rej) => {
    fs.readFile(dataPathAll, 'utf8', (err, data) => {
      if (err) rej(err);
      else res(data);
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
      pricesString += `\t${skin.name}\t${skin.safe_price}\t${skin.safe_net_price}\n`
    }

    // write prices text into another file
    fs.writeFile(dataPathPrices, pricesString, function (err) {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};


module.exports = getRequest;