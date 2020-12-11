import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { connect } from 'mongoose'

import projectRoutes from './routes/projectRoutes'
import endpointRoutes from './routes/endpointRoutes'
import genericRoutes from './routes/genericRoutes'
import paramsHack from './middleware/paramsHack'

// Configs and middleware
connect(process.env.DB_URI || 'mongodb://localhost:27017/meta-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  const app = express()
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(cors())

  const PORT = process.env.PORT || 8080

  // Routes
  app.use('/generator/:user_name/projects', paramsHack, projectRoutes)
  app.use('/generator/projects', projectRoutes)

  app.use('/generator/:user_name/projects/:project_name/endpoints', paramsHack, endpointRoutes)
  app.use('/generator/endpoints', endpointRoutes)

  app.use('/api', genericRoutes)

  // Connect to DB and start the server
  app.listen(PORT, () => console.log(`⚡️[meta-server] Listening on port ${PORT}`))
}).catch(e => {
  console.error("Couldn't start server. A database error occured while connecting!")
})