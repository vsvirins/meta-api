import { Document } from 'mongoose'

export default interface EndpointModelInterface extends Document {
  endpoint_name: string
  allowed_methods: string[]
  responses: { status: number, message: string, method: string }[]
  fields: { name: string, type: string, required: boolean }[]
}