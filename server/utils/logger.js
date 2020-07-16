const winston = require('winston');
require('winston-daily-rotate-file');

const logDir = 'logs';

const infoLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format:'HH:mm:ss'}),
        winston.format.json()
    ),
    transports: [
        new (winston.transports.Console) ({
            level: 'info'
        }),
        new (winston.transports.DailyRotateFile)({
            filename: `${logDir}/info-%DATE%.log`,
            datePattern: 'YYYY-MM-DD'
        })
    ]
})

console.log = function() {
    infoLogger.info.apply(infoLogger, arguments);
};

const errorLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({format:'HH:mm:ss'}),
        winston.format.json()
    ),
    transports: [
        new (winston.transports.Console) ({
            level: 'error'
        }),
        new (winston.transports.DailyRotateFile)({
            filename: `${logDir}/errors-%DATE%.log`,
            datePattern: 'YYYY-MM-DD'
        })
    ]
})

console.error = function() {
    errorLogger.error.apply(errorLogger, arguments);
};

module.exports = {
    infoLogger,
    errorLogger
}