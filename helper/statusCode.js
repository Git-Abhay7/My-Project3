/** 
 * @description All the Error messages that needed to be sent to Admin
 * @type {Object}
*/
module.exports.ErrorCode = Object.freeze({
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'SOMETHING_WRONG': 501,
    'INTERNAL_ERROR': 500,
    'INVALID_CREDENTIAL':402,
    'FORBIDDEN':403,
    'NOT_FOUND':404,
    'NOT_ALLOWED':405,
    'VALIDATION_FAILED':422,
    'ALREADY_EXIST':409
});

/** 
 * @description All the Success messages that needed to be sent to Admin
 * @type {Object}
*/
module.exports.SuccessCode = Object.freeze({
    'SUCCESS': 200,
    'OTP_SEND': 201,
});