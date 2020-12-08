import { Schema, connection } from 'mongoose'

class ProjectSchema {
  static get schema () {
    const schema = new Schema({
      user_name: { type: String, required: true },
      project_name: { type: String, required: true },
      enpoints: { type: Schema.Types.ObjectId, ref: "Endpoints", required: false }
    })

    return schema;
  }
}

const model = connection.model("Projects", ProjectSchema.schema)
export = model