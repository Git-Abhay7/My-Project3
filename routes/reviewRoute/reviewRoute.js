const express = require('express')
const router = express.Router()
const reviewController = require("../../controllers/reviewController");
const auth = require('../../middleware/auth');



/**
 * @swagger
 * /api/v1/review/review/{_id}:
 *   get:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
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

router.get('/review/:_id', auth.verifyToken, reviewController.viewReview)

/**
 * @swagger
 * /api/v1/review/review:
 *   delete:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: formData
 *         required: true   
 *     responses:
 *       200:
 *         description: Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/review', auth.verifyToken, reviewController.deactivateReview)

/**
 * @swagger
 * /api/v1/review/reviewList:
 *   post:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: fromDate
 *         description: fromDate
 *         in: formData
 *         required: false
 *       - name: toDate
 *         description: toDate  
 *         in: formData   
 *         required: false
 *       - name: page
 *         description: page
 *         in: formData
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: formData
 *         required: false 
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/reviewList', auth.verifyToken, reviewController.reviewList)
/**
 * @swagger
 * /api/v1/review/review:
 *   put:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: comment
 *         description: comment
 *         in: formData
 *         required: true
 *       - name: editedBy
 *         description: editedBy
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/review', auth.verifyToken, reviewController.editReview)

/**
 * @swagger
 * /api/v1/review/respondReview:
 *   post:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: reviewId
 *         description: reviewId
 *         in: formData
 *         required: true
 *       - name: respondBy
 *         description: respondBy
 *         in: formData
 *         required: true
 *       - name: response
 *         description: response
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Responded successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/respondReview', auth.verifyToken, reviewController.respondReview)

/**
 * @swagger
 * /api/v1/review/myReviews:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/myReviews', auth.verifyToken, reviewController.myReviews)
/**
 * @swagger
 * /api/v1/review/uploadReview:
 *   post:
 *     tags:
 *       - REVIEW-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: offerId
 *         description: offerId
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *       - name: video
 *         description: video
 *         in: formData
 *         required: false
 *       - name: comments
 *         description: comments
 *         in: text
 *         required: false
 *     responses:
 *       200:
 *         description: Review uploaded successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/uploadReview', auth.verifyToken, reviewController.uploadReview)




module.exports = router;
