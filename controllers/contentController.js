const userModel = require("../models/userModel");
const contentModel = require('../models/contentModel');
const contentGlobalModel = require('../models/contentGlobalModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {

    /**
     * Function Name :contentList
     * Description   : contentList in content management
     *
     * @return response
    */

    contentList: (req, res) => {
        try {
            contentGlobalModel.find({}, (err, result) => {
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
     * Function Name :editStaticContent
     * Description   : editStaticContent in content management
     *
     * @return response
    */

    editStaticContent: (req, res) => {
        try {
            let set = {}
            if (req.body.title) {
                set["title"] = req.body.title
            }
            if (req.body.description) {
                set["description"] = req.body.description
            }

            contentGlobalModel.findOneAndUpdate({ _id: req.body.id, status: "ACTIVE" }, { $set: set }, { new: true }, (error, updateData) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
                }
                else if (!updateData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, updateData, SuccessMessage.UPDATE_SUCCESS);
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewStaticContent
     * Description   : viewStaticContent in content management
     *
     * @return response
    */

    viewStaticContent: (req, res) => {
        try {
            contentGlobalModel.findOne({ _id: req.params.id, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
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
     * Function Name :addContract
     * Description   : addContract in content management
     *
     * @return response
    */

    addContract: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                (error, result) => {

                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        commonFunction.uploadImage(req.body.document, (err, img) => {
                            if (err) {

                            }
                            else {

                                var obj = {
                                    "type": "Contracts and Agreements",
                                    "addedBy": result.firstName + " " + result.lastName,
                                    "title": req.body.title,
                                    "description": req.body.description,
                                    "broadcastFrom": req.body.broadcastFrom,
                                    "broadcastTo": req.body.broadcastFrom,
                                    "document": img
                                }
                                new contentModel(obj).save((error, docSave) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        contentGlobalModel.update({ title: "Contracts and Agreements" }, { $set: { title: "Contracts and Agreements" } }, { new: true }, (err, updateResult) => {
                                            if (err) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, docSave, SuccessMessage.DATA_SAVED);
                                            }
                                        })
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
     * Function Name :editContract
     * Description   : editContract in content management
     *
     * @return response
    */

    editContract: async (req, res) => {
        try {
            var obj = {}
            if (req.body.title) {
                obj.title = req.body.title
            }
            if (req.body.description) {
                obj.description = req.body.description
            }
            if (req.body.broadcastFrom) {
                obj.broadcastFrom = req.body.broadcastFrom
            }
            if (req.body.broadcastTo) {
                obj.broadcastTo = req.body.broadcastTo
            }
            if (req.body.document) {
                obj.document = await convertImage(req.body.document)
            }

            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Contracts and Agreements" }, { $set: obj }, { new: true },
                (error, updateContent) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateContent) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Contracts and Agreements" }, { $set: { title: "Contracts and Agreements" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateContent, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :viewContract
     * Description   : viewContract in content management
     *
     * @return response
    */

    viewContract: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Contracts and Agreements" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateContract
     * Description   : deactivateContract in content management
     *
     * @return response
    */

    deactivateContract: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Contracts and Agreements" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Contracts and Agreements" }, { $set: { title: "Contracts and Agreements" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :contractList
     * Description   : contractList in content management
     *
     * @return response
    */

    contractList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Contracts and Agreements" };

            if (req.body.search) {
                query.title = new RegExp('^' + req.body.search, "i");
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
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addFaq
     * Description   : addFaq in content management
     *
     * @return response
    */

    addFaq: (req, res) => {
        try {
            commonFunction.videoUpload(req.body.video, (error, videoResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var obj = {
                        "type": "FAQs",
                        "question": req.body.question,
                        "answer": req.body.answer,
                        "video": videoResult
                    }
                    new contentModel(obj).save((error, result) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            contentGlobalModel.update({ title: "FAQs" }, { $set: { title: "FAQs" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_SAVED);
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
     * Function Name :editFaq
     * Description   : editFaq in content management
     *
     * @return response
    */

    editFaq: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "FAQs" },
                { $set: { answer: req.body.answer } }, { new: true }, (error, updateFAQs) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateFAQs) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "FAQs" }, { $set: { title: "FAQs" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateFAQs, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :deactivateFaq
     * Description   : deactivateFaq in content management
     *
     * @return response
    */

    deactivateFaq: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "FAQs" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "FAQs" }, { $set: { title: "FAQs" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :faqList
     * Description   : faqList in content management
     *
     * @return response
    */

    faqList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "FAQs" };

            if (req.body.question) {
                query.question = new RegExp('^' + req.body.search, "i");
            }
            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addNews
     * Description   : addNews in content management
     *
     * @return response
    */

    addNews: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                (error, result) => {

                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        commonFunction.uploadImage(req.body.document, (err, img) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {

                                var obj = {
                                    "type": "Media Center News",
                                    "addedBy": result.firstName + " " + result.lastName,
                                    "title": req.body.title,
                                    "description": req.body.description,
                                    "broadcastFrom": req.body.broadcastFrom,
                                    "broadcastTo": req.body.broadcastFrom,
                                    "document": img
                                }
                                new contentModel(obj).save((error, docSave) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        contentGlobalModel.update({ title: "Media Center News" }, { $set: { title: "Media Center News" } }, { new: true }, (err, updateResult) => {
                                            if (err) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, docSave, SuccessMessage.DATA_SAVED)
                                            }
                                        })
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
     * Function Name :editNews
     * Description   : editNews in content management
     *
     * @return response
    */

    editNews: async (req, res) => {
        try {
            var obj = {}
            if (req.body.title) {
                obj.title = req.body.title
            }
            if (req.body.description) {
                obj.description = req.body.description
            }
            if (req.body.broadcastFrom) {
                obj.broadcastFrom = req.body.broadcastFrom
            }
            if (req.body.broadcastTo) {
                obj.broadcastTo = req.body.broadcastTo
            }
            if (req.body.document) {
                obj.document = await convertImage(req.body.document)
            }

            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center News" }, { $set: obj }, { new: true },
                (error, updateContent) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateContent) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center News" }, { $set: { title: "Media Center News" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateContent, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :viewNews
     * Description   : viewNews in content management
     *
     * @return response
    */

    viewNews: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Media Center News" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateNews
     * Description   : deactivateNews in content management
     *
     * @return response
    */

    deactivateNews: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center News" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center News" }, { $set: { title: "Media Center News" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :newsList
     * Description   : newsList in content management
     *
     * @return response
    */

    newsList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Media Center News" };

            if (req.body.search) {
                query.title = new RegExp('^' + req.body.search, "i");
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
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addEvent
     * Description   : addEvent in content management
     *
     * @return response
    */

    addEvent: (req, res) => {
        try {
            userModel.findOne({ _id: req.userId, status: "ACTIVE", userType: { $in: ["ADMIN", "SUBADMIN"] } },
                (error, result) => {

                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!result) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        commonFunction.uploadImage(req.body.document, (err, img) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {

                                var obj = {
                                    "type": "Media Center Events",
                                    "addedBy": result.firstName + " " + result.lastName,
                                    "title": req.body.title,
                                    "description": req.body.description,
                                    "broadcastFrom": req.body.broadcastFrom,
                                    "broadcastTo": req.body.broadcastFrom,
                                    "document": img
                                }
                                new contentModel(obj).save((error, docSave) => {
                                    if (error) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        contentGlobalModel.update({ title: "Media Center Events" }, { $set: { title: "Media Center Events" } }, { new: true }, (err, updateResult) => {
                                            if (err) {
                                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                            }
                                            else {
                                                response(res, SuccessCode.SUCCESS, docSave, SuccessMessage.DATA_SAVED)
                                            }
                                        })

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
     * Function Name :editEvent
     * Description   : editEvent in content management
     *
     * @return response
    */

    editEvent: async (req, res) => {
        try {
            var obj = {}
            if (req.body.title) {
                obj.title = req.body.title
            }
            if (req.body.description) {
                obj.description = req.body.description
            }
            if (req.body.broadcastFrom) {
                obj.broadcastFrom = req.body.broadcastFrom
            }
            if (req.body.broadcastTo) {
                obj.broadcastTo = req.body.broadcastTo
            }
            if (req.body.document) {
                obj.document = await convertImage(req.body.document)
            }

            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Events" }, { $set: obj }, { new: true },
                (error, updateContent) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateContent) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center Events" }, { $set: { title: "Media Center Events" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateContent, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :viewEvent
     * Description   : viewEvent in content management
     *
     * @return response
    */

    viewEvent: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Media Center Events" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },


    /**
     * Function Name :deactivateEvent
     * Description   : deactivateEvent in content management
     *
     * @return response
    */

    deactivateEvent: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Events" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center Events" }, { $set: { title: "Media Center Events" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :eventList
     * Description   : eventList in content management
     *
     * @return response
    */

    eventList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Media Center Events" };

            if (req.body.search) {
                query.title = new RegExp('^' + req.body.search, "i");
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
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addPhoto
     * Description   : addPhoto in content management
     *
     * @return response
    */

    addPhoto: async (req, res) => {
        try {
            var img = await convertImage(req.body.image)
            var obj = {
                "type": "Media Center Photos",
                "image": img
            }
            new contentModel(obj).save((err, imgSave) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    contentGlobalModel.update({ title: "Media Center Photos" }, { $set: { title: "Media Center Photos" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, imgSave, SuccessMessage.DATA_SAVED);
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
     * Function Name :viewPhoto
     * Description   : viewPhoto in content management
     *
     * @return response
    */

    viewPhoto: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Media Center Photos" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :editPhoto
     * Description   : editPhoto in content management
     *
     * @return response
    */

    editPhoto: async (req, res) => {
        try {
            var img = await convertImage(req.body.image)
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Photos" }, { $set: { image: img } },
                { new: true }, (err, updateImage) => {
                    if (err) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateImage) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center Photos" }, { $set: { title: "Media Center Photos" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateImage, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :deactivatePhoto
     * Description   : deactivatePhoto in content management
     *
     * @return response
    */

    deactivatePhoto: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Photos" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center Photos" }, { $set: { title: "Media Center Photos" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :photoList
     * Description   : photoList in content management
     *
     * @return response
    */

    photoList: (req, res) => {
        try {
            var query = { type: "Media Center Photos", status: "ACTIVE" };

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

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addVideo
     * Description   : addVideo in content management
     *
     * @return response
    */

    addVideo: (req, res) => {
        try {
            commonFunction.videoUpload(req.body.video, (error, videoUpload) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    var obj = {
                        "type": "Media Center Videos",
                        "video": videoUpload
                    }
                    new contentModel(obj).save((error, videoSave) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            contentGlobalModel.update({ title: "Media Center Videos" }, { $set: { title: "Media Center Videos" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, videoSave, SuccessMessage.DATA_SAVED);
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
     * Function Name :editVideo
     * Description   : editVideo in content management
     *
     * @return response
    */

    editVideo: (req, res) => {
        try {
            if (req.body.video) {
                commonFunction.videoUpload(req.body.video, (error, videoUpload) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Videos" },
                            { $set: { video: videoUpload } }, { new: true }, (err, updateVideo) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else if (!updateVideo) {
                                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                                }
                                else {
                                    contentGlobalModel.update({ title: "Media Center Videos" }, { $set: { title: "Media Center Videos" } }, { new: true }, (err, updateResult) => {
                                        if (err) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, updateVideo, SuccessMessage.UPDATE_SUCCESS);
                                        }
                                    })
                                }
                            })
                    }
                })
            }
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewVideo
     * Description   : viewVideo in content management
     *
     * @return response
    */

    viewVideo: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Media Center Videos" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
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
     * Function Name :deactivateVideo
     * Description   : deactivateVideo in content management
     *
     * @return response
    */

    deactivateVideo: (req, res) => {
        try {
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "Media Center Videos" },
                { $set: { status: "DELETE" } }, { new: true }, (error, updateStatus) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateStatus) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "Media Center Videos" }, { $set: { title: "Media Center Videos" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateStatus, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :videoList
     * Description   : videoList in content management
     *
     * @return response
    */

    videoList: (req, res) => {
        try {
            var query = { type: "Media Center Videos", status: "ACTIVE" };

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

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :addSocialMedia
     * Description   : addSocialMedia in content management
     *
     * @return response
    */

    addSocialMedia: (req, res) => {
        try {
            req.body.type = "Social Media";
            new contentModel(req.body).save((saveErr, saveResult) => {
                if (saveErr) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    masterGlobalModel.update({ title: "Social Media" }, { $set: { title: "Social Media" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.SOCIAL_LINK_ADD);
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
     * Function Name :editSocialMedia
     * Description   : editSocialMedia in content management
     *
     * @return response
    */

    editSocialMedia: (req, res) => {
        try {
            contentModel.findOne({ _id: req.body.socialId, type: "Social Media" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    contentModel.findOneAndUpdate({ _id: result._id }, { $set: req.body }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Social Media" }, { $set: { title: "Social Media" } }, { new: true }, (err, updateResult) => {
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
     * Function Name :socialMediaList
     * Description   : socialMediaList in content management
     *
     * @return response
    */

    socialMediaList: async (req, res) => {
        try {
            const findList = async () => {
                let list = await contentModel.find({ type: "Social Media" });
                return list;
            };
            const list = await findList();
            if (list.length != 0) {
                response(res, ErrorCode.SUCCESS, list, SuccessMessage.DATA_FOUND);
            }
            const titles = [
                "Facebook",
                "Instagram",
                "Twitter",
                "LinkedIn",
                "Google"
            ];
            let store = await contentModel.create(
                ...titles.map(o => (o = { socialSite: o, type: "Social Media" }))
            );
            let result = await findList();
            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND);
        } catch (error) {
            throw error;
        }
    },



    /**
     * Function Name :uploadLogo
     * Description   : uploadLogo in content management
     *
     * @return response
    */

    uploadLogo: async (req, res) => {
        try {
            var img = await convertImage(req.body.image)
            var obj = {
                "type": "LOGO",
                "image": img
            }
            new contentModel(obj).save((err, imgSave) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    contentGlobalModel.update({ title: "LOGO" }, { $set: { title: "LOGO" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, imgSave, SuccessMessage.DATA_SAVED);
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
     * Function Name :editLogo
     * Description   : editLogo in content management
     *
     * @return response
    */

    editLogo: async (req, res) => {
        try {
            var img = await convertImage(req.body.productLogo)
            contentModel.findByIdAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "LOGO" }, { $set: { ProductLogo: img } },
                { new: true }, (err, updateImage) => {
                    if (err) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else if (!updateImage) {
                        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                    }
                    else {
                        contentGlobalModel.update({ title: "LOGO" }, { $set: { title: "LOGO" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateImage, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :viewLogo
     * Description   : viewLogo in content management
     *
     * @return response
    */

    viewLogo: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "LOGO" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
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
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :addSplash
     * Description   : addSplash in content management
     *
     * @return response
    */

    addSplash: (req, res) => {
        try {
            commonFunction.uploadImage(req.body.image, (err, imageResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    req.body.type = "Splash Screens";
                    req.body.image = imageResult;
                    new contentModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            contentGlobalModel.update({ title: "Splash Screens" }, { $set: { title: "Splash Screens" } }, { new: true }, (err, updateResult) => {
                                if (err) {
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
     * Function Name :editSplash
     * Description   : editSplash in content management
     *
     * @return response
    */

    editSplash: (req, res) => {
        try {
            commonFunction.uploadImage(req.body.image, (err, imageResult) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else {
                    contentModel.findByIdAndUpdate({ _id: req.body.id, type: "Splash Screens", status: "ACTIVE" }, { $set: { image: imageResult } },
                        { new: true }, (error, updateResult) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else if (!updateResult) {
                                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                            }
                            else {
                                contentGlobalModel.update({ title: "Splash Screens" }, { $set: { title: "Splash Screens" } }, { new: true }, (err, updateResult) => {
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
      * Function Name :viewSplash
      * Description   : viewSplash in content management
      *
      * @return response
     */

    viewSplash: (req, res) => {
        try {
            contentModel.findOne({ _id: req.params._id, type: "Splash Screens", status: { $ne: "DELETE" } }, (err, result) => {
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
     * Function Name :deactivateSplash
     * Description   : deactivateSplash in content management
     *
     * @return response
    */

    deactivateSplash: (req, res) => {
        try {
            contentModel.findOne({ _id: req.body._id, type: "Splash Screens", status: { $ne: "DELETE" } }, (err, findData) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findData) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    contentModel.findOneAndUpdate({ _id: findData._id }, { $set: { status: "DELETE" } }, { new: true }, (error, deactivate) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            contentGlobalModel.update({ title: "Splash Screens" }, { $set: { title: "Splash Screens" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, deactivate, SuccessMessage.BLOCK_SUCCESS);
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
     * Function Name :splashList
     * Description   : splashList in content management
     *
     * @return response
    */

    splashList: (req, res) => {
        try {
            var query = { type: "Splash Screens", status: { $ne: "DELETE" } };

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

            contentModel.paginate(query, options, (err, result) => {
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

    //===============================website API==========================//

    /**
        * Function Name :newsList
        * Description   : newsList in content management
        *
        * @return response
       */

    newsListWebsite: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Media Center News" };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
         * Function Name : event List website
         * Description   : eventList in content management
         *
         * @return response
        */

    eventListWebsite: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Media Center Events" };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
        * Function Name : photos List website
        * Description   : photos in content management
        *
        * @return response
       */

    phototListWebsite: (req, res) => {
        try {
            var query = { type: "Media Center Photos", status: "ACTIVE" };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
             * Function Name : videos List website
             * Description   : videos in content management
             *
             * @return response
            */

    vediosListWebsite: (req, res) => {
        try {
            var query = { type: "Media Center Videos", status: "ACTIVE" };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 5,
                sort: { createdAt: -1 }
            };

            contentModel.paginate(query, options, (err, result) => {
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
     * Function Name :viewEvent
     * Description   : viewEvent in content management
     *
     * @return response
    */

    viewEventWebsite: (req, res) => {
        try {
            contentModel.findById({ _id: req.params.id, status: "ACTIVE", type: "Media Center Events" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.ROLL_NOT_FOUND)
                }
                else {
                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DATA_FOUND)
                }
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },



    /**
     * Function Name : viewFaq
     * Description   : viewFaq in faq management
     *
     * @return response
    */

    viewFaq: (req, res) => {
        try {
            contentModel.findOne({ _id: req.params.id, status: { $ne: "DELETE" } }, (findErr, findResult) => {
                if (findErr) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!findResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, findResult, SuccessMessage.DETAIL_GET);
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