import {connection, Document, Schema} from 'mongoose'

interface TokenDocument extends Document {
  id: string
  refreshToken: string
}

const TokenSchema = new Schema({
  id: {type: String, unique: true, required: true},
  refreshToken: {type: String, required: true},
})

const Token = connection.model<TokenDocument>('Token', TokenSchema)
export default Token
