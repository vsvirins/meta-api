import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import passportSetup from './auth/passport';
import auth from './routes/auth';

// asds
/**
 * @todo
 * Replace with env_file in docker-compose
 */
//dotenv.config();

/**
 * @Constants
 */
const PORT = parseInt(process.env.PORT!) || 8080;
const HOST = process.env.HOST || '127.0.0.1';

/**
 * @Configs
 */
const app = express();
passportSetup.init();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

/***
 * @Routes
 */
app.use('/auth', auth);
app.get('/', (req, res) => res.send('hello from ts'));

/***
 * @Run
 */
app.listen(PORT, HOST, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`));
