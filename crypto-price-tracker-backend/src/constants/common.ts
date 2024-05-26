
// HTTP error types and their default messages
export const httpErrorType = {
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
}

// Default error object
export const defaultErrorObject = {
    code: 400,
    message: '',
    errorType: ''
};

// Default server response object
export const generalServerResponse = {
    code: 200,
    status: 'Success',
    message: '',
    data: {}
}

export default {
    httpErrorType,
    defaultErrorObject,
    generalServerResponse
}