"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const utils_1 = require("./utils");
const chalk_1 = require("chalk");
const unique_names_generator_1 = require("unique-names-generator");
const HOST = 'localhost';
const DEFAULT_PORT = 8000;
const connections = new Map();
const main = () => {
    const port = utils_1.getSafePort('start');
    startServer(port);
};
const startServer = (port = DEFAULT_PORT) => {
    const server = new net_1.Server();
    const serverConfig = { host: HOST, port: port };
    server.listen(serverConfig);
    console.log(`✅ Server on port: ${chalk_1.green(serverConfig.port)}\n`);
    server.on('connection', manageConnection);
    server.on('error', manageError);
};
const manageConnection = (socket) => {
    socket.setEncoding('utf-8');
    registerUser(socket, generateUsername());
    socket.on('data', (data) => manageData(socket, data));
    socket.on('close', () => manageClose(socket));
    socket.on('error', manageError);
};
const manageData = (socket, data) => {
    const fullMessage = `[${connections.get(socket)}]: ${data}`;
    if (data.toString().toUpperCase() === 'END') {
        socket.end();
        return;
    }
    sendMessage(socket, fullMessage);
};
const registerUser = (socket, username) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`${username} connected from ${chalk_1.cyan(remoteSocket)}`);
    connections.set(socket, username);
    const line = '\n===========================\n';
    socket.write('Username: ' + username + line);
};
const generateUsername = () => {
    const generatorConfig = {
        dictionaries: [unique_names_generator_1.starWars],
        separator: '-',
        length: 1,
    };
    return unique_names_generator_1.uniqueNamesGenerator(generatorConfig).toLowerCase();
};
const sendMessage = (origin, message) => {
    connections.forEach((_user, socket) => {
        if (socket !== origin) {
            socket.write(message);
        }
    });
};
const manageClose = (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    const username = connections.get(socket);
    connections.delete(socket);
    utils_1.logWarn(`Connection with ${username} from ${remoteSocket} closed.`);
};
const manageError = (error) => {
    utils_1.logError(error.message);
};
if (module === require.main) {
    main();
}
