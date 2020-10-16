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
    enum: ['os'],
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
      id: this.id,
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
    } : view
  },
  async isValid () {
    try {
      const client = clientFactory(this);
      const is_valid = await client.isValid();
      return is_valid;
    } catch (error) {
      return false;
    }
  },
  getClient() {
    const keys = {
      appId: this.keys.get('appId'),
      authKey: this.keys.get('authKey'),
      restApiKey: this.keys.get('restApiKey')
    }

    if(this.isValid())
      return clientFactory({provider: this.provider, keys});
  }
}

const model = mongoose.model('App', appSchema)

export const schema = model.schema
export default model
