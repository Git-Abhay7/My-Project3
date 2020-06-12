const notificationModel = require('../models/notificationModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {

    /**
     * Function Name :addNotification
     * Description   : addNotification in notification management
     *
     * @return response
    */

    addNotification: (req, res) => {
        try {
            notificationModel.findOne({ title: req.body.title, status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.TITLE_EXIST);
                }
                else {
                    req.body.medium = {
                        isPushNotification: req.body.isPushNotification,
                        isOpportunityBar: req.body.isOpportunityBar,
                        isPopUpMessage: req.body.isPopUpMessage
                    };

                    new notificationModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.NOTIFICATION_ADD);
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
      * Function Name :viewNotification
      * Description   : viewNotification in notification  management
      *
      * @return response
     */

    viewNotification: (req, res) => {
        try {
            notificationModel.findOne({ _id: req.params.notificationId, status: { $ne: "DELETE" } }, (err, result) => {
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
     * Function Name :editNotification
     * Description   : editNotification in notification management
     *
     * @return response
    */

    editNotification: (req, res) => {
        try {
            notificationModel.findOne({ _id: req.body.notificationId, status: { $ne: "DELETE" } }, (err, findData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    notificationModel.findOneAndUpdate({ _id: findData._id }, { $set: req.body }, { new: true }, (error, update) => {
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
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateNotification
     * Description   : deactivateNotification in notification management
     *
     * @return response
    */

    deactivateNotification: (req, res) => {
        try {
            notificationModel.findOne({ _id: req.body.notificationId, status: { $ne: "DELETE" } }, (err, findData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    notificationModel.findOneAndUpdate({ _id: findData._id }, { $set: { status: "DELETE" } }, { new: true }, (error, deactivate) => {
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
     * Function Name :notificationList
     * Description   : notificationList in notification management
     *
     * @return response
    */

    notificationList: (req, res) => {
        try {
            var query = { status: { $ne: "DELETE" } };

            if (req.body.title) {
                query.title = new RegExp('^' + req.body.title, "i");
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

            notificationModel.paginate(query, options, (err, result) => {
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




}