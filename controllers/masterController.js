const userModel = require('../models//userModel');
const branchModel = require('../models/branchModel');
const masterModel = require('../models/masterModel');
const masterGlobalModel = require('../models/masterGlobalModel');
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {

    /**
     * Function Name :masterList
     * Description   : masterList in master list
     *
     * @return response
    */

    masterList: (req, res) => {
        try {
            masterGlobalModel.find({}, (err, result) => {
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
     * Function Name :addInterest
     * Description   : addInterest in master list
     *
     * @return response
    */

    addInterest: (req, res) => {
        try {
            masterModel.findOne({ interestName: req.body.interestName, type: "Interests", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.INTEREST_EXIST);
                }
                else {
                    req.body.type = "Interests";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Interests" }, { $set: { title: "Interests" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.INTEREST_ADD);
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
     * Function Name :viewInterest
     * Description   : viewInterest in master list
     *
     * @return response
    */

    viewInterest: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.interestId, type: "Interests", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editInterest
     * Description   : editInterest in master list
     *
     * @return response
    */

    editInterest: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.interestId, type: "Interests", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ interestName: req.body.interestName }, { type: "Interests" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, interestResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (interestResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.INTEREST_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { interestName: req.body.interestName } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Interests" }, { $set: { title: "Interests" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateInterest
     * Description   : deactivateInterest in master list
     *
     * @return response
    */

    deactivateInterest: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.interestId, type: "Interests", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Interests" }, { $set: { title: "Interests" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :interestList
     * Description   : interestList in master list
     *  
     * @return response
    */

    interestList: (req, res) => {
        try {
            var query = { type: "Interests", status: "ACTIVE" };

            if (req.body.search) {
                query.interestName = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addBusinessCategory
     * Description   : addBusinessCategory in master list
     *
     * @return response
    */

    addBusinessCategory: (req, res) => {
        try {
            masterModel.findOne({ businessCategoryName: req.body.businessCategoryName, type: "Business Category", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BUSINESS_CATEGORY_EXIST);
                }
                else {
                    req.body.type = "Business Category";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Business Category" }, { $set: { title: "Business Category" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.BUSINESS_CATEGORY_ADD);
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
     * Function Name :viewBusinessCategory
     * Description   : viewBusinessCategory in master list
     *
     * @return response
    */

    viewBusinessCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.businessId, type: "Business Category", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editBusinessCategory
     * Description   : editBusinessCategory in master list
     *
     * @return response
    */

    editBusinessCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.businessId, type: "Business Category", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ businessCategoryName: req.body.businessCategoryName }, { type: "Business Category" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, businessResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (businessResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BUSINESS_CATEGORY_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { businessCategoryName: req.body.businessCategoryName } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Business Category" }, { $set: { title: "Business Category" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateBusinessCategory
     * Description   : deactivateBusinessCategory in master list
     *
     * @return response
    */

    deactivateBusinessCategory: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.businessId, type: "Business Category", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Business Category" }, { $set: { title: "Business Category" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :businessCategoryList
     * Description   : businessCategoryList in master list
     *
     * @return response
    */

    businessCategoryList: (req, res) => {
        try {
            var query = { type: "Business Category", status: "ACTIVE" };

            if (req.body.search) {
                query.businessCategoryName = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addSortItem
     * Description   : addSortItem in master list
     *
     * @return response
    */

    addSortItem: (req, res) => {
        try {
            masterModel.findOne({ sortItem: req.body.sortItem, type: "Sort Items", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ITEM_EXIST);
                }
                else {
                    req.body.type = "Sort Items";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Sort Items" }, { $set: { title: "Sort Items" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.SORT_ITEM_ADD);
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
     * Function Name :viewSortItem
     * Description   : viewSortItem in master list
     *
     * @return response
    */

    viewSortItem: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.sortId, type: "Sort Items", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editSortItem
     * Description   : editSortItem in master list
     *
     * @return response
    */

    editSortItem: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.sortId, type: "Sort Items", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ sortItem: req.body.sortItem }, { type: "Sort Items" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, sortResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (sortResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ITEM_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { sortItem: req.body.sortItem } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Sort Items" }, { $set: { title: "Sort Items" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateSortItem
     * Description   : deactivateSortItem in master list
     *
     * @return response
    */

    deactivateSortItem: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.sortId, type: "Sort Items", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Sort Items" }, { $set: { title: "Sort Items" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :sortItemList
     * Description   : sortItemList in master list
     *
     * @return response
    */

    sortItemList: (req, res) => {
        try {
            var query = { type: "Sort Items", status: "ACTIVE" };

            if (req.body.search) {
                query.sortItem = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addBrand
     * Description   : addBrand in master list
     *
     * @return response
    */

    addBrand: (req, res) => {
        try {
            masterModel.findOne({ brandName: req.body.brandName, type: "Brands", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BRAND_EXIST);
                }
                else {
                    req.body.type = "Brands";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Brands" }, { $set: { title: "Brands" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.BRAND_ADD);
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
     * Function Name :viewBrand
     * Description   : viewBrand in master list
     *
     * @return response
    */

    viewBrand: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.brandId, type: "Brands", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editBrand
     * Description   : editBrand in master list
     *
     * @return response
    */

    editBrand: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.brandId, type: "Brands", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ brandName: req.body.brandName }, { type: "Brands" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, brandResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (brandResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BRAND_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { brandName: req.body.brandName } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Brands" }, { $set: { title: "Brands" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateBrand
     * Description   : deactivateBrand in master list
     *
     * @return response
    */

    deactivateBrand: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.brandId, type: "Brands", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Brands" }, { $set: { title: "Brands" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Brands" }, { $set: { title: "Brands" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :brandList
     * Description   : brandList in master list
     *
     * @return response
    */

    brandList: (req, res) => {
        try {
            var query = { type: "Brands", status: "ACTIVE" };

            if (req.body.search) {
                query.brandName = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addCategory
     * Description   : addCategory in master list
     *
     * @return response
    */

    addCategory: (req, res) => {
        try {
            masterModel.findOne({ categoryName: req.body.categoryName, type: "Category & Subcategory", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.CATEGORY_EXIST);
                }
                else {

                    jsonObject = req.body.subCategories.map(JSON.stringify);


                    uniqueSet = new Set(jsonObject);
                    uniqueArray = Array.from(uniqueSet).map(JSON.parse);

                    req.body.subCategories = uniqueArray;
                    req.body.type = "Category & Subcategory";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.CATEGORY_ADD);
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
     * Function Name :addSubCategory
     * Description   : addSubCategory in master list
     *
     * @return response
    */

    addSubCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.categoryId, type: "Category & Subcategory" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterModel.findOne({ _id: result._id, subCategories: { $elemMatch: { subCategoryName: req.body.subCategoryName } } }, (err, subCategoryResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (subCategoryResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.SUBCATEGORY_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $addToSet: { subCategories: [{ subCategoryName: req.body.subCategoryName }] } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
                                        if (err) {
                                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                        }
                                        else {
                                            response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.SUBCATEGORY_ADD);
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
     * Function Name :viewCategory
     * Description   : viewCategory in master list
     *
     * @return response
    */

    viewCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.categoryId, type: "Category & Subcategory", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editSubCategory
     * Description   : editSubCategory in master list
     *
     * @return response
    */

    editSubCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.categoryId, type: "Category & Subcategory", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterModel.findOneAndUpdate({ "subCategories._id": req.body.subCategoryId }, { $set: { "subCategories.$.subCategoryName": req.body.subCategoryName } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
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
     * Function Name :deactivateSubCategory
     * Description   : deactivateSubCategory in master list
     *
     * @return response
    */

    deactivateSubCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.categoryId, type: "Category & Subcategory", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterModel.findOneAndUpdate({ "subCategories._id": req.body.subCategoryId }, { $set: { "subCategories.$.subCategoryStatus": "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
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
     * Function Name :editCategory
     * Description   : editCategory in master list
     *
     * @return response
    */

    editCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.categoryId, type: "Category & Subcategory", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ categoryName: req.body.categoryName }, { type: "Category & Subcategory" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, categoryResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (categoryResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.CATEGORY_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { categoryName: req.body.categoryName } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateCategory
     * Description   : deactivateCategory in master list
     *
     * @return response
    */

    deactivateCategory: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.categoryId, type: "Category & Subcategory", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterModel.findOneAndUpdate({ _id: result._id }, { $set: { status: "DELETE" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Category & Subcategory" }, { $set: { title: "Category & Subcategory" } }, { new: true }, (err, updateResult) => {
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
     * Function Name :categoryList
     * Description   : categoryList in master list
     *
     * @return response
    */

    categoryList: (req, res) => {
        try {
            var query = { type: "Category & Subcategory", status: "ACTIVE" };

            req.body.limit = parseInt(req.body.limit);
            var options = {
                page: req.body.page || 1,
                limit: req.body.limit || 10,
                sort: { updatedAt: -1 }
            };

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addDepartment
     * Description   : addDepartment in master list
     *
     * @return response
    */

    addDepartment: (req, res) => {
        try {
            masterModel.findOne({ departmentName: req.body.departmentName, type: "Department", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.DEPARTMENT_EXIST);
                }
                else {
                    req.body.type = "Department";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Department" }, { $set: { title: "Department" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DEPARTMENT_ADD);
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
     * Function Name :viewDepartment
     * Description   : viewDepartment in master list
     *
     * @return response
    */

    viewDepartment: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.departmentId, type: "Department", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editDepartment
     * Description   : editDepartment in master list
     *
     * @return response
    */

    editDepartment: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.departmentId, type: "Department", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ departmentName: req.body.departmentName }, { type: "Department" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, brandResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (brandResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BRAND_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { departmentName: req.body.departmentName } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Department" }, { $set: { title: "Department" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateDepartment
     * Description   : deactivateDepartment in master list
     *
     * @return response
    */

    deactivateDepartment: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.departmentId, type: "Department", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Department" }, { $set: { title: "Department" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :departmentList
     * Description   : departmentList in master list
     *
     * @return response
    */

    departmentList: (req, res) => {
        try {
            var query = { type: "Department", status: "ACTIVE" };

            if (req.body.search) {
                query.departmentName = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addDesignation
     * Description   : addDesignation in master list
     *
     * @return response
    */

    addDesignation: (req, res) => {
        try {
            masterModel.findOne({ designation: req.body.designation, type: "Designation", status: { $ne: "DELETE" } }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.DESIGNATION_EXIST);
                }
                else {
                    req.body.type = "Designation";
                    new masterModel(req.body).save((saveErr, saveResult) => {
                        if (saveErr) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Designation" }, { $set: { title: "Designation" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.DESIGNATION_ADD);
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
     * Function Name :viewDesignation
     * Description   : viewDesignation in master list
     *
     * @return response
    */

    viewDesignation: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.designationId, type: "Designation", status: "ACTIVE" }, (err, result) => {
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
     * Function Name :editDesignation
     * Description   : editDesignation in master list
     *
     * @return response
    */

    editDesignation: (req, res) => {
        try {
            masterModel.findOne({ _id: req.body.designationId, type: "Designation", status: "ACTIVE" }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    let query = { $and: [{ designation: req.body.designation }, { type: "Designation" }, { status: { $ne: "DELETE" } }, { _id: { $ne: result._id } }] }
                    masterModel.findOne(query, (err, brandResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else if (brandResult) {
                            response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.BRAND_EXIST);
                        }
                        else {
                            masterModel.findOneAndUpdate({ _id: result._id }, { $set: { designation: req.body.designation } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    masterGlobalModel.update({ title: "Designation" }, { $set: { title: "Designation" } }, { new: true }, (err, updateResult) => {
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
            })
        }
        catch (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :deactivateDesignation
     * Description   : deactivateDesignation in master list
     *
     * @return response
    */

    deactivateDesignation: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.designationId, type: "Designation", status: "ACTIVE" }, { $set: { status: "DELETE" } }, { new: true }, (err, result) => {
                if (err) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!result) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "Designation" }, { $set: { title: "Designation" } }, { new: true }, (err, updateResult) => {
                        if (err) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            response(res, SuccessCode.SUCCESS, result, SuccessMessage.DELETE_SUCCESS);
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
     * Function Name :designationList
     * Description   : designationList in master list
     *
     * @return response
    */

    designationList: (req, res) => {
        try {
            var query = { type: "Designation", status: "ACTIVE" };

            if (req.body.search) {
                query.designation = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :adduserRole
     * Description   : addUserRole in master list
     *
     * @return response
    */

    addUserRole: (req, res) => {
        try {
            masterModel.findOne({ roleName: req.body.roleName, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR, error);
                }
                else if (result) {
                    if (result.roleName == req.body.roleName) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.ROLE_EXIST);
                    }
                }
                else {
                    var obj = {
                        type: "User Roles",
                        roleName: req.body.roleName,
                        rolePermission: [{
                            dashboardYnot: req.body.dashboardYnot,
                            consumers: req.body.consumers,
                            vendors: req.body.vendors,
                            promotions: req.body.promotions,
                            reviews: req.body.reviews,
                            notifications: req.body.notifications,
                            contentManagement: req.body.contentManagement,
                            masterList: req.body.masterList,
                            appWebSettings: req.body.appWebSettings,
                            userActivityLog: req.body.userActivityLog,
                            myProfileYnot: req.body.myProfileYnot,
                            usersAndRoles: req.body.usersAndRoles,
                            reportsYnot: req.body.reportsYnot,
                            dashboardVendor: req.body.dashboardVendor,
                            myProfileVendor: req.body.myProfileVendor,
                            myBranches: req.body.myBranches,
                            myPromotions: req.body.myPromotions,
                            myReviews: req.body.myReviews,
                            myUsers: req.body.myUsers,
                            reportsVendor: req.body.reportsVendor
                        }]
                    };
                    new masterModel(obj).save((error, saveRole) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "User Roles" }, { $set: { title: "User Roles" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveRole, SuccessMessage.DATA_SAVED);
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
     * Function Name : editUserRole
     * Description   : editUserRole in master list
     *
     * @return response
    */

    editUserRole: (req, res) => {
        try {
            var set = {}
            if (req.body.roleName) {
                set.roleName = req.body.roleName
            }
            if (req.body.rolePermissionId) {
                set.rolePermission = [{
                    "dashboardYnot": req.body.dashboardYnot,
                    "consumers": req.body.consumers,
                    "vendors": req.body.vendors,
                    "promotions": req.body.promotions,
                    "reviews": req.body.reviews,
                    "notifications": req.body.notifications,
                    "contentManagement": req.body.contentManagement,
                    "masterList": req.body.masterList,
                    "appWebSettings": req.body.appWebSettings,
                    "userActivityLog": req.body.userActivityLog,
                    "myProfileYnot": req.body.myProfileYnot,
                    "usersAndRoles": req.body.usersAndRoles,
                    "reportsYnot": req.body.reportsYnot,
                    "dashboardVendor": req.body.dashboardVendor,
                    "myProfileVendor": req.body.myProfileVendor,
                    "myBranches": req.body.myBranches,
                    "myPromotions": req.body.myPromotions,
                    "myReviews": req.body.myReviews,
                    "myUsers": req.body.myUsers,
                    "reportsVendor": req.body.reportsVendor
                }]
            }
            masterModel.findOneAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "User Roles" }, { $set: set },
                { new: true }, (error, updateRoll) => {
                    if (error) {
                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                    }
                    else {
                        masterGlobalModel.update({ title: "User Roles" }, { $set: { title: "User Roles" } }, { new: true }, (err, updateResult) => {
                            if (err) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                response(res, SuccessCode.SUCCESS, updateRoll, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name : viewUserRole
     * Description   : viewUserRole in master list
     *
     * @return response
    */

    viewUserRole: (req, res) => {
        try {
            masterModel.findOne({ _id: req.params.id, status: "ACTIVE", type: "User Roles" }, (error, result) => {
                if (error) {
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
     * Function Name : deleteUserRole
     * Description   : deleteUserRole in master list
     *
     * @return response
    */

    deleteUserRole: (req, res) => {
        try {
            masterModel.findOneAndUpdate({ _id: req.body.id, status: "ACTIVE", type: "User Roles" }, { $set: { status: "DELETE" } }, { new: true }, (error, updateResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    masterGlobalModel.update({ title: "User Roles" }, { $set: { title: "User Roles" } }, { new: true }, (err, updateResult) => {
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
     * Function Name : userRoleList
     * Description   : userRoleList in master list
     *
     * @return response
    */

    userRoleList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "User Roles" };

            if (req.body.search) {
                query.roleName = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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
     * Function Name :addDocumentType
     * Description   : addDocumentType in master list
     *
     * @return response
    */

    addDocumentType: (req, res) => {
        try {
            masterModel.findOne({ documentType: req.body.documentType, status: "ACTIVE" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR, error);
                }
                else if (result) {
                    if (result.documentType == req.body.documentType) {
                        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.DOCUMENT_EXIST);
                    }
                }
                else {
                    var obj = {
                        "type": "Document Type",
                        "documentType": req.body.documentType,
                    }
                    new masterModel(obj).save((error, saveDoc) => {
                        if (error) {
                            response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                        }
                        else {
                            masterGlobalModel.update({ title: "Document Type" }, { $set: { title: "Document Type" } }, { new: true }, (err, updateResult) => {
                                if (err) {
                                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                }
                                else {
                                    response(res, SuccessCode.SUCCESS, saveDoc, SuccessMessage.DATA_SAVED);
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
     * Function Name :editDocumentType
     * Description   : editDocumentType in master list
     *
     * @return response
    */

    editDocumentType: (req, res) => {
        try {
            masterModel.findOne({ documentType: req.body.documentType, status: "ACTIVE", type: "Document Type" }, (error, result) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (result) {
                    response(res, ErrorCode.ALREADY_EXIST, ErrorMessage.DOCUMENT_NAME_EXISTS)
                }
                else {
                    masterModel.findOneAndUpdate({ _id: req.body.id, status: "ACTIVE" }, { $set: req.body },
                        { new: true }, (error, updateDoc) => {
                            if (error) {
                                response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                            }
                            else {
                                masterGlobalModel.update({ title: "Document Type" }, { $set: { title: "Document Type" } }, { new: true }, (err, updateResult) => {
                                    if (err) {
                                        response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                                    }
                                    else {
                                        response(res, SuccessCode.SUCCESS, updateDoc, SuccessMessage.UPDATE_SUCCESS);
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
     * Function Name :documentTypeList
     * Description   : documentTypeList in master list
     *
     * @return response
    */

    documentTypeList: (req, res) => {
        try {
            var query = { status: "ACTIVE", type: "Document Type" };

            if (req.body.search) {
                query.documentType = new RegExp('^' + req.body.search, "i");
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

            masterModel.paginate(query, options, (err, result) => {
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


    // masterList: (req, res) => {
    //     try {
    //         masterModel.distinct("type", (err, result) => {
    //             var count = 0;
    //             var arr = []
    //             result.forEach((elem, index) => {
    //                 masterModel.find({ type: elem }).sort({ updatedAt: -1 }).select("type updatedAt").then((masterList,err ) => {
    //                     if (err) {
    //                         console.log({ responseCode: 500, responseMessage: "Internal server error" });
    //                     }
    //                     else {
    //                         var a = masterList[0]; 
    //                         let obj = { "type": a.type, "updatedAt": a.updatedAt };
    //                         count= count+1
    //                         return obj;

    //                     }
    //                 }).then((success)=>{
    //                     console.log(">>>>1726", success)
    //                     arr.push(success);
    //                     if(count==result.length){
    //                         response(res, SuccessCode.SUCCESS, arr, SuccessMessage.DATA_FOUND);
    //                     }
    //                 })

    //             })


    //         })

    //     }
    //     catch (error) {
    //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    //     }
    // },


}