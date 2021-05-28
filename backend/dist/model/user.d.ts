import mongoose = require('mongoose');
import { IService } from './service';
export interface IUser extends mongoose.Document {
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    profile?: string;
    services?: [IService];
    payments?: [mongoose.Schema.Types.ObjectId];
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean;
}
declare const _default: mongoose.Model<IUser, {}>;
export default _default;
