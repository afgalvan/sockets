import { Server, Socket } from 'net';
import { getSafePort, logError, logWarn } from './utils';
import { cyan, green } from 'chalk';
import { uniqueNamesGenerator, Config, starWars } from 'unique-names-generator';

const HOST = 'localhost';
const DEFAULT_PORT = 8000;
const connections = new Map<Socket, string>();

const main = (): void => {
  const port = getSafePort('dev:server');
  startServer(port);
};

const startServer = (port: number = DEFAULT_PORT): void => {
  const server = new Server();
  const serverConfig = { host: HOST, port: port };

  server.listen(serverConfig);
  console.log(`✅ Server on port: ${green(serverConfig.port)}\n`);

  server.on('connection', manageConnection);
  server.on('error', manageError);
};

const manageConnection = (socket: Socket): void => {
  socket.setEncoding('utf-8');

  registerUser(socket, generateUsername());
  socket.on('data', (data) => manageData(socket, data));
  socket.on('close', () => manageClose(socket));
  socket.on('error', manageError);
};

const manageData = (socket: Socket, data: Buffer): void => {
  const fullMessage = `[${connections.get(socket)}]: ${data}`;
  if (data.toString().toUpperCase() === 'END') {
    socket.end();
    return;
  }

  sendMessage(socket, fullMessage);
};

const registerUser = (socket: Socket, username: string) => {
  const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`${username} connected from ${cyan(remoteSocket)}`);
  connections.set(socket, username);
  const line = '\n===========================\n';
  socket.write('Username: ' + username + line);
};

const generateUsername = (): string => {
  const generatorConfig: Config = {
    dictionaries: [starWars],
    separator: '-',
    length: 1,
  };

  return uniqueNamesGenerator(generatorConfig).toLowerCase();
};

const sendMessage = (origin: Socket, message: string): void => {
  connections.forEach((_user: string, socket: Socket) => {
    if (socket !== origin) {
      socket.write(message);
    }
  });
};

const manageClose = (socket: Socket): void => {
  const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
  const username = connections.get(socket);
  connections.delete(socket);
  logWarn(`Connection with ${username} from ${remoteSocket} closed.`);
};

const manageError = (error: Error): void => {
  logError(error.message);
};

if (module === require.main) {
  main();
}
