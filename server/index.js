import Server from './server.js';

// this code runs the express server
async function run() {
  try {
    const server = new Server();
    await server.init();
    await server.start();
  } catch (err) {
    console.log('failed to start', err);
    throw err;
  }
}

run();