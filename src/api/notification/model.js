import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
  lang: {
    type: String,
    enum: ['en', 'es'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
}, { _id: false })

const notificationSchema = new Schema({
  appId: {
    type: Schema.Types.ObjectId,
    ref: 'App',
    required: true,
  },
  message: messageSchema,
  options: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

notificationSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      appId: this.appId,
      message: this.message,
      options: this.options,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Notification', notificationSchema)

export const schema = model.schema
export default model
