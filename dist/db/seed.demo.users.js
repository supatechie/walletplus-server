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
exports.getLastName = exports.getFirstName = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connect_1 = __importDefault(require("./connect"));
const user_model_1 = __importDefault(require("../models/user.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const point_model_1 = __importDefault(require("../models/point.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const session_model_1 = __importDefault(require("../models/session.model"));
const getFirstName = () => {
    const firstNames = ['janet', 'Dennis', 'Peter', 'Chukwu', 'Ann', 'Ayoola'];
    return firstNames[Math.round(Math.random() * (firstNames.length - 1))];
};
exports.getFirstName = getFirstName;
const getLastName = () => {
    const lastNames = ['Common', 'James', 'Carter', 'Maxim', 'Gupta', 'Webby'];
    return lastNames[Math.round(Math.random() * (lastNames.length - 1))];
};
exports.getLastName = getLastName;
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
            // create time series
            for (let i = 0; i < 20; i++) {
                const _body = i === 0 ? {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: `admin@gmail.com`,
                    username: `admin`,
                    phone: `08037389273`,
                    password: '12345678',
                    role: 'admin'
                } : {
                    firstName: exports.getFirstName(),
                    lastName: exports.getLastName(),
                    email: `demo${i}@gmail.com`,
                    username: `demo${i}`,
                    phone: `080373892${i}`,
                    password: '12345678',
                    role: 'user'
                };
                const userModel = new user_model_1.default(_body);
                const emailExist = yield userModel.checkEmailExist();
                const usernameExist = yield userModel.checkUsernameExist();
                if (emailExist || usernameExist) {
                    continue;
                }
                const user = yield user_model_1.default.create(_body);
                const body = { userId: user._id, balance: 0 };
                // create user account
                yield account_model_1.default.create(Object.assign(Object.assign({}, body), { pin: 1234 }));
                // create points account
                yield point_model_1.default.create(body);
                console.log('-------------------------------------------------------------------------');
                console.log(`USER: ${_body.username} & PASSWORD: ${_body.password} has been created. Use it to login`);
                console.log('---------------------------------------------------------------------');
            }
            console.log('-------------------------------------------------------------------------');
            console.log('Database seeding done, We created 20 users)');
            console.log('-------------------------------------------------------------------------');
            console.log(`An admin user--- admin -- with password -- 12345678 -- has been created. Use it to login`);
            console.log('-------------------------------------------------------------------------');
            console.log('You can as well use any of the above users to login');
            console.log('-------------------------------------------------------------------------');
            console.log('Happy testing :)');
            console.log('-------------------------------------------------------------------------');
            process.exit(1);
        }
        catch (err) {
            console.log(err.stack);
        }
    });
})();
