import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function startApp()  {
    await initMongoConnection();
    setupServer();
}

startApp();
