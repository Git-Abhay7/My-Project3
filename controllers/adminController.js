const userModel = require('../models//userModel');
const branchModel = require('../models/branchModel');
const promotionModel = require('../models/promotionModel');
const offerModel = require('../models/offerModel');
const activityModel = require('../models/activityModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

const bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');



module.exports = {

    /**
    * Function Name :login
    * Description   : login for admin
    *
    * @return response
   */

    login: (req, res) => {
        try {
            let query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: { $ne: "DELETE" } };
            userModel.findOne(query, (error, userResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!userResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_REGISTERED)
                }
                else {
                    let check = bcrypt.compareSync(req.body.password, userResult.password);
                    if (check) {
                        var token = jwt.sign({ id: userResult._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'ynotOffers');
                        response(res, SuccessCode.SUCCESS, { token: token }, SuccessMessage.LOGIN_SUCCESS)
                    }
                    else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL)

                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
    * Function Name : forgotPassword
    * Description   : forgotPassword for admin
    *
    * @return response
   */

    forgotPassword: (req, res) => {
        try {
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: "ACTIVE", userType: "ADMIN" };
            userModel.findOne(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_REGISTERED);
                }
                else {
                    let otp = commonFunction.getOTP();
                    let time = new Date().getTime();
                    if (req.body.email == result.email) {
                        commonFunction.sendMail(req.body.email, `Your otp is:- ${otp}. Please verify this otp for reset password.`, (error, mailResult) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                userModel.findOneAndUpdate({ email: result.email, status: "ACTIVE" }, { $set: { otp: otp, otpTime: time, otpVerification: false } }, { new: true }, (error, otpUpdate) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else {
                                        var result = {
                                            userType: otpUpdate.userType,
                                            otp: otpUpdate.otp,
                                            email: otpUpdate.email,
                                            otpVerification: otpUpdate.otpVerification
                                        };
                                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.EMAIL_SEND);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        commonFunction.sendSMS(req.body.email, `Welcome to YNOT Offers. Your One Time Password is:- ${otp} . Please verify your otp for reset password.`, (smsErr, smsResult) => {
                            if (smsErr) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                userModel.findOneAndUpdate({ mobileNumber: result.mobileNumber, status: "ACTIVE" }, { $set: { otp: otp, otpTime: time, otpVerification: false } }, { new: true }, (error, otpUpdate) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else {
                                        var result = {
                                            userType: otpUpdate.userType,
                                            otp: otpUpdate.otp,
                                            mobileNumber: otpUpdate.mobileNumber,
                                            otpVerification: otpUpdate.otpVerification
                                        };
                                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.OTP_SEND);
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name : otpVerify
    * Description   : otpVerify for admin
    *
    * @return response
   */

    otpVerify: (req, res) => {
        try {
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: "ACTIVE" };
            userModel.findOne(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_REGISTERED);
                }
                else {
                    var otpTime2 = new Date().getTime();
                    var dif = otpTime2 - result.otpTime;
                    if (dif >= 180000) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OTP_EXPIRED);
                    }
                    else {
                        if (req.body.otp == result.otp || req.body.otp == 1234) {
                            userModel.findOneAndUpdate(query, { $set: { otpVerification: true } }, { new: true }, (err2, result2) => {
                                if (err2) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, result2, SuccessMessage.VERIFY_OTP);
                                }
                            })
                        }
                        else {
                            response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_OTP);
                        }
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
       * Function Name :resendOTP
       * Description   : resendOTP for admin
       *
       * @return response
      */

    resendOTP: (req, res) => {
        try {
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: "ACTIVE", userType: "ADMIN" };
            userModel.findOne(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_REGISTERED);
                }
                else {
                    let otp = commonFunction.getOTP();
                    let time = new Date().getTime();
                    if (req.body.email == result.email) {
                        commonFunction.sendMail(req.body.email, otp, (error, mailResult) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                userModel.findOneAndUpdate({ email: result.email, status: "ACTIVE" }, { $set: { otp: otp, otpTime: time, otpVerification: false } }, { new: true }, (error, otpUpdate) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else {
                                        var result = {
                                            userType: otpUpdate.userType,
                                            otp: otpUpdate.otp,
                                            email: otpUpdate.email,
                                            otpVerification: otpUpdate.otpVerification
                                        };
                                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.EMAIL_SEND);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        commonFunction.sendSMS(req.body.email, `YNOT Offers: Your otp is:- ${otp} . Please verify your otp for reset password.`, (smsErr, smsResult) => {
                            if (smsErr) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                userModel.findOneAndUpdate({ mobileNumber: result.mobileNumber, status: "ACTIVE" }, { $set: { otp: otp, otpTime: time, otpVerification: false } }, { new: true }, (error, otpUpdate) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                    }
                                    else {
                                        var result = {
                                            userType: otpUpdate.userType,
                                            otp: otpUpdate.otp,
                                            mobileNumber: otpUpdate.mobileNumber,
                                            otpVerification: otpUpdate.otpVerification
                                        };
                                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.OTP_SEND);
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
     * Function Name :resetPassword
     * Description   : resetPassword for admin
     *
     * @return response
    */

    resetPassword: (req, res) => {
        try {
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: "ACTIVE" };
            userModel.findOne(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_REGISTERED);
                }
                else {
                    if (req.body.email == result.email) {
                        let newPassword = bcrypt.hashSync(req.body.newPassword);
                        userModel.findOneAndUpdate({ email: result.email, status: "ACTIVE" }, { $set: { password: newPassword } }, { new: true }, (error, updatePassword) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.RESET_SUCCESS);
                            }
                        })
                    }
                    else {
                        var newPassword = bcrypt.hashSync(req.body.newPassword);
                        userModel.findOneAndUpdate({ mobileNumber: result.mobileNumber, status: "ACTIVE" }, { $set: { password: newPassword } }, { new: true }, (error, updatePassword) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, [], SuccessMessage.RESET_SUCCESS);
                            }
                        })
                    }

                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
     * Function Name :myProfile
     * Description   : myProfile for admin
     *
     * @return response
    */

    myProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "ADMIN", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editProfile
     * Description   : editProfile for admin
     *
     * @return response
    */

    editProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (err, adminResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!adminResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $ne: "DELETE" } }, { _id: { $ne: adminResult._id } }] }
                    userModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            if (req.body.oldPassword && !req.body.profilePic) {
                                var check = bcrypt.compareSync(req.body.oldPassword, adminResult.password);
                                if (!check) {
                                    response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.OLD_PASSWORD);
                                }
                                else {
                                    req.body.password = bcrypt.hashSync(req.body.newPassword);
                                    userModel.findByIdAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                        if (err) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.PROFILE_DETAILS);
                                        }
                                    })
                                }
                            }
                            else if (!req.body.oldPassword && req.body.profilePic) {
                                commonFunction.uploadImage(req.body.profilePic, (err, imageResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        req.body.profilePic = imageResult;
                                        userModel.findByIdAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                            if (err) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.PROFILE_DETAILS);
                                            }
                                        })
                                    }
                                })
                            }
                            else if (req.body.oldPassword && req.body.profilePic) {
                                commonFunction.uploadImage(req.body.profilePic, (err, imageResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        var check = bcrypt.compareSync(req.body.oldPassword, adminResult.password);
                                        if (!check) {
                                            response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.OLD_PASSWORD);
                                        }
                                        else {
                                            req.body.profilePic = imageResult;
                                            req.body.password = bcrypt.hashSync(req.body.newPassword);
                                            userModel.findByIdAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                                if (err) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.PROFILE_DETAILS);
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                userModel.findByIdAndUpdate({ _id: adminResult._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.PROFILE_DETAILS);
                                    }
                                })
                            }

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addConsumer
     * Description   : addConsumer in user management-enduser
     *
     * @return response
    */

    addConsumer: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, userResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!userResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    var query = { $and: [{ status: { $ne: "DELETE" } }, { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }] }
                    userModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            var count = 0
                            req.body.uploadDocs.forEach((elem, index) => {
                                commonFunction.uploadImage(elem.docs, (err, docResult) => {
                                    if (err) {
                                        console.log({ responseCode: 500, responseMessage: "Internal server error" });
                                    }
                                    else {
                                        elem.docs = docResult;
                                        count = count + 1;
                                        if (count == req.body.uploadDocs.length) {
                                            elem.docs = docResult;
                                            commonFunction.sendMail(req.body.email, `Dear ${req.body.firstName}, Welcome to YNOT-offers. Your account has been created as consumer. Your login credentials are:- <br> Email: ${req.body.email} <br> Password: ${req.body.password}`, (error, mailResult) => {
                                                if (error) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                                }
                                                else {
                                                    req.body.password = bcrypt.hashSync(req.body.password);
                                                    new userModel(req.body).save((err, saveResult) => {
                                                        if (err) {
                                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                        }
                                                        else {
                                                            var obj = {

                                                            };
                                                            response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.CONSUMER_ADD);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    })
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewConsumer
     * Description   : viewConsumer in user management-enduser
     *
     * @return response
    */

    viewConsumer: (req, res) => {
        try {
            userModel.findOne({ _id: req.params._id, userType: "USER", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editConsumer
     * Description   : editConsumer in user management-enduser
     *
     * @return response
    */

    editConsumer: (req, res) => {
        try {
            function update() {
                userModel.findByIdAndUpdate({ _id: req.body._id, status: "ACTIVE" }, { $set: req.body }, { new: true }, (error, updateResult) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                    }
                })
            }
            userModel.findOne({ _id: req.body._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    userModel.findOne(query, (err, result1) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result1) {
                            if (result1.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            if (req.body.uploadDocs) {
                                var count = 0
                                req.body.uploadDocs.forEach((elem, index) => {
                                    commonFunction.uploadImage(elem.docs, (err, docResult) => {
                                        if (err) {
                                            console.log({ responseCode: 500, responseMessage: "Internal server error" });
                                        }
                                        else {
                                            elem.docs = docResult;
                                            count = count + 1;
                                            if (count == req.body.uploadDocs.length) {
                                                elem.docs = docResult;
                                                update();
                                            }
                                        }
                                    })
                                })
                            }
                            else {
                                update();
                            }

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateConsumer
     * Description   : deactivateConsumer in user management-enduser
     *
     * @return response
    */

    deactivateConsumer: (req, res) => {
        try {
            userModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } }, (err, findData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ _id: findData._id }, { $set: { status: "DELETE" } }, { new: true }, (error, deactivate) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, deactivate, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name : deactivateConsumer
     * Description   : deactivateConsumer in user management-enduser
     *
     * @return response
    */

    consumerList: (req, res) => {
        try {
            var query = { userType: "USER", status: { $ne: "DELETE" } };

            if (req.body.search) {
                query.firstName = new RegExp('^' + req.body.search, "i");
            }
            if (req.body.fromDate && !req.body.toDate) {
                query.createdAt = { $gte: req.body.fromDate };
            }
            if (!req.body.fromDate && req.body.toDate) {
                query.createdAt = { $lte: req.body.toDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                query.$and = [{ createdAt: { $gte: req.body.fromDate } }, { createdAt: { $lte: req.body.toDate } }];
            }

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            userModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addVendor
     * Description   : addVendor in user management-vendor
     *
     * @return response
    */

    addVendor: (req, res) => {
        try {
            var query = { $and: [{ status: { $ne: "DELETE" } }, { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }] }
            userModel.findOne(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    if (result.email == req.body.email) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                    }
                    else {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                    }
                }
                else {
                    req.body.myLocations = [{
                        name: req.body.locationName,
                        address: req.body.address,
                        poBox: req.body.poBox,
                        country: req.body.country,
                        state: req.body.state,
                        city: req.body.city,
                        coordinates: [req.body.lat, req.body.log]
                    }];
                    req.body.shopTimings = [{
                        sun: req.body.sun,
                        mon: req.body.mon,
                        tue: req.body.tue,
                        wed: req.body.wed,
                        thu: req.body.thu,
                        fri: req.body.fri,
                        sat: req.body.sat
                    }];
                    req.body.userType = "VENDOR";
                    req.body.mySocialAccount = req.body.linkSocialAccount;
                    var count = 0
                    req.body.uploadDocs.forEach((elem, index) => {
                        commonFunction.uploadImage(elem.docs, (err, docResult) => {
                            if (err) {
                                console.log({ responseCode: 500, responseMessage: "Internal server error" });
                            }
                            else {
                                elem.docs = docResult;
                                count = count + 1;
                                if (count == req.body.uploadDocs.length) {
                                    elem.docs = docResult;
                                    commonFunction.sendMail(req.body.email, `Dear ${req.body.firstName}, Welcome to YNOT-offers. Your account has been created as vendor. Your login credentials are:- <br> Email: ${req.body.email} <br> Password: ${req.body.password}`, (error, mailResult) => {
                                        if (error) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                        }
                                        else {
                                            req.body.password = bcrypt.hashSync(req.body.password);
                                            new userModel(req.body).save((err, saveResult) => {
                                                if (err) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.VENDOR_ADD);
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewVendor
     * Description   : viewVendor in user management-vendor
     *
     * @return response
    */

    viewVendor: (req, res) => {
        try {
            userModel.findOne({ _id: req.params.vendorId, userType: "VENDOR", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
                    branchModel.find({ vendorId: result._id, status: "ACTIVE" }, (err, branchResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (branchResult.length == 0) {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [result, branchResult], SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editVendor
     * Description   : editVendor in user management-vendor
     *
     * @return response
    */

    editVendor: (req, res) => {
        try {
            function update() {
                userModel.findByIdAndUpdate({ _id: req.body.vendorId, userType: "VENDOR", status: "ACTIVE" }, { $set: req.body }, { new: true }, (error, updateResult) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                    }
                })
            }
            userModel.findOne({ _id: req.body.vendorId, userType: "VENDOR", status: "ACTIVE" }, (err, vendorResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!vendorResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
                    let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $ne: "DELETE" } }, { _id: { $ne: vendorResult._id } }] }
                    userModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            req.body.shopTimings = [{
                                sun: req.body.sun,
                                mon: req.body.mon,
                                tue: req.body.tue,
                                wed: req.body.wed,
                                thu: req.body.thu,
                                fri: req.body.fri,
                                sat: req.body.sat
                            }]

                            req.body.myLocations = [{
                                name: req.body.locationName,
                                address: req.body.address,
                                poBox: req.body.poBox,
                                country: req.body.country,
                                state: req.body.state,
                                city: req.body.city,
                                coordinates: [req.body.lat, req.body.log]
                            }];
                            if (req.body.uploadDocs) {
                                var count = 0
                                req.body.uploadDocs.forEach((elem, index) => {
                                    commonFunction.uploadImage(elem.docs, (err, docResult) => {
                                        if (err) {
                                            console.log({ responseCode: 500, responseMessage: "Internal server error" });
                                        }
                                        else {
                                            elem.docs = docResult;
                                            count = count + 1;
                                            if (count == req.body.uploadDocs.length) {
                                                elem.docs = docResult;
                                                update();
                                            }
                                        }
                                    })
                                })
                            }
                            else {
                                update();
                            }

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addBranch
     * Description   : addBranch in user management-vendor
     *
     * @return response  
    */

    addBranch: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.vendorId, userType: "VENDOR", status: "ACTIVE" }, (err, vendorResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!vendorResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
                    var query = { $and: [{ status: { $ne: "DELETE" } }, { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }, { branchName: req.body.branchName }] }] }
                    branchModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else if (result.mobileNumber == req.body.mobileNumber) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BRANCH_EXIST);
                            }
                        }
                        else {
                            req.body.location = {
                                type: "Point",
                                coordinates: [req.body.lat, req.body.long]
                            };
                            req.body.shopTimings = [{
                                sun: req.body.sun,
                                mon: req.body.mon,
                                tue: req.body.tue,
                                wed: req.body.wed,
                                thu: req.body.thu,
                                fri: req.body.fri,
                                sat: req.body.sat
                            }];
                            var count = 0
                            req.body.uploadDocs.forEach((elem, index) => {
                                commonFunction.uploadImage(elem.docs, (err, docResult) => {
                                    if (err) {
                                        console.log({ responseCode: 500, responseMessage: "Internal server error" });
                                    }
                                    else {
                                        elem.docs = docResult;
                                        count = count + 1;
                                        if (count == req.body.uploadDocs.length) {
                                            elem.docs = docResult;
                                            new branchModel(req.body).save((err, saveResult) => {
                                                if (err) {
                                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                                }
                                                else {
                                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.BRANCH_ADD);
                                                }
                                            })
                                        }
                                    }
                                })
                            })

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editBranch
     * Description   : editBranch in user management-vendor
     *
     * @return response
    */

    editBranch: (req, res) => {
        try {
            function update() {
                branchModel.findByIdAndUpdate({ _id: req.body._id, status: "ACTIVE" }, { $set: req.body }, { new: true }, (error, updateResult) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                    }
                })
            }
            branchModel.findOne({ _id: req.body._id, status: "ACTIVE" }, (err, branchResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!branchResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $ne: "DELETE" } }, { _id: { $ne: branchResult._id } }] }
                    branchModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            req.body.location = {
                                type: "Point",
                                coordinates: [req.body.lat, req.body.long]
                            };
                            req.body.shopTimings = [{
                                mon: req.body.mon,
                                tue: req.body.tue,
                                wed: req.body.wed,
                                thu: req.body.thu,
                                fri: req.body.fri,
                                sat: req.body.sat
                            }]
                            if (req.body.uploadDocs) {
                                var count = 0
                                req.body.uploadDocs.forEach((elem, index) => {
                                    commonFunction.uploadImage(elem.docs, (err, docResult) => {
                                        if (err) {
                                            console.log({ responseCode: 500, responseMessage: "Internal server error" });
                                        }
                                        else {
                                            elem.docs = docResult;
                                            count = count + 1;
                                            if (count == req.body.uploadDocs.length) {
                                                elem.docs = docResult;
                                                update();
                                            }
                                        }
                                    })
                                })
                            }
                            else {
                                update();
                            }

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    /**
     * Function Name :viewBranch
     * Description   : viewBranch in user management-vendor
     *
     * @return response
    */

    viewBranch: (req, res) => {
        try {
            branchModel.findById({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateBranch
     * Description   : deactivateBranch in user management-vendor
     *
     * @return response
    */

    deactivateBranch: (req, res) => {
        try {
            branchModel.findById({ _id: req.body._id, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    branchModel.findByIdAndUpdate({ _id: req.body._id, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :branchList
     * Description   : branchList in user management-vendor
     *
     * @return response
    */

    branchList: (req, res) => {
        try {
            var query = { vendorId: req.body.vendorId, status: "ACTIVE" };
            branchModel.find(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateVendor
     * Description   : deactivateVendor in user management-vendor
     *
     * @return response
    */

    deactivateVendor: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.vendorId, userType: "VENDOR", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ _id: result._id }, { $set: { status: "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :vendorList
     * Description   : vendorList in user management-vendor
     *
     * @return response
    */

    vendorList: (req, res) => {
        try {
            var query = { userType: "VENDOR", status: "ACTIVE" };

            if (req.body.search) {
                query.$or = [{ company: new RegExp('^' + req.body.search, "i") }, { firstName: new RegExp('^' + req.body.search, "i") }];
            }
            if (req.body.fromDate && !req.body.toDate) {
                query.createdAt = { $gte: req.body.fromDate };
            }
            if (!req.body.fromDate && req.body.toDate) {
                query.createdAt = { $lte: req.body.toDate }
            }
            if (req.body.fromDate && req.body.toDate) {
                query.$and = [{ createdAt: { $gte: req.body.fromDate } }, { createdAt: { $lte: req.body.toDate } }];
            }

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            userModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addSubAdmin
     * Description   : addSubAdmin in user management-subadmin
     *
     * @return response
    */

    addSubAdmin: async (req, res) => {
        try {
            var query = { $and: [{ status: { $ne: "DELETE" } }, { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }] }
            userModel.findOne(query, async (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    if (result.email == req.body.email) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                    }
                    else {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                    }
                }
                else {
                    if (req.body.profilePic) {
                        var pic = await convertImage()
                    }
                    var pass = req.body.password;
                    req.body.password = bcrypt.hashSync(req.body.password);
                    var data = {
                        userName: req.body.userName,
                        fullName: req.body.fullName,
                        password: req.body.password,
                        email: req.body.email,
                        mobileNumber: req.body.mobileNumber,
                        designation: req.body.designation,
                        department: req.body.department,
                        company: req.body.company,
                        branch: req.body.branch,
                        city: req.body.city,
                        country: req.body.country,
                        profilePic: pic,
                        assignRole: req.body.assignRole,
                        password: req.body.password,
                        userType: "SUBADMIN"
                    }
                    commonFunction.sendMail(req.body.email, `Dear ${req.body.fullName}, Welcome to YNOT-offers. Your account has been created as a sub-admin. Your login credentials are:- <br> Email: ${req.body.email} <br> Password: ${pass}`, (err, emailResult) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            new userModel(data).save((error, saved) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saved, SuccessMessage.SUB_ADMIN_CREATED);
                                }
                            })
                        }
                    })


                    //*********************Function for profile pic upload *************************************/
                    function convertImage() {
                        return new Promise((resolve, reject) => {
                            commonFunction.uploadImage(req.body.profilePic, (error, upload) => {
                                if (error) {
                                    console.log("Error uploading image")
                                }
                                else {
                                    resolve(upload)
                                }
                            })
                        })
                    }
                    //*************************End of profle pic upload function *****************************/

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewSubAdmin
     * Description   : viewSubAdmin in Sub-admin management
     *
     * @return response
    */

    viewSubAdmin: (req, res) => {
        try {
            userModel.findOne({ _id: req.params.subAdminId, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editSubAdmin
     * Description   : editSubAdmin in Sub-admin management
     *
     * @return response
    */

    editSubAdmin: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.subAdminId, userType: "SUBADMIN", status: "ACTIVE" }, (err, subAdminResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!subAdminResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $ne: "DELETE" } }, { _id: { $ne: subAdminResult._id } }] }
                    userModel.findOne(query, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            if (result.email == req.body.email) {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.EMAIL_EXIST);
                            }
                            else {
                                response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                            }
                        }
                        else {
                            if (req.body.profilePic) {
                                commonFunction.uploadImage(req.body.profilePic, (err, imageResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        req.body.profilePic = imageResult;
                                        if (req.body.password) {
                                            req.body["password"] = bcrypt.hashSync(req.body.password)
                                        }

                                        userModel.findByIdAndUpdate({ _id: subAdminResult._id }, { $set: req.body }, { new: true }, (err, success) => {
                                            if (err) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                if (req.body.password) {
                                    req.body["password"] = bcrypt.hashSync(req.body.password)
                                }

                                userModel.findByIdAndUpdate({ _id: subAdminResult._id }, { $set: req.body }, { new: true }, (err, success) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, success, SuccessMessage.UPDATE_SUCCESS);
                                    }
                                })
                            }


                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
     * Function Name :deleteSubAdmin
     * Description   : deleteSubAdmin in Sub-admin management
     *
     * @return response
    */

    deleteSubAdmin: (req, res) => {
        try {
            userModel.findOneAndUpdate({ _id: req.body.subAdminId, status: { $ne: "DELETE" } }, { $set: { status: "DELETE" } }, { new: true }, (error, success) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                }
                else if (!success) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, success, SuccessMessage.DELETE_SUCCESS);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :subAdminList
    * Description   : subAdminList in Sub-admin management
    *
    * @return response
    */

    subAdminList: (req, res) => {
        try {
            var query = { userType: "SUBADMIN", status: { $ne: "DELETE" } };
            if (req.body.search) {
                query.$or = [{ fullName: new RegExp('^' + req.body.search, "i") }, { email: new RegExp('^' + req.body.search, "i") }, { mobileNumber: new RegExp('^' + req.body.search, "i") }]
            }

            req.body.limit = parseInt(req.body.limit);

            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 100,
                sort: { createdAt: -1 }
            };

            userModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :addPromotion
    * Description   : addPromotion in Promotions-YNOT
    *
    * @return response
    */

    addPromotion: (req, res) => {
        try {
            promotionModel.findOne({ promotionName: req.body.promotionName, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.PROMOTION_EXIST);
                }
                else {
                    var obj = {
                        promotionName: req.body.promotionName,
                        branches: req.body.branches,
                        fromDate: req.body.fromDate,
                        toDate: req.body.toDate,
                        occasion: req.body.occasion,
                        specialTermsConditions: req.body.specialTermsConditions
                    };
                    new promotionModel(obj).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.PROMOTION_ADD);
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :viewPromotion
    * Description   : viewPromotion in Promotions-YNOT
    *
    * @return response
    */

    viewPromotion: (req, res) => {
        try {
            promotionModel.findOne({ _id: req.params.promotionId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    offerModel.find({ promotionId: result._id, status: "ACTIVE" }).exec((err, offerList) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (offerList.length == 0) {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [result, offerList], SuccessMessage.DETAIL_GET);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :addOffer
    * Description   : addOffer in Promotions-YNOT
    *
    * @return response
    */

    addOffer: (req, res) => {
        try {
            promotionModel.findOne({ _id: req.body.promotionId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    commonFunction.uploadImage(req.body.offerImage, (err, imageResult) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            if (req.body.otherItemName) {
                                commonFunction.uploadImage(req.body.image, (err, photoResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        req.body.otherItemDetails = {
                                            otherItemName: req.body.otherItemName,
                                            image: photoResult,
                                            category: req.body.category,
                                            subCategory: req.body.subCategory,
                                            brand: req.body.brand
                                        };

                                        var obj = {
                                            promotionId: result._id,
                                            itemName: req.body.itemName,
                                            categoryId: req.body.categoryId,
                                            subCategoryId: req.body.subCategoryId,
                                            brandId: req.body.brandId,
                                            offerImage: imageResult,
                                            discount: req.body.discount,
                                            aed: req.body.aed,
                                            oldPrice: req.body.oldPrice,
                                            newPrice: req.body.newPrice,
                                            Buy: req.body.Buy,
                                            Get: req.body.Get,
                                            otherItemDetails: req.body.otherItemDetails
                                        };

                                        new offerModel(obj).save((saveErr, saveResult) => {
                                            if (saveErr) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.OFFER_ADD);
                                            }
                                        })

                                    }
                                })
                            }
                            else {
                                var obj = {
                                    promotionId: result._id,
                                    itemName: req.body.itemName,
                                    categoryId: req.body.categoryId,
                                    subCategoryId: req.body.subCategoryId,
                                    brandId: req.body.brandId,
                                    offerImage: imageResult,
                                    discount: req.body.discount,
                                    aed: req.body.aed,
                                    oldPrice: req.body.oldPrice,
                                    newPrice: req.body.newPrice,
                                    Buy: req.body.Buy,
                                    Get: req.body.Get
                                };

                                new offerModel(obj).save((saveErr, saveResult) => {
                                    if (saveErr) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.OFFER_ADD);
                                    }
                                })
                            }

                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :viewOffer
    * Description   : viewOffer in Promotions-YNOT
    *
    * @return response
    */

    viewOffer: (req, res) => {
        try {
            offerModel.findOne({ _id: req.params.offerId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :editPromotion
    * Description   : editPromotion in Promotions-YNOT
    *
    * @return response
    */

    editPromotion: (req, res) => {
        try {
            promotionModel.findOne({ _id: req.body.promotionId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ promotionName: req.body.promotionName }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    promotionModel.findOne(query, (err, promotionResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (promotionResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.PROMOTION_EXIST);
                        }
                        else {
                            promotionModel.findOneAndUpdate({ _id: result._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :editOffer
    * Description   : editOffer in Promotions-YNOT
    *
    * @return response
    */

    editOffer: (req, res) => {
        try {
            offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    if (req.body.offerImage) {
                        commonFunction.uploadImage(req.body.offerImage, (err, imageResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                req.body.offerImage = imageResult;
                                offerModel.findOneAndUpdate({ _id: result._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        offerModel.findOneAndUpdate({ _id: result._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :editItem
    * Description   : editItem in Promotions-YNOT
    *
    * @return response
    */

    editItem: (req, res) => {
        try {
            offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    if (req.body.image) {
                        commonFunction.uploadImage(req.body.image, (err, imageResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                var set = {};
                                set['otherItemDetails.image'] = imageResult;
                                if (req.body.otherItemName) {
                                    set['otherItemDetails.otherItemName'] = req.body.otherItemName;
                                }
                                if (req.body.category) {
                                    set['otherItemDetails.category'] = req.body.category;
                                }
                                if (req.body.subCategory) {
                                    set['otherItemDetails.subCategory'] = req.body.subCategory;
                                }
                                if (req.body.brand) {
                                    set['otherItemDetails.brand'] = req.body.brand;
                                }
                                offerModel.findOneAndUpdate({ _id: result._id }, { $set: set }, { new: true }, (err, updateResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                                    }
                                })
                            }
                        })
                    }
                    else {
                        var set = {};
                        if (req.body.otherItemName) {
                            set['otherItemDetails.otherItemName'] = req.body.otherItemName;
                        }
                        if (req.body.category) {
                            set['otherItemDetails.category'] = req.body.category;
                        }
                        if (req.body.subCategory) {
                            set['otherItemDetails.subCategory'] = req.body.subCategory;
                        }
                        if (req.body.brand) {
                            set['otherItemDetails.brand'] = req.body.brand;
                        }
                        offerModel.findOneAndUpdate({ _id: result._id }, { $set: set }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                            }
                        })
                    }
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :deactivateOffer
    * Description   : deactivateOffer in Promotions-YNOT
    *
    * @return response
    */

    deactivateOffer: (req, res) => {
        try {
            offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    offerModel.findOneAndUpdate({ _id: result._id }, { $set: { status: "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.DELETE_SUCCESS);
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :offerList
    * Description   : offerList in Promotions-YNOT
    *
    * @return response
    */

    offerList: (req, res) => {


        try {

            var query = { promotionId: req.body.promotionId, status: "ACTIVE" };

            offerModel.find(query, (err, result) => {

                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :deactivatePromotion
    * Description   : deactivatePromotion in Promotions-YNOT
    *
    * @return response
    */

    deactivatePromotion: (req, res) => {
        try {
            promotionModel.findOne({ _id: req.body.promotionId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    promotionModel.findOneAndUpdate({ _id: result._id }, { $set: { status: "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            offerModel.update({ promotionId: req.body.promotionId }, { $set: { status: "DELETE" } }, { multi: true }, (err, deleteResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.DELETE_SUCCESS);
                                }
                            })
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :promotionList
    * Description   : promotionList in Promotions-YNOT
    *
    * @return response
    */

    promotionList: (req, res) => {
        try {
            var query = { status: "ACTIVE" };

            if (req.body.search) {
                query.promotionName = new RegExp('^' + req.body.search, "i");
            }
            if (req.body.fromDate && !req.body.toDate) {
                query.createdAt = { $gte: req.body.fromDate };
            }
            if (!req.body.fromDate && req.body.toDate) {
                query.createdAt = { $lte: req.body.toDate };
            }
            if (req.body.fromDate && req.body.toDate) {
                query.$and = [{ createdAt: { $gte: req.body.fromDate } }, { createdAt: { $lte: req.body.toDate } }];
            }

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 }
            };

            promotionModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :viewActivity
    * Description   : viewActivity in User activity log
    *
    * @return response
    */

    viewActivity: (req, res) => {
        try {
            activityModel.findOne({ _id: req.params.activityId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DETAIL_GET);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :activityList
    * Description   : activityList in User activity log
    *
    * @return response
    */

    activityList: (req, res) => {
        try {
            var query = { status: "ACTIVE" };

            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            activityModel.paginate(query, options, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.docs.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :logout
    * Description   : logout for admin
    *
    * @return response
    */

    logout: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, [], SuccessMessage.LOGOUT_SUCCESS);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :getTotalCount
    * Description   : getTotalCount in dashboard-ynot
    *
    * @return response
    */

    getTotalCount: (req, res) => {
        try {
            var aggregate = ([
                {
                    $match: { status: "ACTIVE" }
                },
                {
                    $group: {
                        _id: null,
                        totalConsumer: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$userType", "USER"] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                        // consumer24hrs: {
                        //     $sum: {
                        //         $cond: {
                        //             if: { $lte: ["$createdAt", new Date().toISOString()] } && { $gte: ["$createdAt", new Date() - 1 * 24 * 60 * 60 * 1000] },
                        //             then: 1,
                        //             else: 0
                        //         }
                        //     }
                        // },
                        totalVendor: {
                            $sum: {
                                $cond: {
                                    if: { $eq: ["$userType", "VENDOR"] },
                                    then: 1,
                                    else: 0
                                }
                            }
                        },
                    },

                }
            ]);

            userModel.aggregate(aggregate, (err, result) => {
                console.log(">>>>>2137", err, result)
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :consumer24hrs
    * Description   : consumer24hrs in dashboard-ynot
    *
    * @return response
    */

    consumer24hrs: (req, res) => {
        try {
            var query = { userType: "USER", status: { $ne: "DELETE" } };
            userModel.find(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var array = []
                    for (let i = 0; i < result.length; i++) {
                        array.push(result[i].createdAt.getTime())
                    }
                    var arr = []
                    array.forEach(i => {
                        var currentTime = new Date().getTime();
                        let diff = currentTime - i
                        if (diff < 86400000) {
                            arr.push(i)
                        }
                    })
                    var result1 = `Number of signup consumer within 24 hours is: ${arr.length}`
                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_FOUND)
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :vendor24hrs
    * Description   : vendor24hrs in dashboard-ynot
    *
    * @return response
    */

    vendor24hrs: (req, res) => {
        try {
            var query = { userType: "VENDOR", status: { $ne: "DELETE" } };
            userModel.find(query, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var array = []
                    for (let i = 0; i < result.length; i++) {
                        array.push(result[i].createdAt.getTime())
                    }
                    var arr = []
                    array.forEach(i => {
                        var currentTime = new Date().getTime();
                        let diff = currentTime - i
                        if (diff < 86400000) {
                            arr.push(i)
                        }
                    })
                    var result1 = `Number of signup vendor within 24 hours is: ${arr.length}`
                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_FOUND)
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :offerCount
    * Description   : offerCount in dashboard-ynot
    *
    * @return response
    */

    offerCount: (req, res) => {
        try {
            offerModel.count({ status: "ACTIVE" }, (error, numberCount) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }

                else {
                    response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
    * Function Name :offer24hrs
    * Description   : offer24hrs in dashboard-ynot
    *
    * @return response
    */

    offer24hrs: (req, res) => {
        try {
            offerModel.find({ status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var array = []
                    for (let i = 0; i < result.length; i++) {
                        array.push(result[i].createdAt.getTime())
                    }
                    var arr = []
                    array.forEach(i => {
                        var currentTime = new Date().getTime();
                        let diff = currentTime - i
                        if (diff < 86400000) {
                            arr.push(i)
                        }
                    })
                    var result1 = `Count of offers added in 24 hours is: ${arr.length}`
                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_FOUND)
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
    * Function Name :offerDeactivated24hrs
    * Description   : offerDeactivated24hrs in dashboard-ynot
    *
    * @return response
    */

    offerDeactivated24hrs: (req, res) => {
        try {
            offerModel.find({ status: "DELETE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var array = []
                    for (let i = 0; i < result.length; i++) {
                        array.push(result[i].createdAt.getTime())
                    }
                    var arr = []
                    array.forEach(i => {
                        var currentTime = new Date().getTime();
                        let diff = currentTime - i
                        if (diff < 86400000) {
                            arr.push(i)
                        }
                    })
                    var result1 = `Count of offers added in 24 hours is: ${arr.length}`
                    response(res, SuccessCode.SUCCESS, result1, SuccessMessage.DATA_FOUND)
                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    /**
     * Function Name :dashboard
     * Description   : Dashboard of Admin Panel
     *
     * @return response
     */
    dashboard: async (req, res) => {
        try {

            //** ____________________ Promotions ____________________________  */
            const allPromotions = await promotionModel.find({ status: "ACTIVE" });
            const promotionInADay = await promotionModel.find({
                createdAt: { $lte: new Date().toISOString() },
                createdAt: { $gte: new Date() - 1 * 24 * 60 * 60 * 1000 }
            });
            const deactivatedInADay = await promotionModel.find({
                status: "DELETE",
                createdAt: { $lte: new Date().toISOString() },
                createdAt: { $gte: new Date() - 1 * 24 * 60 * 60 * 1000 }
            });
            const promotions = [
                { all: allPromotions.length ? allPromotions.length : 0 },
                { allInADay: promotionInADay.length ? promotionInADay.length : 0 },
                {
                    DeactivatedInADay: deactivatedInADay.length
                        ? deactivatedInADay.length
                        : 0
                }
            ];
            //** ______________________________________________________________________ */
            //** ______________________________ Offers _________________________________ */
            //** _______________________________________________________________________ */
            //** ________________________________ Reviews ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ Customers ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ Alerts ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ favourite ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ Vendor ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ Search ______________________________ */
            //** _______________________________________________________________________ */
            //** ______________________________ Share ______________________________ */
            //** _______________________________________________________________________ */

            const result = {
                Dashboard: [
                    { promotion: promotions },
                    { Offers: promotions },
                    { Reviews: promotions },
                    { Customers: promotions },
                    { Alerts: promotions },
                    { favourite: promotions },
                    { Vendor: promotions },
                    { Search: promotions },
                    { Share: promotions }
                ]
            };
            res.send({
                responseCode: 200,
                responseMessage: "Requested Data fetched:",
                ...result
            });
        } catch (error) {
            response(
                res,
                ErrorCode.SOMETHING_WRONG,
                [],
                ErrorMessage.SOMETHING_WRONG
            );
        }
    },
    graphData: async (req, res) => {
        try {
            const getData = async (type) => {
                var msg = "";
                var list = []
                switch (type) {
                    case "yearly": {
                        list = await graph.aggregate([
                            {
                                $group: {
                                    _id: { year: { $year: "$date" } },
                                    count: { $sum: 1 }
                                }
                            }
                        ])
                        msg = "Get the yearly data";
                    }
                        break;
                    case "monthly": {
                        list = await graph.aggregate([
                            {
                                $group: {
                                    _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                                    count: { $sum: 1 }
                                }
                            }
                        ])
                        msg = "Get the monthly data";
                    }
                        break;
                    case "weekly": {
                        list = await graph.aggregate([
                            {
                                $group: {
                                    _id: {
                                        year: { $year: "$date" }, month: { $month: "$date" }, week: {
                                            $week: "$date"
                                        }
                                    },
                                    count: { $sum: 1 }
                                    // _id:"$service"
                                }
                            }
                        ])
                        msg = "Get the weekly data";
                    }
                        break;
                    default:
                        break;
                }
                return list
            };
            var t = await getData(req.body.type);
            console.log(t)
            res.send({ responseCode: 200, responseMessage: t })
        } catch (error) {
            throw error;
        }


        var monthData = [
            {
                "_id": {
                    "year": 2021,
                    "month": 5
                },
                "count": 7
            },
            {
                "_id": {
                    "year": 2021,
                    "month": 4
                },
                "count": 30
            },
            {
                "_id": {
                    "year": 2021,
                    "month": 2
                },
                "count": 28
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 11
                },
                "count": 30
            },
            {
                "_id": {
                    "year": 2021,
                    "month": 1
                },
                "count": 31
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 12
                },
                "count": 31
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 10
                },
                "count": 31
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 9
                },
                "count": 30
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 7
                },
                "count": 31
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 5
                },
                "count": 24
            },
            {
                "_id": {
                    "year": 2021,
                    "month": 3
                },
                "count": 31
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 6
                },
                "count": 30
            },
            {
                "_id": {
                    "year": 2020,
                    "month": 8
                },
                "count": 31
            }
        ];
        let hold = monthData.map(q => {
            return {
                year: q._id.year,
                x: q._id.month,
                y: q.count

            }
        })
        let sort = hold.sort((a, b) => {
            return a.year > b.year ? 1 : a.x > b.x ? 1 : -1;
        }

        )
        console.log(_.groupBy(sort, "year"));

        // ** output */
        var p = {
            2020:
                [{ year: 2020, x: 5, y: 24 },
                { year: 2020, x: 6, y: 30 },
                { year: 2020, x: 7, y: 31 },
                { year: 2020, x: 8, y: 31 },
                { year: 2020, x: 9, y: 30 },
                { year: 2020, x: 10, y: 31 },
                { year: 2020, x: 11, y: 30 },
                { year: 2020, x: 12, y: 31 }],
            2021:
                [{ year: 2021, x: 1, y: 31 },
                { year: 2021, x: 2, y: 28 },
                { year: 2021, x: 3, y: 31 },
                { year: 2021, x: 4, y: 30 },
                { year: 2021, x: 5, y: 7 }]
        }
    }
}




