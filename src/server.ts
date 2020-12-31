import express from 'express';

import routes from './routes';

const server = express();

server.use(express.json());

server.use(routes);

server.listen(8000, () => {
  console.log('PORT 8000 [OK]');
});

export default server;
