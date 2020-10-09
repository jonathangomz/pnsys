import mongoose, { Schema } from 'mongoose'

const notificationSchema = new Schema({
  sender: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _os_notification_id: {
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
      sender: this.sender.view(full),
      _os_notification_id: this._os_notification_id,
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
