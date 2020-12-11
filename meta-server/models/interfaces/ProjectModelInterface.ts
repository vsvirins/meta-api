import { Document, Types } from 'mongoose'
import EndpointModelInterface from './EndpointModelInterface'

export default interface ProjectModelInterface extends Document {
  user_name: string
  project_name: string
  endpoints: Types.DocumentArray<EndpointModelInterface>
}