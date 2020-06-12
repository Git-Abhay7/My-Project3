const userModel = require('../models/userModel');
const branchModel = require('../models/branchModel')
const offerModel = require('../models/offerModel')
const contentModel = require('../models/contentModel')
const contactModel = require('../models/contactModel')
const volunteerModel = require('../models/volunteerModel')
const promotionModel = require('../models/promotionModel')

const featureModel = require('../models/featureModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

const jwt = require('jsonwebtoken');

module.exports = {

    /**
        * Function Name :signUp
        * Description   : signUp of user 
        *
        * @return response
       */
    signUp: (req, res) => {
        try {
            userModel.findOne({ mobileNumber: req.body.mobileNumber, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.MOBILE_EXIST);
                }
                else {
                    var otp = commonFunction.getOTP();
                    commonFunction.sendSMS(req.body.mobileNumber, otp, (error, otpSent) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var obj = {
                                mobileNumber: req.body.mobileNumber,
                                language: req.body.language,
                                otp: otp
                            };
                            new userModel(obj).save((saveErr, saveResult) => {
                                if (saveErr) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    var token = jwt.sign({ id: saveResult._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'ynotOffers');
                                    var result = {
                                        _id: saveResult._id,
                                        mobileNumber: saveResult.mobileNumber,
                                        otp: saveResult.otp,
                                        token: token
                                    };
                                    response(res, SuccessCode.OTP_SEND, result, SuccessMessage.OTP_SEND);
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
        * Function Name :otp verify
        * Description   : otp verify for user 
        *
        * @return response
       */
    otpVerify: (req, res) => {
        userModel.findOne({ _id: req.userId, userType: "USER" }, (error, userGet) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userGet) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var currentTime = Date.now()
                var otpSentTime = userGet.otpTime
                var difference = currentTime - otpSentTime
                if (difference > 500000) {
                    response(res, ErrorCode.OTP_EXPIRED, [], ErrorMessage.OTP_EXPIRED);
                }
                else {
                    if (req.body.otp == userGet.otp) {
                        response(res, SuccessCode.SUCCESS, userGet, SuccessMessage.SIGNUP_SUCCESSFULLY);
                    }
                    else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_OTP);
                    }
                }
            }
        })
    },

    /**
        * Function Name : resend otp
        * Description   : resend otp for user 
        *
        * @return response
       */
    resendOTP: (req, res) => {
        userModel.findOne({ _id: req.userId, userType: "USER" }, (error, userGet) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!userGet) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var newOtp = commonFunction.getOTP()
                commonFunction.sendSMS(userGet.mobileNumber, newOtp, (error, otpSent) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        userModel.findByIdAndUpdate({ _id: userGet._id, userType: "USER" }, { $set: { otp: newOtp, otpTime: Date.now() } },
                            { new: true }, (error, reSentOpt) => {
                                if (error) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!reSentOpt) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    response(res, SuccessCode.OTP_SEND, reSentOpt, SuccessMessage.OTP_SEND);
                                }
                            })
                    }
                })
            }
        })
    },
    /**
      * Function Name : get Profile
      * Description   : get Profile of user
      *
      * @return response
     */

    getProfile: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "USER", status: "ACTIVE" }, (err, result) => {
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
       * Function Name : edit Profile
       * Description   : edit Profile of user
       *
       * @return response
      */

    editProfile: (req, res) => {
        userModel.findOne({ _id: req.userId }, (error, result) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var obj = {}
                if (req.body.language) {
                    obj.language = req.body.language
                }
                if (req.body.mobileNumber) {
                    obj.mobileNumber = req.body.mobileNumber
                }
                userModel.findByIdAndUpdate({ _id: result._id }, { $set: obj }, { new: true }, (error, updateProfile) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, updateProfile, SuccessMessage.UPDATE_SUCCESS);

                    }
                })
            }
        })

    },
    /**
     * Function Name :addCardHolder
     * Description   : addCardHolder for user 
     *
     * @return response
    */

    addCardHolder: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "USER" }, async (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    req.body.cardsHolder = [{
                        frontSide: await convertImage(req.body.frontSide),
                        backSide: await convertImage(req.body.backSide)
                    }];

                    userModel.findOneAndUpdate({ _id: result._id }, { $push: req.body }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var data = {
                                _id: result._id,
                                cardsHolder: updateResult.cardsHolder
                            };
                            response(res, SuccessCode.SUCCESS, data, SuccessMessage.CARD_ADD);
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
     * Function Name :viewCardHolder
     * Description   : viewCardHolder for user 
     *
     * @return response
    */

    viewCardHolder: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, "cardsHolder._id": req.params.cardId }).select({ 'cardsHolder.$._id': 1 }).exec((err, result) => {
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
     * Function Name :deleteCardHolder
     * Description   : deleteCardHolder for user 
     *
     * @return response
    */

    deleteCardHolder: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, "cardsHolder._id": req.body.cardId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ "cardsHolder._id": req.body.cardId }, { $pull: { "cardsHolder": { _id: req.body.cardId } } }, { new: true }, (err, updateResult) => {
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
     * Function Name :cardList
     * Description   : cardList for user 
     *
     * @return response
    */

    cardList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var cardList = {
                        _id: result._id,
                        cardsHolder: result.cardsHolder
                    };
                    response(res, SuccessCode.SUCCESS, cardList, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addAlert
     * Description   : addAlert for user 
     *
     * @return response
    */

    addAlert: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "USER" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    req.body.myAlerts = [{
                        alert: req.body.alert
                    }];

                    userModel.findOneAndUpdate({ _id: result._id }, { $push: req.body }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.ALERT_ADD);
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
     * Function Name :deleteAlert
     * Description   : deleteAlert for user 
     *
     * @return response
    */

    deleteAlert: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, "myAlerts._id": req.body.alertId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ "myAlerts._id": req.body.alertId }, { $pull: { "myAlerts": { _id: req.body.alertId } } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [], SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :alertList
     * Description   : alertList for user 
     *
     * @return response
    */

    alertList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var alertList = {
                        _id: result._id,
                        myAlerts: result.myAlerts
                    };
                    response(res, SuccessCode.SUCCESS, alertList, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :similarShops
     * Description   : similarShops in app
     *
     * @return response
    */

    similarShops: (req, res) => {
        try {
            branchModel.find({ businessCategory: req.params.businessCategory, status: { $ne: "DELETE" } }, (findError, findResult) => {
                if (findError) {
                    console.log(findError)
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, findResult, SuccessMessage.SUCCESS)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },

    /**
     * Function Name :offerBooks
     * Description   : offerBooks in app
     *
     * @return response
    */

    offerBooks: (req, res) => {
        try {
            query = { status: { $ne: "DELETE" }, $select: offerImage }

            offerModel.find(query, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },

    /**
     * Function Name :addSmartList
     * Description   : addSmartList of user
     *
     * @return response
    */

    addSmartList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, error, ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    var array = []
                    req.body.smartList.forEach(element => {
                        array.push({ "items": element })
                    })

                    userModel.findOneAndUpdate({ _id: result._id }, { $addToSet: { smartList: array } }, { new: true }, (updateError, updateResult) => {
                        if (updateError) {
                            response(res, ErrorCode.INTERNAL_ERROR, error1, ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.DATA_SAVED)
                        }
                    })

                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    },

    /**
     * Function Name :deleteSmartList
     * Description   : deleteSmartList of user
     *
     * @return response
    */

    deleteSmartList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" } }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOneAndUpdate({ _id: result._id }, { $pull: { smartList: { _id: req.body.smartId } } }, { new: true }, (updateError, updateResult) => {
                        if (updateError) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {

                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS)
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    /**
     * Function Name :addInterest
     * Description   : addInterest of user
     *
     * @return response
    */

    addInterest: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {


                    array = []
                    console.log(req.body.interest)
                    req.body.interest.forEach(element => {
                        array.push({ "interest": element })
                    })


                    userModel.findOneAndUpdate({ _id: result._id }, { $push: { myInterests: array } }, { new: true }, (error, result) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.INTEREST_ADD)
                        }
                    })


                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    /**
     * Function Name :deleteInterest
     * Description   : deleteInterest of user
     *
     * @return response
    */

    deleteInterest: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOneAndUpdate({ _id: result._id }, { $pull: { myInterests: { _id: req.body._id } } }, { new: true }, (updateError, updateResult) => {
                        if (updateError) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS)
                        }
                    })


                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },
    editSmartList:(req,res)=>{
        try{
            userModel.findOne({_id:req.userId,status:{$ne:"DELETE"}},(findError,findResult)=>{
                if(findError){
                    response(res,ErrorCode.INTERNAL_ERROR,[],ErrorMessage.INTERNAL_ERROR)
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else{

                  
                  object={}
            
                  object[`smartList.$.items`]=req.body.favouriteList
                    console.log(object)
               
              
                    userModel.findOneAndUpdate({_id:findResult._id,"smartList._id":req.body._id},{$set:object},{new:true},(updateError,updateResult)=>{
                        if(findError){
                            response(res,ErrorCode.INTERNAL_ERROR,[],ErrorMessage.INTERNAL_ERROR)
                        }
                        else{
                            response(res,SuccessCode.SUCCESS,updateResult,SuccessMessage.UPDATE_SUCCESS)
                        }
                    })
                }
            })
        }
        catch(error){
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    
    },

    /**
     * Function Name :interestList
     * Description   : interestList of user
     *
     * @return response
    */

    interestList: (req, res) => {
        try {
            userModel.findOne({ _id: req.body.interestId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    array = []
                    result.myInterests.forEach(element => {
                        array.push(element.interest)
                    })
                    response(res, SuccessCode.SUCCESS, array, SuccessMessage.SUCCESS)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }

    },

    /**
     * Function Name :addLocation
     * Description   : addLocation for user 
     *
     * @return response
    */

    addLocation: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    myLocation = []
                    myLocation.push({ name: req.body.name, coordinates: [req.body.lat, req.body.long] })


                    userModel.findOneAndUpdate({ _id: result._id }, { $set: { myLocations: myLocation } }, { new: true }, (error, updateResult) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.LOCATION_ADD)
                        }
                    })


                }
            })

        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },

    /**
     * Function Name :addSocialLink
     * Description   : addSocialLink of user 
     *
     * @return response
    */

    addSocialLink: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {

                    array = []
                    array.push({ url: req.body.url, Type: req.body.Type })

                    userModel.findOneAndUpdate({ _id: result._id }, { $push: { mySocialAccounts: array } }, { new: true }, (updateError, updateResult) => {
                        if (updateError) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.SOCIAL_LINK_ADD)
                        }
                    })
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)

        }
    },

    /**
     * Function Name :deleteSocialLink
     * Description   : deleteSocialLink of user 
     *
     * @return response
    */

    deleteSocialLink: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    userModel.findOneAndUpdate({ _id: req.userId }, { $pull: { mySocialAccounts: { _id: req.body._id } } }, { new: true }, (updateError, updateResult) => {
                        if (updateError) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS)
                        }
                    })

                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }
    }, 
    
    /**
     * Function Name :socialLinkList
     * Description   : socialLinkList of user 
     *
     * @return response
    */

    socialLinkList: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: { $ne: "DELETE" }, userType: "USER" }, (findError, findResult) => {
                if (findError) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
                }
                else {
                    array = []
                    findResult.mySocialAccounts.forEach(element => {
                        array.push(element)

                    })
                    response(res, SuccessCode.SUCCESS, array, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
        }

    },


    /**
     * Function Name :getShopList
     * Description   : getShopList for user 
     *
     * @return response
    */

    getShopList: (req, res) => {
        var aggregate = branchModel.aggregate([{
            $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)] },
                distanceField: "dist.calculated",
                maxDistance: 1000 * 10,//(1000*kms)
                spherical: true
            }
        }])
        var options = {
            page: 1,
            limit: 2,
            sort: { createdAt: -1 }
        }

        branchModel.aggregatePaginate(aggregate, options, (err, result, pageCount, count) => {
            if (err) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (result.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else {
                res.send({ responseCode: 200, responseMessage: "Location found successfully", result, pageCount, count });
            }
        })
    },

    /**
     * Function Name :viewShop
     * Description   : viewShop for user 
     *
     * @return response
    */

    viewShop: (req, res) => {
        try {
            branchModel.findOne({ _id: req.params._id, status: "ACTIVE" }, (err, result) => {
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
     * Function Name :notificationList
     * Description   : notificationList for user 
     *
     * @return response
    */

    notificationList: (req, res) => {
        try {
            notificationModel.find({ userId: req.userId }, (err, result) => {
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
    * Function Name : count users
    * Description   :  count users total website
    *
    * @return response
   */

    userCount: (req, res) => {

        var query = { $and: [{ status: "ACTIVE" }, { userType: { $in: ["USER", "VENDOR"] } }] }

        userModel.count(query, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })

    },

    /**
   * Function Name : count team_members
   * Description   :  count total team member
   *
   * @return response
  */

    numberOfTeamMember: (req, res) => {
        volunteerModel.count({ status: "ACTIVE" }, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }

            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })

    },

    /**
   * Function Name :  offer count
   * Description   :  offer count website
   *
   * @return response
  */

    offerCount: (req, res) => {

        offerModel.count({ status: "ACTIVE" }, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }

            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })

    },

    /**
 * Function Name : count Review
 * Description   : countReview for website
 *
 * @return response
*/
    reviewCount: (req, res) => {

        reviewModel.count({ status: "ACTIVE" }, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }

            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })
    },

    /**
   * Function Name : count photos
   * Description   : countPhotos for website
   *
   * @return response
  */
    photoCount: (req, res) => {

        contentModel.count({ status: "ACTIVE", type: "Media Center Photos" }, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }

            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })

    },

    /**
    * Function Name : count videos
    * Description   : countVideos for website
    *
    * @return response
   */
    videoCount: (req, res) => {

        contentModel.count({ status: "ACTIVE", type: "Media Center Videos" }, (error, numberCount) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }

            else {
                response(res, SuccessCode.SUCCESS, numberCount, SuccessMessage.DETAIL_GET);
            }
        })

    },

    contactUs: (req, res) => {
        userModel.findOne({ _id: req.body.userId, status: "ACTIVE" }, (err, result) => {
            if (err) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (!result) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
            }
            else {
                var data = new contactModel({
                    userId: req.body.userId,
                    userName: req.body.userName,
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    message: req.body.message
                })
                data.save((saveErr, saveResult) => {
                    if (saveErr) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DATA_SAVED);
                    }
                })
            }
        })
    },




    /**
     * Function Name :addFeature
     * Description   : addFeature in website
     *
     * @return response
    */

    addFeature: (req, res) => {
        try {
            commonFunction.videoUpload(req.body.video, (error, videoUpload) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var obj = {
                        "featureName": req.body.featureName,
                        "video": videoUpload,
                        "description": req.body.description
                    }
                    new featureModel(obj).save((error, videoSave) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, videoSave, SuccessMessage.DATA_SAVED);
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
   * Function Name :viewFeature
   * Description   : viewFeature in website
   * 
   * @return response
  */

    viewFeature: (req, res) => {
        try {
            featureModel.findById({ _id: req.params.featureId, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND)
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
     * Function Name :deletefeature
     * Description   : deletefeature in website
     *
     * @return response
    */

    deletefeature: (req, res) => {
        try {
            featureModel.findByIdAndUpdate({ _id: req.body.featureId, status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateStatus) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }

                else {
                    response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
                }
            })

        }


        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }

    },

    /**
      * Function Name :featureList
      * Description   : featureList in website
      *
      * @return response
     */

    featureList: (req, res) => {
        try {
            featureModel.find({ status: "ACTIVE" }, (err, result) => {
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
      * Function Name :v
      * Description   : v in website
      *
      * @return response
     */

    volunteerSignup: (req, res) => {
        var query = { $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }] };
        volunteerModel.findOne(query, (error, result) => {
            if (error) {
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
                var array = []
                var count = 0
                req.body.volunteeredIn.forEach((element, index) => {
                    array.push(element)
                    count = count + 1
                })
                if (count == req.body.volunteeredIn.length) {
                    commonFunction.sendMail(req.body.email, `welcome Ynot as VOLUNTEER:-`, (error, mailResult) => {
                        console.log(error)
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            var obj = {
                                company: req.body.company,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                mobileNumber: req.body.mobileNumber,
                                city: req.body.city,
                                location: req.body.location,
                                volunteeredIn: req.body.volunteeredIn,
                                myStrengths: [{
                                    sales: req.body.sales,
                                    marketing: req.body.marketing,
                                    coding: req.body.coding,
                                    designing: req.body.designing,
                                    admin: req.body.admin,
                                    paperWork: req.body.paperWork,
                                    goodHandWork: req.body.goodHandWork,
                                    creativeMind: req.body.creativeMind,
                                    teamLeader: req.body.teamLeader,
                                    goodOrganizer: req.body.goodOrganizer,
                                    haveMelodiousVoice: req.body.haveMelodiousVoice,
                                    haveLoudVoice: req.body.haveLoudVoice
                                }],
                            }
                            new volunteerModel(obj).save((err, saveResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.SIGNUP_SUCCESSFULLY);
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    /**
         * Function Name : promotion List
         * Description   : promotion list in user Menagement
         *
         * @return response
        */

    promotionList: (req, res) => {
        try {
            var query = { status: { $ne: "DELETE" } };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
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
     * Function Name : offerList
     * Description   : offerList in app 
     *
     * @return response
    */

    offerList: (req, res) => {
        try {
            var query = { status: { $ne: "DELETE" } };

            if (req.body.search) {
                query.itemName = new RegExp('^' + req.body.search, "i");
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

    locationSearch: async (req, res) => {
        var aggregate = branchModel.aggregate([{
            $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)] },
                distanceField: "dist.calculated",
                maxDistance: 1000 * 10,//(1000*kms)
                spherical: true
            }
        }])
        var options = {
            page: 1,
            limit: 2,
            sort: { createdAt: -1 }
        }

        branchModel.aggregatePaginate(aggregate, options, async (err, result, pageCount, count) => {
            console.log("========", err)
            if (err) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else if (result.length == 0) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else {
                var newResult = await promotionActive()
                var arr = []
                var arr1 = []
                result.forEach((element) => {
                    newResult.forEach((element1) => {
                        console.log("============>", element1.branches)
                        if (element1.branches.includes(element._id)) {
                            arr.push(element1._id)
                        }
                    })  
                })
          
                var arrResult = arr
                arrResult.forEach(async (element3) => {
                    console.log(element3)
                    arr1.push(await offerActive(element3))
                  console.log("============>",arr1)                
                })  
                       
            }
           
        })

    },

    /**
     * Function Name : addToFavourite
     * Description   : addToFavourite in app 
     *
     * @return response
    */

    addToFavourite: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, userType: "USER" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                }
                else {
                    offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, (err, offerResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (!offerResult) {
                            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                        }
                        else {
                            req.body.myFavourites = [{
                                favourites: req.body.offerId
                            }];

                            userModel.findOneAndUpdate({ _id: result._id }, { $addToSet: req.body }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.FAVOURITE_ADD);
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
     * Function Name : deleteFavourite
     * Description   : deleteFavourite in app 
     *
     * @return response
    */

    deleteFavourite: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, "myFavourites._id": req.body.favouriteId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    userModel.findOneAndUpdate({ "myFavourites._id": req.body.favouriteId }, { $pull: { "myFavourites": { _id: req.body.favouriteId } } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, [], SuccessMessage.DELETE_SUCCESS);
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
     * Function Name : favouriteList
     * Description   : favouriteList in app 
     *
     * @return response
    */

    favouriteList: (req, res) => {       
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    var favouriteList = {
                        _id: result._id,
                        myFavourites: result.myFavourites
                    };
                    response(res, SuccessCode.SUCCESS, favouriteList, SuccessMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },
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


function promotionActive(id) {
    return new Promise((resolve, reject) => {
        promotionModel.find({ promotionId: id, status: "ACTIVE" }, (error, result) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(result)
            }
        })
    })
}

function offerActive() {
    return new Promise((resolve, reject) => {
        offerModel.findOne({ status: "ACTIVE" }, (error, result) => {
            if (error) {
                resolve(error)
            }
            else {
                resolve(result)
            }
        })
    })
}

