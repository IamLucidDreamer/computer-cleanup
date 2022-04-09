"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.signout = exports.signin = exports.signup = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var express_validator_1 = require("express-validator");
var lodash_1 = require("lodash");
var auth_1 = require("../helpers/auth");
var index_1 = require("../prisma/index");
var logger_1 = require("../utils/logger");
var statusCode_1 = require("../utils/statusCode");
var enum_1 = require("../@types/enum");
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, name, email, _b, phoneNumber, password, userType, err_1;
    var _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req) || [];
                if (!errors.isEmpty()) {
                    return [2, res.status(statusCode_1.statusCode.WRONG_ENTITY).json({
                            error: (_c = errors.array()[0]) === null || _c === void 0 ? void 0 : _c.msg
                        })];
                }
                _a = req.body, name = _a.name, email = _a.email, _b = _a.phoneNumber, phoneNumber = _b === void 0 ? null : _b, password = _a.password;
                userType = (_d = req.query) === null || _d === void 0 ? void 0 : _d.userType;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 3, 4, 5]);
                return [4, index_1.prisma.user
                        .create({
                        data: {
                            name: name,
                            email: email,
                            phoneNumber: phoneNumber,
                            gender: ((_e = req.body) === null || _e === void 0 ? void 0 : _e.gender) || enum_1.Gender.MALE,
                            dateOfBirth: ((_f = req.body) === null || _f === void 0 ? void 0 : _f.dataOfBirth) || '',
                            encrypted_password: (0, auth_1.hashPassword)(password, process.env.SALT || ''),
                            role: userType && userType === '2' ? 2 : 1
                        }
                    })
                        .then(function (user) {
                        return res.status(statusCode_1.statusCode.OK).json({
                            message: 'User Signed Up, Successfully!',
                            data: user
                        });
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                            error: 'Failed to add user in DB!'
                        });
                    })];
            case 2:
                _g.sent();
                return [3, 5];
            case 3:
                err_1 = _g.sent();
                (0, logger_1.loggerUtil)(err_1, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Sign up API called by user - " + email);
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, email, password, err_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req) || [];
                if (!errors.isEmpty()) {
                    return [2, res.status(statusCode_1.statusCode.WRONG_ENTITY).json({
                            error: (_b = errors.array()[0]) === null || _b === void 0 ? void 0 : _b.msg
                        })];
                }
                _a = req.body, email = _a.email, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, 4, 5]);
                return [4, index_1.prisma.user
                        .findUnique({
                        where: {
                            email: email
                        }
                    })
                        .then(function (user) {
                        if (!user) {
                            return res.status(statusCode_1.statusCode.NOT_FOUND).json({
                                error: "E-Mail doesn't exist in DB!"
                            });
                        }
                        if (!(0, auth_1.authenticate)(password, process.env.SALT || '', user.encrypted_password)) {
                            return res.status(statusCode_1.statusCode.UNAUTHORIZED).json({
                                error: 'Oops!, E-mail and Password does not match!'
                            });
                        }
                        var expiryTime = new Date();
                        expiryTime.setMonth(expiryTime.getMonth() + 6);
                        var exp = expiryTime.getTime() / 1000;
                        var token = jsonwebtoken_1.default.sign({ _id: user.id, exp: exp }, process.env.SECRET || '');
                        res.cookie('Token', token, {
                            expires: new Date(Date.now() + 900000),
                            httpOnly: true
                        });
                        return res.status(statusCode_1.statusCode.OK).json({
                            message: 'User Logged in Successfully!',
                            token: token,
                            data: user
                        });
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.INTERNAL_SERVER_ERROR).json({
                            error: 'Login failed!'
                        });
                    })];
            case 2:
                _c.sent();
                return [3, 5];
            case 3:
                err_2 = _c.sent();
                (0, logger_1.loggerUtil)(err_2, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Sign in API called by user - " + email);
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.signin = signin;
var signout = function (res) {
    res.clearCookie('Token');
    res.status(statusCode_1.statusCode.OK).json({
        message: 'User Signed Out Sucessfully!'
    });
};
exports.signout = signout;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, reqBody, _a, _b, email, _c, password, err_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                userId = parseInt(req.params.userId || '1');
                reqBody = req.body;
                _a = req.body, _b = _a.email, email = _b === void 0 ? '' : _b, _c = _a.password, password = _c === void 0 ? '' : _c;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, 4, 5]);
                if (!(0, lodash_1.isEmpty)(email) || !(0, lodash_1.isEmpty)(password)) {
                    return [2, res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                            error: 'Cannot update email or password'
                        })];
                }
                return [4, index_1.prisma.user
                        .update({
                        where: {
                            id: userId
                        },
                        data: reqBody
                    })
                        .then(function (user) {
                        return res.status(statusCode_1.statusCode.OK).json({
                            message: 'User Updated Successfully',
                            data: user
                        });
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.INTERNAL_SERVER_ERROR).json({
                            error: 'Login failed!'
                        });
                    })];
            case 2:
                _d.sent();
                return [3, 5];
            case 3:
                err_3 = _d.sent();
                (0, logger_1.loggerUtil)(err_3, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Update API called!");
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.update = update;
//# sourceMappingURL=auth.js.map