import mongoose = require('mongoose');
export interface IService extends mongoose.Document {
    name: string;
    description?: string;
    photo?: string;
    price: number;
    tags: [string];
}
export declare const ServiceSchema: mongoose.Schema;
declare const _default: mongoose.Model<IService, {}>;
export default _default;
