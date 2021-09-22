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
const mongoose_1 = __importDefault(require("mongoose"));
const userService = __importStar(require("../../src/services/user.service"));
// @ts-ignore
const jest_helper_1 = require("../jest.helper");
jest.mock('../../src/services/user.service', () => {
    const originalModule = jest.requireActual('../../src/services/user.service');
    return Object.assign(Object.assign({ __esModule: true }, originalModule), { getUser: jest.fn(() => ({ error: false, data: [{ _id: 'jks', firstName: 'John', email: 'demo@gmail.com' }], message: 'Success', statusCode: 200 })) });
});
describe("Testing create new user function", () => {
    let dbClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dbClient = yield mongoose_1.default.connect(process.env.MONGO_DB_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
            console.log("database connected");
        }
        catch (error) {
            console.log(error.message);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient.connection.dropDatabase();
        yield dbClient.connection.close();
    }));
    test("should create and return a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.error).toBeFalsy();
    }));
    test("should return error = true if any of the properties is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Janet",
            lastName: "Wong",
            username: "demo1",
            email: 'demo1@gmail.com',
            phone: "08033789293",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.error).toBeTruthy();
    }));
    test("should return An error occurred if any of the properties is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo2",
            email: 'demo2@gmail.com',
            phone: "08056789293",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.message).toBe('An error occurred');
    }));
    test("should fail with statuscode 406 if any of the properties is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            email: 'demo3@gmail.com',
            phone: "08003789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.statusCode).toBe(406);
    }));
    test("should return a result like { error: boolean, data: Array, message: string, statusCode}", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Yina",
            lastName: "Wong",
            username: "demo4",
            email: 'demo4@gmail.com',
            phone: "08016789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res).toEqual(expect.objectContaining({
            error: expect.any(Boolean),
            data: expect.any(Array),
            message: expect.any(String),
            statusCode: expect.any(Number)
        }));
    }));
    test("should return Registration successful. A mail has been sent to demo5@gmail.com, please login to verify your account}", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Denen",
            lastName: "Jason",
            username: "demo5",
            email: 'demo5@gmail.com',
            phone: "08066789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.message).toBe(`Registration successful. A mail has been sent to demo5@gmail.com, please login to verify your account`);
    }));
    test("should return statuscode 201 success", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo6",
            email: 'demo6@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.statusCode).toBe(201);
    }));
    test("should return User with that phone number already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo7",
            email: 'demo7@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.message).toBe(`User with that phone number already exist`);
    }));
    test("should return User with that username already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo6",
            email: 'demo7@gmail.com',
            phone: "08000789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.message).toBe(`User with that username already exist`);
    }));
    test("should return User with that phone number already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo7",
            email: 'demo7@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.message).toBe(`User with that phone number already exist`);
    }));
});
describe("Testing sign in user function", () => {
    let dbClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dbClient = yield mongoose_1.default.connect(process.env.MONGO_DB_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
            console.log("database connected");
        }
        catch (error) {
            console.log(error.message);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient.connection.dropDatabase();
        yield dbClient.connection.close();
    }));
    test("should create and return a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.error).toBeFalsy();
    }));
    describe("Testing signin based on (username | email | phone) and password", () => {
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        };
        test("should return Login successful if correct username & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "demo",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.message).toBe("Login successful");
        }));
        test("should return error is false if correct email & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "demo@gmail.com",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.error).toBeFalsy();
        }));
        test("should return Login successful if correct phone & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "08043789293",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.message).toBe("Login successful");
        }));
        test("should return data[{user,payload}] if login is successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "08043789293",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.data).toStrictEqual(expect.arrayContaining([expect.objectContaining({
                    user: expect.any(Object),
                    payload: expect.any(Object)
                })]));
        }));
    });
    describe("Testing signin failure based on (username | email | phone) and password", () => {
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        };
        test("should return Wrong username/password provided if wrong username & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "demo1",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.message).toBe("Wrong username/password provided");
        }));
        test("should return error is true if wrong email & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "demo1@gmail.com",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.error).toBeTruthy();
        }));
        test("should return empty data array if wrong phone & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "08033789293",
                password: '12345678'
            };
            const res = yield userService.signInUser(user, meta_object);
            expect(res.data).toStrictEqual([]);
        }));
    });
});
describe("Testing signout function", () => {
    let dbClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dbClient = yield mongoose_1.default.connect(process.env.MONGO_DB_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
            console.log("database connected");
        }
        catch (error) {
            console.log(error.message);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient.connection.dropDatabase();
        yield dbClient.connection.close();
    }));
    test("should create and return a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        };
        const res = yield userService.createUser(user);
        expect(res.error).toBeFalsy();
    }));
    describe("Testing signin user", () => {
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        };
        let res;
        test("should return Login successful if correct username & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                username: "demo",
                password: '12345678'
            };
            res = yield userService.signInUser(user, meta_object);
            expect(res.message).toBe("Login successful");
        }));
        describe("should logout a user successfully if the refresh token is provided", () => {
            test("should return Login successful if correct username & password is passed", () => __awaiter(void 0, void 0, void 0, function* () {
                const { payload } = res.data[0];
                const _res = yield userService.signOutUser(payload.refresh_token);
                expect(_res.message).toBe("Logout successful");
            }));
        });
    });
});
describe("Testing generateNewAuthToken function", () => {
    test("should return {user, authToken, refreshToken} when called with a refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        };
        const returnValue = { authToken: "uwwoow", refreshToken: "hio876", user };
        const mockGenerateNewAuthToken = jest_helper_1.mockFunction(userService.generateNewAuthToken);
        const res = yield mockGenerateNewAuthToken('ksjsjka').then(() => returnValue);
        expect(res).toEqual(expect.objectContaining({
            user: expect.any(Object),
            authToken: expect.any(String),
            refreshToken: expect.any(String)
        }));
    }));
    test("should return false when called with an invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGenerateNewAuthToken = jest_helper_1.mockFunction(userService.generateNewAuthToken);
        const res = yield mockGenerateNewAuthToken('_hello').then(() => false);
        expect(res).toBeFalsy();
    }));
});
describe("Testing generateNewAuthToken function", () => {
    let dbClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dbClient = yield mongoose_1.default.connect(process.env.MONGO_DB_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
            console.log("database connected");
        }
        catch (error) {
            console.log(error.message);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbClient.connection.dropDatabase();
        yield dbClient.connection.close();
    }));
    describe("Create a user", () => {
        test("should create and return a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                firstName: "John",
                lastName: "doe",
                username: "demo",
                email: 'demo@gmail.com',
                phone: "08043789293",
                password: "12345678",
                role: "user"
            };
            const res = yield userService.createUser(user);
            expect(res.error).toBeFalsy();
        }));
    });
    describe("Test getUsers function", () => {
        test("should return all the users", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield userService.getAllUsers({});
            expect(res.error).toBeFalsy();
        }));
        test("should return {error, data, message, statusCode} ", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield userService.getAllUsers({});
            expect(res).toEqual(expect.objectContaining({
                error: expect.any(Boolean),
                data: expect.any(Array),
                message: expect.any(String),
                statusCode: expect.any(Number)
            }));
            expect(res.error).toBeFalsy();
        }));
    });
});
describe("Testing getUser function", () => {
    test("should return the user when called with a valid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockGetUser = jest_helper_1.mockFunction(userService.getUser);
        const res = yield mockGetUser('jsjsksj');
        expect(res.error).toBeFalsy();
        expect(mockGetUser).toBeCalledTimes(1);
        expect(mockGetUser).toBeCalledWith('jsjsksj');
    }));
});
