import clientFactory from "../../services/pushnotifications";
import mongoose, { Schema } from 'mongoose'

const keys = {
  appId: String,
  authKey: String,
  restApiKey: String,
}

const appSchema = new Schema({
  provider: {
    type: String,
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
    default: 'inactive',
  },
  keys: {
    type: Map,
    of: String,
    required: true,
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
    default:
      next(new Error('Invalid provider'));
  }
});

appSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      provider: this.provider,
      name: this.name,
      description: this.description,
      status: this.status,
      keys: this.keys,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  },
  async validateApp () {
    try {
      const client = clientFactory(this);
      const app_info = await client.viewApp();
      return app_info.id ? true : false;
    } catch (error) {
      return false;
    }
  },
  getClient() {
    return clientFactory(this);
  }
}

const model = mongoose.model('App', appSchema)

export const schema = model.schema
export default model
