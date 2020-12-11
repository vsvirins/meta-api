import {connection, Model, Schema} from 'mongoose'
import UserModelInterface from './interfaces/UserModelInterface'

const schema = new Schema({
  username: {type: String, required: true},
})

const model: Model<UserModelInterface> = connection.model('User', schema)
export = model
