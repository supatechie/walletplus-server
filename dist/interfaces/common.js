"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFailedResponse = exports.ISuccessResponse = void 0;
exports.ISuccessResponse = {
    error: false,
    message: "Success",
    data: [],
    statusCode: 200
};
exports.IFailedResponse = {
    error: true,
    errors: [{ msg: "Sorry an error occurres, try again later" }],
    data: [],
    statusCode: 406
};
