// models
const logger = require('./logger');
const Database = require('./database');
const db = new Database();

module.exports = {
  /** Get all items **/
  getPricesAll(req, res) {
    db.query('SELECT * FROM prices')
      .then((items) => {
        if (items.length > 0) {
          res.json({success: true, items})
        } else {
          res.json({success: true, items, message: 'No items found in database. Please try later'})
        }
      })
      .catch((err) => {
        logger.writeError(err);
        res.json({success: false, message: 'Oops! Some error occurs. Please try later'});
      });
  },

  /** Get item by name **/
  getPricesByItemName(req, res) {
    const itemName = req.params.itemName;

    db.query('SELECT * FROM prices WHERE name LIKE ?', `%${itemName}%`)
      .then((items) => {
        if (items.length > 0) {
          res.json({success: true, items})
        } else {
          res.json({success: true, items, message: 'Nothing founds'})
        }
      })
      .catch((err) => {
        logger.writeError(err);
        res.json({success: false, message: 'Some error occurs. Please try later'});
      });
  }
};
