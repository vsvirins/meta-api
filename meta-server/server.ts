import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

// Configs and middleware
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const PORT = 8000; //os.getenv('PORT')

// Routes
app.get('/', (req, res) => res.send('hello from ts'));

// Connect to DB and start the server
app.listen(PORT, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`));
