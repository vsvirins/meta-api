import {Document} from 'mongoose'

export default interface ProjectModelInterface extends Document {
  user_name: string
}
