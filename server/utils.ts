import { red, yellow } from 'chalk';
import { uniqueNamesGenerator, Config, starWars } from 'unique-names-generator';

export const getSafePort = (execution: string): number => {
  if (process.argv.length < 3) {
    logError(`Usage: "yarn ${execution} <port>"`);
  }
  const port = Number(process.argv[2]);
  if (isNaN(port)) {
    logError(`Invalid port "${process.argv[2]}"`);
  }

  return port;
};

export const logError = (message: string): void => {
  console.error(`${red(message)}\n`);
  process.exit(1);
};

export const logWarn = (message: string): void => {
  console.log(yellow(`⚠  ${message}`));
};

export const generateUsername = (): string => {
  const generatorConfig: Config = {
    dictionaries: [starWars],
    separator: '-',
    length: 1,
  };

  return uniqueNamesGenerator(generatorConfig).toLowerCase();
};

