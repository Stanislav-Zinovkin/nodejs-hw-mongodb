import 'dotenv/config';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);

async function startApp()  {
    await initMongoConnection();
    setupServer();
}
export const FIFTEEN_MINUTES = 15*60*1000;
export const ONE_DAY = 24*60*60*1000;

startApp();
