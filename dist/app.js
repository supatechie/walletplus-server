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
//import cors from 'cors'
const connect_1 = __importDefault(require("./db/connect"));
const logger_1 = __importDefault(require("./logger"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const config_1 = __importDefault(require("./config/config"));
const app = express_1.default();
const server = http_1.default.createServer(app);
const PORT = 5000; //process.env.PORT as unknown | 5000
//for cross origin resource sharing
//app.use(cors())
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
app.use(`${config_1.default.api}`, user_route_1.default);
server.listen(PORT, () => {
    logger_1.default.info(`Server running on url http://localhost:${PORT}`);
});
