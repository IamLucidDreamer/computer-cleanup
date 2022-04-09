"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var index_1 = require("./../middlewares/index");
var auth_1 = require("./auth");
var user_1 = require("./user");
var qrCode_1 = require("./qrCode");
var routes = function (app) {
    app.use('/api', auth_1.authRoute);
    app.use('/api', index_1.isSignedIn, index_1.isValidToken, auth_1.updateRoute);
    app.use('/api', index_1.isSignedIn, index_1.isValidToken, user_1.userRoute);
    app.use('/api', index_1.isSignedIn, index_1.isValidToken, qrCode_1.consumeQRRoute);
    app.use('/api', index_1.isSignedIn, index_1.isValidToken, index_1.isCorporate, qrCode_1.generateQRRoute);
    return app;
};
exports.routes = routes;
//# sourceMappingURL=index.js.map