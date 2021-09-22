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
    message: "An error occurred",
    data: [],
    statusCode: 406
};
