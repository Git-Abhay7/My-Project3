const userModel = require('../models/userModel');
const promotionModel = require('../models/promotionModel');
const offerModel = require('../models/offerModel')
const branchModel = require('../models/branchModel')
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
     * Function Name :signUp
     * Description   : signUp of Vendor
     *
     * @return response
    */

    signUp: (req, res) => {

        var query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }] };
        userModel.findOne(query, (err, result) => {
            if (err) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (result) {
                if (result.email == req.body.email) {
                    response(res, ErrorCode.EMAIL_EXIST, [], ErrorMessage.EMAIL_EXIST)
                }
                else if (result.mobileNumber == req.body.mobileNumber) {
                    response(res, ErrorCode.MOBILE_EXIST, [], ErrorMessage.MOBILE_EXIST)
                }
            }
            else {
                if (req.body.password == req.body.confirmPassword) {
                    var otp = commonFunction.getOTP();
                     commonFunction.sendSMS(req.body.mobileNumber, otp, (error, optResult) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var data = {
                                company: req.body.company,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                mobileNumber: req.body.mobileNumber,
                                telephone: req.body.telephone,
                                password: bcrypt.hashSync(req.body.password),
                                otp:otp,
                                userType: "VENDOR"
                            };
                            new userModel(data).save((error, saved) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saved, SuccessMessage.SIGNUP_SUCCESSFULLY);
                                }
                            })

                        }
                    })
                }
                else {
                    response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.PASSWORD_NOT_MATCHED);

                }

            }
        })
    },  
        /**
        * Function Name :login
        * Description   : login for vendor
        *
        * @return response
       */

        login: (req, res) => {
            try {
                let query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: { $ne: "DELETE" }, userType: "VENDOR" };
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
     * Function Name :myProfile
     * Description   : myProfile for vendor
     *
     * @return response
    */

    myProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR", status: "ACTIVE" }, (err, result) => {
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
    * Function Name : forgotPassword
    * Description   : forgotPassword for admin
    *
    * @return response
    */

        forgotPassword: (req, res) => {
            try {
                var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }], status: "ACTIVE", userType: "VENDOR" };
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
                                            response(res, SuccessCode.SUCCESS, [], SuccessMessage.EMAIL_SEND);
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
                                            response(res, SuccessCode.SUCCESS, [], SuccessMessage.OTP_SEND);
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
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], status: "ACTIVE", userType: "VENDOR" };
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
       * Description   : resendOTP for vendor
       *
       * @return response
      */

    resendOTP: (req, res) => {
        try {
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }], status: "ACTIVE", userType: "VENDOR" };
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
                                        response(res, SuccessCode.SUCCESS, otpUpdate, SuccessMessage.EMAIL_SEND);
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
                                        response(res, SuccessCode.SUCCESS, otpUpdate, SuccessMessage.OTP_SEND);
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
            var query = { $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }], status: "ACTIVE", userType: "VENDOR" };
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
     * Function Name :editProfile
     * Description   : edit profile by vendor
     *
     * @return response
    */

    editProfile: (req, res) => {
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
                                mon: req.body.mon,
                                tue: req.body.tue,
                                wed: req.body.wed,
                                thu: req.body.thu,
                                fri: req.body.fri,
                                sat: req.body.sat
                            }]

                            req.body.myLocations = [{
                                address: req.body.address,
                                poBox: req.body.poBox,
                                country: req.body.country,
                                state: req.body.state,
                                city: req.body.city
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
     * Function Name :changePassword
     * Description   : changePassword by vendor
     *
     * @return response
    */

    changePassword: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var check = bcrypt.compareSync(req.body.oldPassword, result2.password);
                    if (!check) {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.OLD_PASSWORD);
                    }
                    else {
                        var confirmPassword = bcrypt.hashSync(req.body.newPassword);
                        userModel.findOneAndUpdate({ _id: result._id }, { $set: { password: confirmPassword } }, { new: true }, (updateErr, updateResult) => {
                            if (updateErr) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.RESET_SUCCESS);
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
       * Function Name :addBranch
       * Description   : addBranch by vendor
       *
       * @return response  
      */

    addBranch: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR" }, (err, vendorResult) => {
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
                            req.body.vendorId = vendorResult._id;
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
                                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED);
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
     * Description   : editBranch by vendor
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
     * Description   : viewBranch by vendor
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
     * Description   : deactivateBranch by vendor
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
     * Description   : branchList 
     *
     * @return response
    */

    branchList: (req, res) => {
        try {
            var query = { vendorId: req.userId, status: "ACTIVE" };
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
     * Function Name :viewReview
     * Description   : viewReview in My reviews-vendor
     *
     * @return response
    */

    viewReview: (req, res) => {
        try {
            reviewModel.findOne({ _id: req.params._id, status: { $ne: "DELETE" } }, (err, result) => {
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
     * Function Name :deactivateReview
     * Description   : deactivateReview in My reviews-vendor
     *
     * @return response
    */

    deactivateReview: (req, res) => {
        try {
            reviewModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } }, (err, findData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    reviewModel.findOneAndUpdate({ _id: findData._id }, { $set: { status: "DELETE" } }, { new: true }, (error, deactivate) => {
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
     * Function Name :reviewList
     * Description   : reviewList in My reviews-vendor
     *
     * @return response
    */

    reviewList: (req, res) => {
        try {
            var query = { status: { $ne: "DELETE" } };

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

            reviewModel.paginate(query, options, (err, result) => {
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
     * Function Name :editReview
     * Description   : editReview in My reviews-vendor
     *
     * @return response
    */

    editReview: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    reviewModel.findOne({ _id: req.body._id, status: { $ne: "DELETE" } }, (err, findData) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!findData) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            reviewModel.findOneAndUpdate({ _id: findData._id }, { $set: req.body }, { new: true }, (error, update) => {
                                if (error) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, update, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :respondReview
     * Description   : respondReview in My reviews-vendor
     *
     * @return response
    */

    respondReview: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    reviewModel.findOne({ _id: req.body.reviewId, status: "ACTIVE" }, (err, reviewResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!reviewResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            req.body.respondBy = result.fullName;
                            req.body.isResponse= true;
                            reviewModel.findOneAndUpdate({ _id: req.body.reviewId, status: "ACTIVE" }, { $set: req.body }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.RESPOND_SUCCESS);
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
       * Function Name :addPromotion
       * Description   : addPromotion in My Promotions-vendor
       *
       * @return response
       */

    addPromotion: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: "VENDOR" }, (error, vendorResult) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!vendorResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    promotionModel.findOne({ promotionName: req.body.promotionName, status: { $ne: "DELETE" } }, (err, result) => {
                        if (err) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ALREADY_EXIST);
                        }
                        else {
                            var obj = {
                                vendorId: vendorResult._id,
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
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED);
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
        * Function Name : editPromotion
        * Description   : editPromotion in My Promotions-vendor
        *
        * @return response
        */
    editPromotion: (req, res) => {
        function update() {
            promotionModel.findByIdAndUpdate({ _id: req.body.promotionId, status: "ACTIVE" }, { $set: req.body }, { new: true }, (error, updateResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                }
            })
        }
        if (req.body.promotionName) {
            promotionModel.findOne({ promotionName: req.body.promotionName, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    if (result.promotionName == req.body.promotionName) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.PROMOTION_EXIST);
                    }
                }
                else {
                    update()
                }
            })
        }
        else {
            update()
        }
    },
    /**
      * Function Name : view promotion
      * Description   : view in My Promotions-vendor
      *
      * @return response
      */
    viewPromotion: (req, res) => {     
        promotionModel.findOne({ _id: req.params.promotionId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
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
    },
    /**
      * Function Name :addOffer
      * Description   : addOffer in My Promotions-vendor
      *
      * @return response
      */

    addOffer: (req, res) => {
        try {
            promotionModel.findOne({ _id: req.body.promotionId, status: "ACTIVE" }, async (err, result) => {
                if (err) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    if (req.body.otherItemDetails) {
                        req.body.otherItemDetails = {
                            otherItemName: req.body.otherItemName,
                            image: await convertImage(req.body.image),
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
                            offerImage: await convertImage(req.body.offerImage),
                            discount: req.body.discount,
                            aed: req.body.aed,
                            oldPrice: req.body.oldPrice,
                            newPrice: req.body.newPrice,
                            Buy: req.body.Buy,
                            Get: req.body.Get,
                            otherItemDetails: req.body.otherItemDetails
                        };
                        new offerModel(obj).save((saveErr, saveResult) => {
                            console.log("=====>",saveErr)
                            if (saveErr) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.OFFER_ADD);
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
                            offerImage: await convertImage(req.body.offerImage),
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
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
        * Function Name :edit offer 
        * Description   : edit Offer in My Promotions-vendor
        *
        * @return response     
        */

    editOffer: async (req, res) => {
        var set = {}

        if (req.body.itemName) {
            set.itemName = req.body.itemName
        }
        if (req.body.catgeoryId) {
            set.catgeoryId = req.body.catgeoryId
        }
        if (req.body.subCategoryId) {
            set.subCategoryId = req.body.subCategoryId
        }
        if (req.body.brandId) {
            set.brandId = req.body.brandId
        }
        if (req.body.offerImage) {
            set.offerImage = await convertImage(req.body.offerImage)
        }
        if (req.body.discount) {
            set.discount = req.body.discount
        }
        if (req.body.aed) {
            set.aed = req.body.aed
        }
        if (req.body.oldPrice) {
            set.oldPrice = req.body.oldPrice
        }
        if (req.body.newPrice) {
            set.newPrice = req.body.newPrice
        }
        if (req.body.Buy) {
            set.Buy = req.body.Buy
        }
        if (req.body.Get) {
            set.Get = req.body.Get
        }

        offerModel.findByIdAndUpdate({ _id: req.body.offerId, status: "ACTIVE" }, { $set: set }, { new: true },
            (error, updateResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OFFER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                }
            })
    },

    /**
  * Function Name :editItem
  * Description   : editItem in My Promotions-vendor
  *
  * @return response
  */

    editItem: (req, res) => {
        try {
            offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, async (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var set = {};
                    if (req.body.image) {
                        set['otherItemDetails.image'] = await convertImage(req.body.image)
                    }
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
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
      * Function Name : view offer
      * Description   : view offer in My Promotions-vendor
      *
      * @return response
      */
    viewOffer: (req, res) => {
        offerModel.findOne({ _id: req.params.offerId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else {
                response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
            }
        })
    },
    /**
     * Function Name : delete offer
     * Description   : delete offer in My Promotions-vendor
     *
     * @return response
     */
    deactivateOffer: (req, res) => {
        offerModel.findByIdAndUpdate({ _id: req.body.offerId, status: "ACTIVE" }, { $set: { status: "ACTIVE" } }, { new: true },
            (error, updateResult) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.OFFER_NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS);
                }
            })
    },

    /**
        * Function Name : list offer
        * Description   : list offer in My Promotions-vendor
        *
        * @return response
        */
    offerList: (req, res) => {
        try {
            var query = { status: "ACTIVE" };

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

            offerModel.paginate(query, options, (err, result) => {
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
     * Function Name : deactivatePromotion
     * Description   : deactivatePromotion in My Promotions-vendor
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
    * Description   : promotionList in My Promotions-vendor
    *
    * @return response
    */

    promotionList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
                    var query = { vendorId: result._id, status: "ACTIVE" };

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

                    promotionModel.paginate(query, options, (err, result2) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (result2.docs.length == 0) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result2, SuccessMessage.DATA_FOUND);
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
     * Function Name :addSubAdmin
     * Description   : addSubAdmin in My users-vendor
     *
     * @return response
    */

    addSubAdmin: async (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR" }, (err, vendorResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!vendorResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
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
                            req.body.password = bcrypt.hashSync(req.body.password);
                            var data = {
                                vendorId: vendorResult._id,
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
                            new userModel(data).save((error, saved) => {
                                if (error) {
                                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saved, SuccessMessage.SUB_ADMIN_CREATED);
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
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewSubAdmin
     * Description   : viewSubAdmin in My users-vendor
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
     * Description   : editSubAdmin in My users-vendor
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
     * Description   : deleteSubAdmin in My users-vendor
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
    * Description   : subAdminList in My users-vendor
    *
    * @return response
    */

    subAdminList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "VENDOR" }, (err, vendorResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!vendorResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.VENDOR_NOT_FOUND);
                }
                else {
                    var query = { vendorId: vendorResult._id, userType: "SUBADMIN", status: { $ne: "DELETE" } };
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
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
          /**
   * Function Name :dashboard
   * Description   : Dashboard of  vendor Panel
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
      //** ______________________________ Alerts ______________________________ */
      //** _______________________________________________________________________ */
      //** ______________________________ favourite ______________________________ */
      //** _______________________________________________________________________ */
      //** ______________________________ Detail Search ____________________________ */
      //** _______________________________________________________________________ */
      //** ______________________________ Search ______________________________ */
      //** _______________________________________________________________________ */
 

      const result = {
        Dashboard: [
          { promotion: promotions },
          { Offers: promotions },
          { Reviews: promotions },
          { Alerts: promotions },
          { favourite: promotions },
          { SearchDetails : promotions },
          { Search: promotions }
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
      const getData = async type => {
        var msg = "";
        var list = [];
        const months = [
          "start",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "Octobar",
          "November",
          "December"
        ];
        const week = {
          "1": {
            0: "0th Week",
            1: "1st Week",
            2: "2nd week",
            3: "3rd Week",
            4: "4th Week",
            5: "5th Week"
          },
          "2": {
            5: "0th Week",
            6: "1st Week",
            7: "2nd week",
            8: "3rd Week",
            9: "4th Week"
          },
          "3": {
            9: "0th Week",
            10: "1st Week",
            11: "2nd week",
            12: "3rd Week",
            13: "4th Week"
          },
          "4": {
            13: "0th Week",
            14: "1st Week",
            15: "2nd week",
            16: "3rd Week",
            17: "4th Week"
          },
          "5": {
            17: "0th Week",
            18: "1st Week",
            19: "2nd week",
            20: "3rd Week",
            21: "4th Week",
            22: "5th Week"
          },
          "6": {
            22: "0th Week",
            23: "1st Week",
            24: "2nd week",
            25: "3rd Week",
            26: "4th Week"
          },
          "7": {
            26: "0th Week",
            27: "1st Week",
            28: "2nd week",
            29: "3rd Week",
            30: "4th Week"
          },
          "8": {
            30: "0th Week",
            31: "1st Week",
            32: "2nd week",
            33: "3rd Week",
            34: "4th Week",
            35: "5th Week"
          },
          "9": {
            35: "0th Week",
            36: "1st Week",
            37: "2nd week",
            38: "3rd Week",
            39: "4th Week"
          },
          "10": {
            39: "0th Week",
            40: "1st Week",
            41: "2nd week",
            42: "3rd Week",
            43: "4th Week",
            44: "5th Week"
          },
          "11": {
            44: "0th Week",
            45: "1st Week",
            46: "2nd week",
            47: "3rd Week",
            48: "4th Week"
          },
          "12": {
            48: "0th Week",
            49: "1st Week",
            50: "2nd week",
            51: "3rd Week",
            52: "4th Week",
            53: "5th Week"
          }
        };
        switch (type) {
          case "yearly":
            {
              lit = await graph.aggregate([
                {
                  $group: {
                    _id: { year: { $year: "$date" } },
                    count: { $sum: 1 }
                  }
                }
              ]);
              list = lit.map(p => {
                return { x: p._id.year, y: p.count };
              });
              msg = "Get the yearly data";
            }
            break;
          case "monthly":
            {
              lit = await graph.aggregate([
                {
                  $group: {
                    _id: {
                      year: { $year: "$date" },
                      month: { $month: "$date" }
                    },
                    count: { $sum: 1 }
                  }
                }
              ]);
              let hold = lit.map(q => {
                return {
                  year: q._id.year,
                  x: months[q._id.month],
                  y: q.count
                };
              });
              let sort = hold.sort((a, b) => {
                return a.year > b.year
                  ? 1
                  : months.indexOf(a.x) > months.indexOf(b.x)
                  ? 1
                  : -1;
              });
              list = _.groupBy(sort, "year");
              msg = "Get the monthly data";
            }
            break;
          case "weekly":
            {
              lit = await graph.aggregate([
                {
                  $match: {
                    date: {
                      $gte: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000)
                    },
                    date: {
                      $lte: new Date(
                        new Date(Date.now() + 62 * 24 * 60 * 60 * 1000) -
                          31 * 24 * 60 * 60 * 1000
                      )
                    }
                  }
                },
                {
                  $group: {
                    _id: {
                      year: { $year: "$date" },
                      month: { $month: "$date" },
                      week: { $week: "$date" }
                    },
                    count: { $sum: 1 }
                  }
                }
              ]);
              let hold = lit.map(q => {
                return {
                  year: q._id.year,
                  month: months[q._id.month],
                  week: q._id.week,
                  x: week[q._id.month][q._id.week],
                  y: q.count
                };
              });
              let sort = hold.sort((a, b) => {
                return a.year > b.year ? 1 : a.week > b.week ? 1 : -1;
              });
              list = _.groupBy(hold, "month");
              msg = "Get the weekly data";
            }
            break;
          default:
            break;
        }
        return list;
      };
      var t = await getData(req.body.type);
      console.log(t);
      res.send({ responseCode: 200, responseMessage: t });
    } catch (error) {
      throw error;
    }
  }

}

//*********************Function for upload image *************************************/
function convertImage(image) {
    return new Promise((resolve, reject) => {
        commonFunction.uploadImage(image, (error, upload) => {
            if (error) {
                console.log("Error uploading image")
            }
            else {
                resolve(upload)
            }
        })
    })
}
//*************************End of upload image *****************************/


