"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarn = exports.logError = exports.getSafePort = void 0;
const chalk_1 = require("chalk");
const getSafePort = (execution) => {
    if (process.argv.length < 3) {
        exports.logError(`Usage: "yarn ${execution} <port>"`);
    }
    const port = Number(process.argv[2]);
    if (isNaN(port)) {
        exports.logError(`Invalid port "${process.argv[2]}"`);
    }
    return port;
};
exports.getSafePort = getSafePort;
const logError = (message) => {
    console.error(`${chalk_1.red(message)}\n`);
    process.exit(1);
};
exports.logError = logError;
const logWarn = (message) => {
    console.log(chalk_1.yellow(`⚠  ${message}`));
};
exports.logWarn = logWarn;
