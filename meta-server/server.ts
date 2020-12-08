import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { connect } from 'mongoose'

import projectRoutes from './routes/projectRoutes'
import paramsHack from './middleware/paramsHack';

// Configs and middleware
connect(process.env.DB_URI || 'mongodb://localhost:27017/meta-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080

// Routes
app.use('/:user_name/projects', paramsHack, projectRoutes)
app.use('/projects', projectRoutes)

// Connect to DB and start the server
app.listen(PORT, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`));