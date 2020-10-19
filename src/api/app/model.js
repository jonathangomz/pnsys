import clientFactory from "../../services/pushnotifications";
import mongoose, { Schema } from 'mongoose'

const appSchema = new Schema({
  provider: {
    type: String,
    enum: ['os', 'wp'],
    lowercase: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  status: {
    type: String,
    lowercase: true,
    enum: ['inactive', 'active'],
    default: 'inactive',
  },
  keys: {
    type: Map,
    of: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdateBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

appSchema.pre('save', function(next) {
  switch (this.provider) {
    case 'os':
      if (this.keys.get('appId') && this.keys.get('authKey') && this.keys.get('restApiKey')) {
        next();
      }else {
        next(new Error('Invalid keys'));
      }
      break;
  }
});

appSchema.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this.id,
      provider: this.provider,
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view,
      keys: this.keys,
      createdBy: this.createdBy,
      lastUpdateBy: this.lastUpdateBy,
    } : view
  },
  async isValid () {
    try {
      const client = clientFactory(this);
      return await client.isValid();
    } catch (error) {
      return false;
    }
  },
  getClient() {
    return clientFactory({ provider: this.provider, keys: this.keys });
  }
}

const model = mongoose.model('App', appSchema)

export const schema = model.schema
export default model
