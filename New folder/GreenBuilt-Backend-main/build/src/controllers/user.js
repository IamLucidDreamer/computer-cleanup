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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserById = void 0;
var index_1 = require("../prisma/index");
var logger_1 = require("../utils/logger");
var statusCode_1 = require("../utils/statusCode");
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.userId || '1');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4, index_1.prisma.user
                        .findFirst({
                        where: {
                            id: id
                        }
                    })
                        .then(function (user) {
                        if (!user) {
                            return res.status(statusCode_1.statusCode.NOT_FOUND).json({
                                error: "User doesn't exist in DB!"
                            });
                        }
                        return res.status(statusCode_1.statusCode.OK).json({
                            message: 'User fetched Successfully!',
                            user: user
                        });
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.INTERNAL_SERVER_ERROR).json({
                            message: 'Failed to fetch the user!'
                        });
                    })];
            case 2:
                _a.sent();
                return [3, 5];
            case 3:
                err_1 = _a.sent();
                (0, logger_1.loggerUtil)(err_1, 'ERROR');
                return [3, 5];
            case 4:
                (0, logger_1.loggerUtil)("Get User By Id API Called!");
                return [7];
            case 5: return [2];
        }
    });
}); };
exports.getUserById = getUserById;
var getAllUsers = function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, 3, 4]);
                return [4, index_1.prisma.user
                        .findMany()
                        .then(function (user) {
                        if (!(user === null || user === void 0 ? void 0 : user.length)) {
                            return res.status(statusCode_1.statusCode.NOT_FOUND).json({
                                error: "User doesn't exist in DB!"
                            });
                        }
                        (0, logger_1.log)(user);
                        return res.status(statusCode_1.statusCode.OK).json({
                            message: 'User fetched Successfully!',
                            user: user
                        });
                    })
                        .catch(function (err) {
                        (0, logger_1.loggerUtil)(err, 'ERROR');
                        return res.status(statusCode_1.statusCode.INTERNAL_SERVER_ERROR).json({
                            message: 'Failed to fetch the user!'
                        });
                    })];
            case 1:
                _a.sent();
                return [3, 4];
            case 2:
                err_2 = _a.sent();
                (0, logger_1.loggerUtil)(err_2, 'ERROR');
                return [3, 4];
            case 3:
                (0, logger_1.loggerUtil)("Get All User API Called!");
                return [7];
            case 4: return [2];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user.js.map