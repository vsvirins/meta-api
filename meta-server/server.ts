import cors from 'cors'
import express from 'express'
import {connect} from 'mongoose'
import morgan from 'morgan'
import passport from 'passport'
import passportSetup from './auth/passport'
import authenticate from './middleware/authenticate'
import paramsHack from './middleware/paramsHack'
import authRoutes from './routes/authRoutes'
import endpointRoutes from './routes/endpointRoutes'
import genericRoutes from './routes/genericRoutes'
import projectRoutes from './routes/projectRoutes'

/**
 * @Constants
 */
const PORT = parseInt(process.env.PORT!) || 8080
const HOST = process.env.HOST || '127.0.0.1'
const DB_URI = process.env.DB_URI || 'mongodb://mongo:27017/meta-api'

/**
 * @Configs
 */
const app = express()
passportSetup.init()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

/***
 * @Routes
 */
app.use('/auth', authRoutes)

app.use('/generator/:user_name/projects', authenticate, paramsHack, projectRoutes)
app.use('/generator/projects', projectRoutes)

app.use(
  '/generator/:user_name/projects/:project_name/endpoints',
  authenticate,
  paramsHack,
  endpointRoutes
)
app.use('/generator/endpoints', authenticate, endpointRoutes)

app.use('/api', genericRoutes)

/***
 * @Run
 */
connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, HOST, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`))
  })
  .catch(e => {
    console.error("Couldn't start server. A database error occured while connecting!")
  })
