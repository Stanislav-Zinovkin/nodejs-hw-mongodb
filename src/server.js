import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import router from './routes/contactRout.js';
import errorHandler from './middlewares/errorHandlers.js';
import notfoundHandler from './middlewares/notFoundHandler.js';
import auth from './routes/auth.js'

export const setupServer = () => {
const app = express();
app.use(express.json());
app.use(cors());
app.use(pinoHttp());

app.use('/auth', auth)
app.use('/contacts', router)

app.use(notfoundHandler);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

}