const router = require("express").Router();

const Controller = require("../../controllers/filterController");

const auth = require('../../middleware/auth');

/**
 * @swagger
 * /api/v1/filter/mainFilter:
 *  post:
 *    tags:
 *       - FILTER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: main
 *         schema:
 *           properties:
 *             main:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 mindiscount:
 *                   type: string
 *                 maxdiscount:
 *                   type: string
 *                 minradius:
 *                   type: string
 *                 maxradius:
 *                   type: string
 *                 minprice:
 *                   type: string
 *                 maxprice:
 *                   type: string
 *    responses:
 *       200:
 *         description: main filter added successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */


router.post("/mainFilter", auth.verifyToken, Controller.mainFilter)
/**
 * @swagger
 * /api/v1/filter/storeFilter:
 *  post:
 *    tags:
 *       - FILTER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: store
 *         schema:
 *           properties:
 *             store:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 storeName:
 *                   type: string
 *    responses:
 *       200:
 *         description: store filter added successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */
router.post("/storeFilter", auth.verifyToken, Controller.storeFilter)
/**
 * @swagger
 * /api/v1/filter/brandFilter:
 *  post:
 *    tags:
 *       - FILTER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: brand
 *         schema:
 *           properties:
 *             brand:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 brandName:
 *                   type: string
 *    responses:
 *       200:
 *         description: brand filter added successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */
router.post("/brandFilter", auth.verifyToken, Controller.brandFilter)
/**
 * @swagger
 * /api/v1/filter/categoryFilter:
 *  post:
 *    tags:
 *       - FILTER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: category
 *         schema:
 *           properties:
 *             category:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 categoryName:
 *                   type: string
 *    responses:
 *       200:
 *         description: category filter added successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */
router.post("/categoryFilter", auth.verifyToken, Controller.categoryFilter)

module.exports = router;
