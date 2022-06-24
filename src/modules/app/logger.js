'use strict';
const log4js = require('log4js');
const { ModuleKind } = require('typescript');

require('dotenv').config();
const logFile = process.env.LOG_PATH || './logs/app.log';

log4js.configure({
    appenders: {
        app: {
            type: 'file',
            filename: logFile,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss} %p %c - %m'
            }
        }
    },
    categories: {
        default: {
            appenders: ['app'],
            level: 'info' || 'all'
        }
    }
});


const logger = log4js.getLogger();
module.exports = logger;