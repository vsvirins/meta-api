import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import passportSetup from './auth/passport';
import auth from './routes/auth';

/**
 * @todo
 * Replace with env_file in docker-compose
 */
dotenv.config();

/**
 * @Constants
 */
const PORT = process.env.PORT || 8000;

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
app.listen(PORT, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`));
