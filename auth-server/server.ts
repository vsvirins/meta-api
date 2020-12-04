import cors from 'cors';
import dotenvt from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import ipFilter from './middleware/ipFilter';
import router from './router';

//replace with dot_env file in docker-compose
dotenvt.config();

/**
 * @Constants
 */
const PORT = parseInt(process.env.PORT!) | 9090;

/**
 * @Configs
 */
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(ipFilter(['::ffff:127.0.0.1']));

/***
 * @Routes
 */
app.use('/', router);

/***
 * @Run
 */
app.listen(PORT, () => {
  console.log(`⚡️[auth-server] Listening on port ${PORT}`);
});
