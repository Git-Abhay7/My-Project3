const filterModel = require("../models/filterModel");
const userModel = require('../models/userModel');
const offerModel = require('../models/offerModel')
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');


module.exports = {

    mainFilter: (req, res) => {

        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {

                new filterModel(req.body).save((error, saveResult) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.FILTER_ADDED_SUCCESSFULLY);
                    }
                })
            }
        })

    },

    storeFilter: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                var fetch = {

                    store: [
                        {
                            storeName: req.body.storeName

                        }
                    ]
                }
                filterModel(fetch).save((error, result) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.FILTER_ADDED_SUCCESSFULLY);
                    }
                })

            }
        })
    },
    brandFilter: (req, res) => {
        userModel.findOne({ _id:req.userId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                filterModel(req.body).save((error, result) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.FILTER_ADDED_SUCCESSFULLY);
                    }
                })

            }
        })
    },
    categoryFilter: (req, res) => {
        userModel.findOne({ _id: req.userId, status: "ACTIVE" }, (error, result) => {
            if (error) {
                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
            }
            else {
                filterModel(req.body).save((error, saved) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        response(res, SuccessCode.SUCCESS, result, SuccessMessage.FILTER_ADDED_SUCCESSFULLY);
                    }
                })
            }
        })

    }
}