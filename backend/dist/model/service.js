"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSchema = void 0;
var mongoose = require("mongoose");
exports.ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Untitled Service' },
    description: { type: String, required: false },
    photo: {
        type: String,
        required: false,
        default: 'https://picsum.photos/1250/400?random=1',
    },
    price: { type: Number, required: true, min: 0, max: 9999 },
    tags: { type: [String], required: false, default: [] },
});
exports.default = mongoose.model('Service', exports.ServiceSchema);
//# sourceMappingURL=service.js.map