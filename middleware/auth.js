const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');

module.exports = {

    verifyToken: (req, res, next) => {
        if (!req.headers.token) {
            return res.send({ responseCode: 400, responseMessage: "Please provide token." });
        }
        else {

            jwt.verify(req.headers.token, 'ynotOffers', (err, result) => {
                if (err) {
                    response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.INVALID_TOKEN);
                }
                else {
                    userModel.findOne({ _id: result.id }, (err, userDetails) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!userDetails) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            if (userDetails.status == "BLOCK") {
                                response(res, ErrorCode.FORBIDDEN, [], ErrorMessage.BLOCKED_BY_ADMIN);
                            }
                            else if (userDetails.status == "DELETE") {
                                response(res, ErrorCode.UNAUTHORIZED, [], ErrorMessage.DELETED_BY_ADMIN);
                            }
                            else {
                                req.userId = result.id;
                                next();
                            }
                        }
                    })
                }
            })
        }
    }
}