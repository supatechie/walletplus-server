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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        if (!user.isModified("password"))
            return next();
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hashSync(user.password, salt);
        user.password = hash;
        return next();
    });
});
UserSchema.methods.checkEmailExist = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        return yield UserModel.findOne({ email: user.email }).then(u => {
            if (!u)
                return false;
            return true;
        }).catch(e => true);
    });
};
UserSchema.methods.checkUsernameExist = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        return yield UserModel.findOne({ username: user.username }).then(u => {
            if (!u)
                return false;
            return true;
        }).catch(e => true);
    });
};
UserSchema.methods.checkPhoneExist = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        return yield UserModel.findOne({ phone: user.phone }).then(u => {
            if (!u)
                return false;
            return true;
        }).catch(e => true);
    });
};
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
