import { Schema, connection } from 'mongoose'

const schema = new Schema({
  user_name: { type: String, required: true },
  project_name: { type: String, required: true },
  enpoints: { type: Schema.Types.ObjectId, ref: "Endpoints", required: false }
})

const model = connection.model("Projects", schema)
export = model