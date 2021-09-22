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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connect_1 = __importDefault(require("./connect"));
const user_model_1 = __importDefault(require("../models/user.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const point_model_1 = __importDefault(require("../models/point.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
(function seedDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            connect_1.default();
            // empty the data
            yield user_model_1.default.deleteMany({});
            yield account_model_1.default.deleteMany({});
            yield point_model_1.default.deleteMany({});
            yield transaction_model_1.default.deleteMany({});
            yield session_model_1.default.deleteMany({});
            const _body = {
                firstName: 'John',
                lastName: 'Doe',
                email: `admin@gmail.com`,
                username: `admin`,
                phone: `08037389273`,
                password: '12345678',
                role: 'admin'
            };
            const userModel = new user_model_1.default(_body);
            const emailExist = yield userModel.checkEmailExist();
            const usernameExist = yield userModel.checkUsernameExist();
            const phoneExist = yield userModel.checkPhoneExist();
            if (emailExist || usernameExist || phoneExist) {
                return;
            }
            const user = yield user_model_1.default.create(_body);
            const body = { userId: user._id, balance: 0 };
            // create user account
            yield account_model_1.default.create(Object.assign(Object.assign({}, body), { pin: 1234 }));
            // create points account
            yield point_model_1.default.create(body);
            console.error('-------------------------------------------------------------------------');
            console.log('Database seeding done, We created 1 Admin user)');
            console.log('-------------------------------------------------------------------------');
            console.log(`USER: ${_body.username} with PASSWORD: ${_body.password} has been created. Use it to login`);
            console.error('-------------------------------------------------------------------------');
            console.log('Happy testing :)');
            console.log('-------------------------------------------------------------------------');
        }
        catch (err) {
            console.log(err.stack);
        }
    });
})();
