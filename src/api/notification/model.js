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

const analyticsSchema = new Schema({
  clicked: {
    type: Array,
    default: [],
  },
  received: {
    type: Array,
    default: [],
  }
}, { _id: false })

const notificationSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
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
  },
  analytics: analyticsSchema,
  canceled: Boolean
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
      canceled: this.canceled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      response: this.response,
      analytics: this.analytics,
    } : view
  }
}

notificationSchema.statics.extractId = function(response) {
  if(response.id)
    return response.id
  if(response.notificationId)
    return response.notificationId
  else
    throw new Error('No id for document')
}

const model = mongoose.model('Notification', notificationSchema)

export const schema = model.schema
export default model
