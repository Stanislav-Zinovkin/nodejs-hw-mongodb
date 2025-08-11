import 'dotenv/config';
import path from 'path';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirNotExist } from './utils/createDirNotExist.js';

console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);
console.log('REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET);
export const FIFTEEN_MINUTES = 15*60*1000;
export const ONE_DAY = 24*60*60*1000;
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

async function startApp()  {
    await initMongoConnection();
    await createDirNotExist(TEMP_UPLOAD_DIR);
    await createDirNotExist(UPLOAD_DIR);
    setupServer();
}

startApp();
