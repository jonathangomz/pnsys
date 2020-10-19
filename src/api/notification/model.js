import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
  en: {
    type: String,
    required: true,
  },
  es: {
    type: String,
    required: true,
  }
}, { _id: false })

const notificationSchema = new Schema({
  _id: String,
  appId: {
    type: Schema.Types.ObjectId,
    ref: 'App',
    required: true,
  },
  message: [messageSchema],
  options: {
    type: Schema.Types.Mixed,
  },
  response: {
    type: Schema.Types.Mixed,
    required: true,
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
      _id: this.id,
      appId: this.appId,
      message: this.message,
      options: this.options,
      response: this.response,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      response: this.response,
    } : view
  }
}

const model = mongoose.model('Notification', notificationSchema)

export const schema = model.schema
export default model
