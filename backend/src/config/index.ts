import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import throttleConfig from './throttle.config';

export const configurations = [
  appConfig,
  databaseConfig,
  jwtConfig,
  throttleConfig,
];

export { appConfig, databaseConfig, jwtConfig, throttleConfig };
