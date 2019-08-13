const winston = require('winston');

//Customer logger to create log files. 1 for All levels of logging and another specific for Error
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: './logs/complete.log',
      level: 'info'
    }),
    new winston.transports.File({
      filename: './logs/errors.log',
      level: 'error'
    })
  ]
});

module.exports = logger;