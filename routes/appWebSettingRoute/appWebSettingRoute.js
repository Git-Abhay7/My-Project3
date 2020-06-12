const express = require('express')
const router = express.Router()
const appWeb = require("../../controllers/appWebController");
const auth = require('../../middleware/auth');


/**
 * @swagger
 * /api/v1/appWeb/appWebSettings:
 *  put:
 *    tags:
 *       - APP & WEB SETTINGS
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: id
 *         description: id
 *         in: formData
 *         required: true
 *       - name: language
 *         description: language
 *         in: formData
 *         required: false
 *       - name: radius_of_search
 *         description: radius_of_search
 *         in: formData
 *         required: false
 *       - name: currency
 *         description: currency
 *         in: formData
 *         required: false
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/appWebSettings', auth.verifyToken, appWeb.editAppWeb)

/**
 * @swagger
 * /api/v1/appWeb/appWebSettings/{id}:
 *   get:
 *     tags:
 *       - APP & WEB SETTINGS
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: id
 *         description: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/appWebSettings/:id', auth.verifyToken, appWeb.viewAppWeb)


module.exports = router      