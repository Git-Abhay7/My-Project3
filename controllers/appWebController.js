const userModel = require('../models//userModel');
const branchModel = require('../models/branchModel');
const masterModel = require('../models/masterModel')
const appWebModel = require('../models/appWebModel')
const commonFunction = require('../helper/commonFunction');
const { commonResponse: response } = require('../helper/commonResponseHandler');
const { ErrorMessage } = require('../helper/message');
const { SuccessMessage } = require('../helper/message');
const { ErrorCode } = require('../helper/statusCode');
const { SuccessCode } = require('../helper/statusCode');

module.exports = {

    /**
     * Function Name :editAppWeb
     * Description   : editAppWeb in App-Web settings
     *
     * @return response
    */

    editAppWeb: (req, res) => {
        try {
            var set = {}
            if (req.body.language) {
                set.language = req.body.language
            }
            if (req.body.radius_of_search) {
                set.radius_of_search = req.body.radius_of_search
            }
            if (req.body.currency) {
                set.currency = req.body.currency
            }

            appWebModel.findOneAndUpdate({ _id: req.body.id }, { $set: set }, { new: true }, (error, updateResult) => {
                if (error) {
                    response(res, ErrorCode.INTERNAL_ERROR, [], ErrorMessage.INTERNAL_ERROR);
                }
                else if (!updateResult) {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
                }
                else {
                    response(res, SuccessCode.SUCCESS, updateResult, SuccessMessage.UPDATE_SUCCESS)
                }
            })
        }
        catch{
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
        }
    },

    /**
     * Function Name :viewAppWeb
     * Description   : viewAppWeb in App-Web settings
     *
     * @return response
    */

    viewAppWeb: (req, res) => {
        try {
            appWebModel.findOne({ _id: req.params.id }, (error, result) => {
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

    }
}