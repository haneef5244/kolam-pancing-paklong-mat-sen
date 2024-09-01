const errorCodes = {
    'P2002': field => `${field} already exists.`
}

export const generateErrorMessage = (errorCode, field) => {
    return errorCodes[errorCode](field);
}