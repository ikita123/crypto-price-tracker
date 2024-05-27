"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalServerResponse = exports.defaultErrorObject = exports.httpErrorType = void 0;
// HTTP error types and their default messages
exports.httpErrorType = {
    internalServerError: {
        code: 500,
        message: 'Something went wrong, please try again later',
        errorType: 'InternalServerError'
    },
    badRequest: {
        code: 400,
        message: 'Something is missing in request, please check your request.',
        errorType: 'BadRequest'
    },
    unauthorized: {
        code: 401,
        message: 'You are not authenticated, please login again.',
        errorType: 'Unauthorized'
    },
    forbidden: {
        code: 403,
        message: 'You are not authorized to access this route.',
        errorType: 'Unauthorized'
    }
};
// Default error object
exports.defaultErrorObject = {
    code: 400,
    message: '',
    errorType: ''
};
// Default server response object
exports.generalServerResponse = {
    code: 200,
    status: 'Success',
    message: '',
    data: {}
};
exports.default = {
    httpErrorType: exports.httpErrorType,
    defaultErrorObject: exports.defaultErrorObject,
    generalServerResponse: exports.generalServerResponse
};
