import { Schema, connection, Model } from 'mongoose'

import { schema as EndpointSchema } from './EndpointModel'
import ProjectModelInterface from './interfaces/ProjectModelInterface'

const schema = new Schema({
  user_name: { type: String, required: true },
  project_name: { type: String, required: true },
  endpoints: { type: [EndpointSchema], required: false }
})

const model: Model<ProjectModelInterface> = connection.model("Projects", schema)
export = model