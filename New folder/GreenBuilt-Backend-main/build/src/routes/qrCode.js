"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeQRRoute = exports.generateQRRoute = void 0;
var express_1 = __importDefault(require("express"));
var qrCode_1 = require("../controllers/qrCode");
var generateQRRoute = express_1.default.Router(), consumeQRRoute = express_1.default.Router();
exports.generateQRRoute = generateQRRoute;
exports.consumeQRRoute = consumeQRRoute;
generateQRRoute.post('/qr/generate', qrCode_1.generateQRCode);
consumeQRRoute.post('/qr/consume/:qrId', qrCode_1.consumeQRCode);
//# sourceMappingURL=qrCode.js.map