"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.hashPassword = void 0;
var crypto = __importStar(require("crypto"));
var hashPassword = function (password, salt) {
    if (!password)
        return '';
    try {
        return crypto.createHmac('sha256', salt).update(password).digest('hex');
    }
    catch (err) {
        return '';
    }
};
exports.hashPassword = hashPassword;
var authenticate = function (password, salt, encryptedPassword) {
    return (0, exports.hashPassword)(password, salt) === encryptedPassword;
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map