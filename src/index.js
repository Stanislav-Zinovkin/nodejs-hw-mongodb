import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function startApp()  {
    await initMongoConnection();
    setupServer();
}
export const FIFTEEN_MINUTES = 15*60*1000;
export const ONE_DAY = 24*60*60*1000;

startApp();
