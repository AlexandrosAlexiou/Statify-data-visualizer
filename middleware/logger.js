const moment = require('moment');

const logger = (req, res, next) => {
  console.log(
    `Timestamp: ${moment().format()} ${req.method} Request: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
