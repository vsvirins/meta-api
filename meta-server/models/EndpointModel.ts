import { Schema, connection } from 'mongoose'

class EndpointSchema {
  static get schema () {
    const schema = new Schema({
      endpoint_name: { type: String, required: true },
      allowed_methods: { type: [String], required: true },
      responses: {
        status: { type: Number, required: true },
        message: { type: String, required: true },
        method: { type: String, required: true }
      },
      fields: { type: Schema.Types.Mixed, required: true }
    })

    return schema;
  }
}

const model = connection.model("Endpoints", EndpointSchema.schema)
export = model