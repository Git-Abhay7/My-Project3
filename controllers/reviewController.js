const reviewModel = require('../models/reviewModel');
const commonFunction = require('../helper/commonFunction');
const userModel = require('../models/userModel');
const offerModel = require('../models/offerModel')
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {

    /**
      * Function Name :viewReview
      * Description   : viewReview in review  management
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
     * Description   : deactivateReview in review management
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
     * Description   : reviewList in review management
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
                console.log("reviewLIst",err,result)
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
     * Description   : editReview in review management
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
     * Description   : respondReview in review management
     *
     * @return response
    */

    respondReview: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId }, (err, result) => {
                console.log("responseReview",err, result)
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
     * Function Name :myReviews
     * Description   : myReviews in review management
     *
     * @return response
    */

    myReviews: (req, res) => {
        try {
            reviewModel.find({ userId: req.userId, status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result.length == 0) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, [], ErrorMessage.DATA_FOUND);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    uploadReview: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, result) => {
           
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                offerModel.findOne({ _id: req.body.offerId, status: "ACTIVE" }, (error, result1) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        if (req.body.image && req.body.comments) {
                            commonFunction.uploadImage(req.body.image, (error, iresult) => {
                                if (error) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                }
                                else {
                                    req.body.image = iresult.secure_url;
                                    // req.body.comments = comments;
                                     reviewModel(req.body).save((error, saved) => {
                                        if (error) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR)
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, saved, SuccessMessage.REVIEW_ADDED);
                                        }

                                    })
                                }
                            })
                        }
                        else if (req.body.video && req.body.comments) {
                            commonFunction.videoUpload(req.body.video, (error, vresult) => {
                                console.log("videoReview",error,vresult)
                                if (error) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    req.body.video = vresult.secure_url;

                                     reviewModel(req.body).save((error, saved2) => {
                                        if (error) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, saved2, SuccessMessage.REVIEW_ADDED);
                                        }
                                    })
                                }

                            })
                        }
                        else {
                            req.body.comments = comments;
                             reviewModel(req.body).save((error, saved3) => {
                                if (error) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saved3, SuccessMessage.REVIEW_ADDED);
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}