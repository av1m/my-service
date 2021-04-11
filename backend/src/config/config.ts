import {ConnectionOptions} from 'typeorm';
import dotenv = require('dotenv');

dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET || 'TEST',
};

export const db: ConnectionOptions = {
  type: 'mongodb',
  url:
    'mongodb+srv://' +
    process.env.DB_CREDENTIALS +
    '?retryWrites=true&w=majority&useFindAndModify=true&useCreateIndex=true',
  ssl: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
