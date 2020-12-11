import { Schema, connection, Model, models } from 'mongoose'

import { schema as EndpointSchema } from './EndpointModel'
import GenericSchemaInterface from './interfaces/GenericSchemaInterface'
import ProjectModelInterface from './interfaces/ProjectModelInterface'

export default function(user_name: string, project_name: string, endpoint_name: string, fields: { name: string, type: string, required: boolean }[]): Model<any> {
  let fieldType
  const schemaFields: GenericSchemaInterface = {}

  fields.map(field => {
    switch (field.type) {
      case "string":
        fieldType = String
        break
      case "number":
        fieldType = Number
        break
      case "boolean":
        fieldType = Boolean
        break
      default:
        fieldType = Schema.Types.Mixed
    }
    
    schemaFields[field.name] = { type: fieldType, required: field.required }
  })

  const schema = new Schema(schemaFields)

  return models[`${user_name}_${project_name}_${endpoint_name}`] || connection.model(`${user_name}_${project_name}_${endpoint_name}`, schema)
}