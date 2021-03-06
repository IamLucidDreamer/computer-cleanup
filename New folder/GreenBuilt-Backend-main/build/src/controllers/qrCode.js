"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeQRCode = exports.generateQRCode = void 0;
var index_1 = require("../prisma/index");
var logger_1 = require("../utils/logger");
var statusCode_1 = require("../utils/statusCode");
var uuid_1 = require("uuid");
var generateQRCode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, products, totalPoints, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.auth._id;
                products = req.body.products;
                totalPoints = products.reduce(function (a, b) { return a + b.points; }, 0);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4, index_1.prisma.user
                        .findUnique({
                        where: {
                            id: userId
                        }
                    })
                        .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(user === null || user === void 0 ? void 0 : user.points)) return [3, 4];
                                    if (!((user === null || user === void 0 ? void 0 : user.points) >= totalPoints)) return [3, 2];
                                    return [4, index_1.prisma.user
                                            .update({
                                            where: {
                                                id: user.id
                                            },
                                            data: {
                                                points: (user === null || user === void 0 ? void 0 : user.points) - totalPoints
                                            }
                                        })
                                            .then(function (rs) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, index_1.prisma.qRCode
                                                            .create({
                                                            data: {
                                                                userId: userId,
                                                                qrId: (0, uuid_1.v4)(),
                                                                products: {
                                                                    create: products
                                                                }
                                                            }
                                                        })
                                                            .then(function (data) {
                                                            return res.status(statusCode_1.statusCode.OK).json({
                                                                message: 'QR Code Generated Successfully!',
                                                                data: __assign(__assign({}, data), { products: products, totalPoints: totalPoints, availableUserPoints: rs === null || rs === void 0 ? void 0 : rs.points })
                                                            });
                                                        })
                                                            .catch(function (err) {
                                                            (0, logger_1.loggerUtil)(err, 'ERROR');
                                                            return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                                                error: 'Failed to generate QR Code!'
                                                            });
                                                        })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2];
                                                }
                                            });
                                        }); })
                                            .catch(function (err) {
                                            (0, logger_1.loggerUtil)(err, 'ERROR');
                                            return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                                error: 'Failed to generate QR Code!'
                                            });
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3, 3];
                                case 2:
                                    res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                        error: 'Insufficient points to generate QR!',
                                        availablePoints: user === null || user === void 0 ? void 0 : user.points
                                    });
                                    _a.label = 3;
                                case 3: return [3, 5];
                                case 4:
                                    res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                        error: 'Insufficient points to generate QR!',
                                        availablePoints: user === null || user === void 0 ? void 0 : user.points
                                    });
                                    _a.label = 5;
                                case 5: return [2];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [3, 5];
            case 3:
                err_1 = _a.sent();
                (0, logger_1.loggerUtil)(err_1, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Generate QR Code API Called!");
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.generateQRCode = generateQRCode;
var consumeQRCode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, qrId, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.auth._id;
                qrId = req.params.qrId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4, index_1.prisma.qRCode
                        .findFirst({
                        where: {
                            qrId: qrId
                        }
                    })
                        .then(function (data) {
                        if (!data) {
                            return res.status(statusCode_1.statusCode.NOT_FOUND).json({
                                message: 'No QR Found!'
                            });
                        }
                        if (!(data === null || data === void 0 ? void 0 : data.redeemed)) {
                            index_1.prisma.qRCode
                                .update({
                                where: {
                                    qrId: qrId
                                },
                                data: {
                                    redeemed: true
                                }
                            })
                                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, index_1.prisma.usedQRCode
                                                .create({
                                                data: {
                                                    qrId: qrId,
                                                    userId: userId
                                                }
                                            })
                                                .then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4, index_1.prisma.product
                                                                .findMany({
                                                                where: {
                                                                    qrId: qrId
                                                                }
                                                            })
                                                                .then(function (products) { return __awaiter(void 0, void 0, void 0, function () {
                                                                return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4, index_1.prisma.product
                                                                                .updateMany({
                                                                                where: {
                                                                                    qrId: qrId
                                                                                },
                                                                                data: {
                                                                                    userId: userId
                                                                                }
                                                                            })
                                                                                .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                                return __generator(this, function (_a) {
                                                                                    switch (_a.label) {
                                                                                        case 0: return [4, index_1.prisma.user
                                                                                                .findUnique({
                                                                                                where: {
                                                                                                    id: userId
                                                                                                }
                                                                                            })
                                                                                                .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                                                                                                var userPoints, totalPoints;
                                                                                                return __generator(this, function (_a) {
                                                                                                    switch (_a.label) {
                                                                                                        case 0:
                                                                                                            userPoints = 0;
                                                                                                            if (user === null || user === void 0 ? void 0 : user.points)
                                                                                                                userPoints += user === null || user === void 0 ? void 0 : user.points;
                                                                                                            totalPoints = products.reduce(function (a, b) { return a + b.points; }, 0);
                                                                                                            return [4, index_1.prisma.user
                                                                                                                    .update({
                                                                                                                    where: {
                                                                                                                        id: userId
                                                                                                                    },
                                                                                                                    data: {
                                                                                                                        points: userPoints + totalPoints
                                                                                                                    }
                                                                                                                })
                                                                                                                    .then(function (rs) {
                                                                                                                    return res.status(statusCode_1.statusCode.OK).json({
                                                                                                                        message: 'QR Code Consumed Successfully!',
                                                                                                                        data: __assign(__assign({}, data), { products: products, totalPoints: totalPoints, availableUserPoints: rs === null || rs === void 0 ? void 0 : rs.points })
                                                                                                                    });
                                                                                                                })];
                                                                                                        case 1:
                                                                                                            _a.sent();
                                                                                                            return [2];
                                                                                                    }
                                                                                                });
                                                                                            }); })];
                                                                                        case 1:
                                                                                            _a.sent();
                                                                                            return [2];
                                                                                    }
                                                                                });
                                                                            }); })];
                                                                        case 1:
                                                                            _a.sent();
                                                                            return [2];
                                                                    }
                                                                });
                                                            }); })
                                                                .catch(function (err) {
                                                                (0, logger_1.loggerUtil)(err, 'ERROR');
                                                                return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                                                    error: 'Failed to consume QR Code!'
                                                                });
                                                            })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2];
                                                    }
                                                });
                                            }); })
                                                .catch(function (err) {
                                                (0, logger_1.loggerUtil)(err, 'ERROR');
                                                return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                                    error: 'Failed to consume QR Code!'
                                                });
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); });
                            return;
                        }
                        else {
                            return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                                error: 'QR Code has been already used!'
                            });
                        }
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                            error: 'Consume QR Code API Failed!'
                        });
                    })];
            case 2:
                _a.sent();
                return [3, 5];
            case 3:
                err_2 = _a.sent();
                (0, logger_1.loggerUtil)(err_2, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Consume QR Code API Called!");
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.consumeQRCode = consumeQRCode;
//# sourceMappingURL=qrCode.js.map