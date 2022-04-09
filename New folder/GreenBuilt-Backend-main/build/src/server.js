"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_validator_1 = require("express-validator");
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var dotenv_1 = __importDefault(require("dotenv"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_ui_json_1 = __importDefault(require("./docs/swagger-ui.json"));
var logger_1 = require("./utils/logger");
var statusCode_1 = require("./utils/statusCode");
var index_1 = require("./routes/index");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.get('/hello', function (req, res) { return res.send("HELLO"); });
app.use(function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(statusCode_1.statusCode.WRONG_ENTITY).json({ error: errors.array() });
    }
    next();
});
(0, index_1.routes)(app);
app.get('/hello', function (req, res) { return res.send("HELLO"); });
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_ui_json_1.default));
var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
    (0, logger_1.loggerUtil)("Listening on port " + PORT, 'SERVER');
});
//# sourceMappingURL=server.js.map