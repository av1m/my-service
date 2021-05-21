import mongoose = require('mongoose');

export interface IService extends mongoose.Document {
  name: string;
  description?: string;
  photo?: string;
  price: number;
  tags: [string];
}

export const ServiceSchema: mongoose.Schema = new mongoose.Schema({
  name: {type: String, required: true, default: 'Untitled Service'},
  description: {type: String, required: false},
  photo: {
    type: String,
    required: false,
    default: 'https://picsum.photos/1250/400?random=1',
  },
  price: {type: Number, required: true, min: 0, max: 9999},
  tags: {type: [String], required: false, default: []},
});

export default mongoose.model<IService>('Service', ServiceSchema);
