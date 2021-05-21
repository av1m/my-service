import mongoose = require('mongoose');
import * as bcrypt from 'bcryptjs';
import {ServiceSchema, IService} from './service';

export interface IUser extends mongoose.Document {
  firstname: string;
  lastname?: string;
  email: string;
  password: string;
  role: string;
  profile?: string;
  services?: [IService];
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean;
}

// Schema
const UserSchema = new mongoose.Schema(
  {
    lastname: {
      type: String,
      required: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      match: [
        /([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i,
        'No email found ({VALUE})',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: false,
      default: 'https://picsum.photos/1250/400?random=1',
    },
    services: {
      type: [ServiceSchema],
      default: () => [],
    },
  },
  {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}}
);

// Methods
UserSchema.methods.checkIfUnencryptedPasswordIsValid = function (
  this: any,
  unencryptedPassword: string
) {
  return bcrypt.compareSync(unencryptedPassword, this.password);
};

// Document middlewares
UserSchema.pre<IUser>('save', function (next) {
  if (!this.password.startsWith('$2a$08$')) {
    // Check if the password is already encrypted
    // Otherwise, we encrypt the same password twice
    this.password = bcrypt.hashSync(this.password, 8);
  }
  next();
});

// Indexes
UserSchema.index({
  firstname: 'text',
  lastname: 'text',
  'services.name': 'text',
  'services.description': 'text',
  'services.tags': 'text',
});
UserSchema.index({
  firstname: 1,
  lastname: 1,
  'services.name': 1,
  'services.description': 1,
  'services.tags': 1,
});

export default mongoose.model<IUser>('User', UserSchema);
