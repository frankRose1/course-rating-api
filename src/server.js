import http from 'http';
import { connectMongoStartServer } from './databases/mongoDB';
import app from './app';

process.on('uncaughtException', e => {
  console.log(e);
  process.exit(1);
});

process.on('unhandledRejection', e => {
  console.log(e);
  process.exit(1);
});

const { PORT = 8000 } = process.env;
const server = http.createServer(app);

connectMongoStartServer(server, PORT);
