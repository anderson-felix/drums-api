import routes from './routes';
import server from './server';

class App {
  constructor() {
    this.routes();
    this.server();
  }

  routes() {
    routes;
  }

  server() {
    server;
  }
}

export default new App();
