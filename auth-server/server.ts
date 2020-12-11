import cors from 'cors';
//import dotenvt from 'dotenv';
import express from 'express';
import {connect} from 'mongoose';
import morgan from 'morgan';
import router from './router';

//replace with dot_env file in docker-compose
// dotenvt.config();

/**
 * @Constants
 */
const PORT = parseInt(process.env.PORT!) || 9090;
//const HOST = process.env.HOST || '127.0.0.1';
const DB_URI = process.env.DB_URI || 'mongodb://mongo:27017/auth';

/**
 * @Configs
 */
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
//app.use(ipFilter(['::ffff:127.0.0.1', '172.19.0.2', '::ffff:172.19.0.2']));

/***
 * @Routes
 */
app.use('/', router);

/***
 * @Run
 */
connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() =>
    app.listen(PORT, () => {
      console.log(`⚡️[auth-server] Listening on port ${PORT}`);
    })
  )
  .catch(err => console.error(err));
