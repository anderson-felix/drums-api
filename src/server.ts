import express from 'express';
import cors from 'cors';

import routes from './routes';

const server = express();

server.use(express.json());
server.use(cors({ credentials: true, origin: true }));

server.use(routes);

server.listen(8000, () => {
  console.log('PORT 8000 [OK]');
});

export default server;
