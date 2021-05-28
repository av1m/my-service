"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var service_1 = require("./service");
// Schema
var UserSchema = new mongoose.Schema({
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
        type: [service_1.ServiceSchema],
        default: function () { return []; },
    },
    payments: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        default: function () { return []; },
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
// Methods
UserSchema.methods.checkIfUnencryptedPasswordIsValid = function (unencryptedPassword) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
};
// Document middlewares
UserSchema.pre('save', function (next) {
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
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map