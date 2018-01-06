// built-in modules
const http = require('http');
const path = require('path');

// third-party modules
const express = require('express');

// models
const cronJob = require('./models/cronJob');
const steamRequest = require('./models/steamRequest');
const restOperations = require('./models/restOperations');

/** Get steam prices every hour **/
// pattern: (sec/min/hour/day of month/month/day of week)
cronJob('00 00 * * * *', steamRequest);

steamRequest();

/** Server **/
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);


app.get('/', (req, res) => {
  res.send('Please use "/prices" to get all prices and "/prices/item name" to get specified item')
});

// restful api
app.get('/prices', restOperations.getPricesAll);
app.get('/prices/:itemName', restOperations.getPricesByItemName);


server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});