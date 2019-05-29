// Winston Logging Setup
var appRoot = require('app-root-path');
var { createLogger, format, transports } = require('winston');

var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/captive-portal-login.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

var logger = new createLogger({
  format: format.combine(
    format.timestamp({ 
      format: 'YYYY-MM-DD HH:mm:ss'
      }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf((info) => {
      return `${info.timestamp} ${info.level} ${info.message}`;
    })
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;
