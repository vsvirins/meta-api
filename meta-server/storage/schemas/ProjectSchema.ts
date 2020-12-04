import { Schema, connection } from 'mongoose'

class ProjectSchema {
  static get schema () {
    const schema = new Schema({
      user_name: { type: String, required: true },
      project_name: { type: String, required: true },
      endpoint_name: { type: String, required: true },
      allowed_methods: { type: [String], required: true },
      responses: {
        status: { type: Number, required: true },
        message: { type: String, required: true },
        method: { type: String, required: true }
      },
      fields: { type: Schema.Types.Mixed, required: true },
    })

    return schema;
  }
}

const model = connection.model("Projects", ProjectSchema.schema)
export = model