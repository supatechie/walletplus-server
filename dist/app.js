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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_1 = __importDefault(require("./db/connect"));
const logger_1 = __importDefault(require("./logger"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const account_route_1 = __importDefault(require("./routes/account.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
const point_route_1 = __importDefault(require("./routes/point.route"));
const config_1 = __importDefault(require("./config"));
const corsConfig_1 = require("./config/corsConfig");
const app = express_1.default();
const server = http_1.default.createServer(app);
const PORT = parseInt(process.env.PORT) || 5000;
//for cross origin resource sharing
app.use(cors_1.default({ origin: corsConfig_1.allowedDomains(), credentials: true, }));
// parse cookies
app.use(cookie_parser_1.default());
// compresses all the responses
app.use(compression_1.default());
// security
app.use(helmet_1.default());
// parse body
app.use(express_1.default.json());
app.use(express_1.urlencoded({ extended: false }));
// mongo db connection 
connect_1.default();
// all routes
app.use(`${config_1.default.site.apiPath}`, user_route_1.default);
app.use(`${config_1.default.site.apiPath}`, account_route_1.default);
app.use(`${config_1.default.site.apiPath}`, transaction_route_1.default);
app.use(`${config_1.default.site.apiPath}`, point_route_1.default);
server.listen(PORT, () => {
    logger_1.default.info(`Server running on url http://localhost:${PORT}`);
});
