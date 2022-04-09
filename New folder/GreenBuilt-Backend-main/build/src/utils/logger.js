"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.loggerUtil = void 0;
var log4js_1 = __importDefault(require("log4js"));
var logger = log4js_1.default.getLogger();
logger.level = 'debug';
var loggerUtil = function (message, logType) {
    if (logType === void 0) { logType = 'INFO'; }
    logType === 'INFO' || logType === 'SERVER'
        ? logger.info(message)
        : logType === 'ERROR'
            ? logger.error(message)
            : null;
};
exports.loggerUtil = loggerUtil;
var log = function (data) {
    logger.debug(data);
};
exports.log = log;
//# sourceMappingURL=logger.js.map