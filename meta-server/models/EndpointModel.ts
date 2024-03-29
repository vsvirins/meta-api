import { Schema, connection, Model } from 'mongoose'
import EndpointModelInterface from './interfaces/EndpointModelInterface'

export const schema = new Schema({
  endpoint_name: { type: String, required: true },
  allowed_methods: { type: [String], required: true },
  responses: [{
    status: { type: Number, required: true },
    message: { type: String, required: true },
    method: { type: String, required: true }
  }],
  fields: [{
    name: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, required: true }
  }]
})

const model: Model<EndpointModelInterface> = connection.model("Endpoints", schema)
export default model