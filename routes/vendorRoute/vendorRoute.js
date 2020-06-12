const express = require('express')
const router = express.Router()
const vendorController = require("../../controllers/vendorController");
const auth = require('../../middleware/auth');



/**
 * @swagger
 * /api/v1/vendor/signUp:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: company
 *         description: company name
 *         in: formData
 *         required: true
 *       - name: firstName
 *         description: firstName
 *         in: formData
 *         required: true
 *       - name: lastName
 *         description: lastName
 *         in: formData
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *       - name: telephone
 *         description: telephone
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *       - name: confirmPassword
 *         description: confirmPassword
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Signup successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/signUp', vendorController.signUp)
/**
 * @swagger
 * /api/v1/vendor/login:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

router.post('/login', vendorController.login)


/**
 * @swagger
 * /api/v1/vendor/myProfile:
 *   get:
 *     tags:
 *       - VENDOR
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
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/myProfile', auth.verifyToken, vendorController.myProfile)


/**
 * @swagger
 * /api/v1/vendor/forgotPassword:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Otp has been sent to your registered email/mobile number successfully
 *       404:
 *         description: Provided email is not registered.
 *       500:
 *         description: Internal Server Error
 */

router.post('/forgotPassword', vendorController.forgotPassword)


/**
 * @swagger
 * /api/v1/vendor/otpVerify:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: otp
 *         description: otp
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/otpVerify', vendorController.otpVerify)

/**
 * @swagger
 * /api/v1/vendor/resendOTP:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Otp has been sent to your registered email/mobile number.
 *       404:
 *         description: Provided email/mobile number is not registered
 *       500:
 *         description: Internal Server Error.
 */

router.post('/resendOTP', vendorController.resendOTP)

/**
 * @swagger
 * /api/v1/vendor/resetPassword:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: false
 *       - name: newPassword
 *         description: newPassword
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your password has been changed successfully
 *       404: 
 *         description: Provided email/mobile number is not registered
 *       500:
 *         description: Internal Server Error.
 */

router.post('/resetPassword', vendorController.resetPassword)


/**
 * @swagger
 * /api/v1/vendor/editProfile:
 *  put:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: vendor
 *         description: Update vendor.
 *         schema:
 *           type: object
 *           required:
 *             - vendorId
 *           properties:
 *             vendorId:
 *               type: string
 *             businessId:
 *               type: string
 *             status:
 *               type: string
 *             company:
 *               type: string
 *             isVerified:
 *               type: boolean
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             mobileNumber:
 *               type: string
 *             telephone:
 *               type: string
 *             email:
 *               type: string
 *             designation:
 *               type: string
 *             address:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             website:
 *               type: string
 *             licenseNumber:
 *               type: string
 *             licenseExpiry:
 *               type: string
 *             vatNumber:
 *               type: string
 *             vatExpiry:
 *               type: string
 *             businessCategory:
 *               type: string
 *             brands:
 *               type: string
 *             productCategories:
 *               type: string
 *             sun:
 *               type: string
 *             mon:
 *               type: string
 *             tue:
 *               type: string
 *             wed:
 *               type: string
 *             thu:
 *               type: string
 *             fri:
 *               type: string
 *             sat:
 *               type: string
 *             linkSocialAccounts:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 Type:
 *                   type: string
 *                 url:
 *                   type: string
 *             uploadDocs:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 docType:
 *                   type: string
 *                 docs:
 *                   type: string
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: This vendor does not exist.
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/editProfile', auth.verifyToken, vendorController.editProfile)

/**
 * @swagger
 * /api/v1/vendor/changePassword:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: oldPassword
 *         description: oldPassword
 *         in: formData
 *         required: true
 *       - name: newPassword
 *         description: newPassword
 *         in: formData
 *         required: true
 *       - name: confirmPassword
 *         description: confirmPassword
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your password has been changed successfully.
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */

router.post('/changePassword', auth.verifyToken, vendorController.changePassword)

/**
 * @swagger
 * /api/v1/vendor/branch:
 *  post:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: branch
 *         description: Add branch.
 *         schema:
 *           type: object
 *           required:
 *             - vendorId
 *           properties:
 *             vendorId:
 *               type: string
 *             branchId:
 *               type: string
 *             status:
 *               type: string
 *             branchName:
 *               type: string
 *             isVerified:
 *               type: boolean
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             mobileNumber:
 *               type: string
 *             telephone:
 *               type: string
 *             email:
 *               type: string
 *             designation:
 *               type: string
 *             address:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             website:
 *               type: string
 *             licenseNumber:
 *               type: string
 *             licenseExpiry:
 *               type: string
 *             vatNumber:
 *               type: string
 *             vatExpiry:
 *               type: string
 *             businessCategory:
 *               type: string
 *             brands:
 *               type: string
 *             productCategories:
 *               type: string
 *             sun:
 *               type: string
 *             mon:
 *               type: string
 *             tue:
 *               type: string
 *             wed:
 *               type: string
 *             thu:
 *               type: string
 *             fri:
 *               type: string
 *             sat:
 *               type: string
 *             linkSocialAccounts:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 Type:
 *                   type: string
 *                 url:
 *                   type: string
 *             uploadDocs:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 docType:
 *                   type: string
 *                 docs:
 *                   type: string
 *    responses:
 *       200:
 *         description: Data is saved successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/branch', auth.verifyToken, vendorController.addBranch)

/**
 * @swagger
 * /api/v1/vendor/branch:
 *  put:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: branch
 *         description: Update branch.
 *         schema:
 *           type: object
 *           required:
 *             - _id
 *           properties:
 *             _id:
 *               type: string
 *             status:
 *               type: string
 *             branchName:
 *               type: string
 *             isVerified:
 *               type: boolean
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             mobileNumber:
 *               type: string
 *             telephone:
 *               type: string
 *             email:
 *               type: string
 *             designation:
 *               type: string
 *             address:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             website:
 *               type: string
 *             licenseNumber:
 *               type: string
 *             licenseExpiry:
 *               type: string
 *             vatNumber:
 *               type: string
 *             vatExpiry:
 *               type: string
 *             businessCategory:
 *               type: string
 *             brands:
 *               type: string
 *             productCategories:
 *               type: string
 *             sun:
 *               type: string
 *             mon:
 *               type: string
 *             tue:
 *               type: string
 *             wed:
 *               type: string
 *             thu:
 *               type: string
 *             fri:
 *               type: string
 *             sat:
 *               type: string
 *             linkSocialAccounts:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 Type:
 *                   type: string
 *                 url:
 *                   type: string
 *             uploadDocs:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 docType:
 *                   type: string
 *                 docs:
 *                   type: string
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/branch', auth.verifyToken, vendorController.editBranch)

/**
 * @swagger
 * /api/v1/vendor/branch/{_id}:
 *   get:
 *     tags:
 *       - VENDOR
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

router.get('/branch/:_id', auth.verifyToken, vendorController.viewBranch)

/**
 * @swagger
 * /api/v1/vendor/branch:
 *   delete:
 *     tags:
 *       - VENDOR
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

router.delete('/branch', auth.verifyToken, vendorController.deactivateBranch)

/**
 * @swagger
 * /api/v1/vendor/branchList:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: vendorId
 *         description: vendorId
 *         in: formData
 *         required: true   
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/branchList', auth.verifyToken, vendorController.branchList)

/** 
 * @swagger
 * /api/v1/vendor/review/{_id}:
 *   get:
 *     tags:
 *       - VENDOR
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

router.get('/review/:_id', auth.verifyToken, vendorController.viewReview)

/**
 * @swagger
 * /api/v1/vendor/review:
 *   delete:
 *     tags:
 *       - VENDOR
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

router.delete('/review', auth.verifyToken, vendorController.deactivateReview)

/**
 * @swagger
 * /api/v1/vendor/reviewList:
 *   post:
 *     tags:
 *       - VENDOR
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

router.post('/reviewList', auth.verifyToken, vendorController.reviewList)
/**
 * @swagger
 * /api/v1/vendor/review:
 *   put:
 *     tags:
 *       - VENDOR
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

router.put('/review', auth.verifyToken, vendorController.editReview)

/**
 * @swagger
 * /api/v1/vendor/respondReview:
 *   post:
 *     tags:
 *       - VENDOR
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

router.post('/respondReview', auth.verifyToken, vendorController.respondReview)


/**
 * @swagger
 * /api/v1/vendor/promotion:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: promotionName
 *         description: promotionName      
 *         in: formData
 *         required: true
 *       - name: branches
 *         description: branches
 *         in: formData
 *         required: true
 *       - name: fromDate
 *         description: fromDate
 *         in: formData
 *         required: true
 *       - name: toDate
 *         description: toDate
 *         in: formData
 *         required: true
 *       - name: occasion
 *         description: occasion
 *         in: formData
 *         required: true
 *       - name: specialTermsConditions
 *         description: specialTermsConditions
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Promotion has been added successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/promotion', auth.verifyToken, vendorController.addPromotion)

/**
 * @swagger
 * /api/v1/vendor/promotion:
 *   put:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: promotionId
 *         description: promotionId      
 *         in: formData
 *         required: true
 *       - name: promotionName
 *         description: promotionName      
 *         in: formData
 *         required: false
 *       - name: branches
 *         description: branches
 *         in: formData
 *         required: false
 *       - name: fromDate
 *         description: fromDate
 *         in: formData
 *         required: false
 *       - name: toDate
 *         description: toDate
 *         in: formData
 *         required: false
 *       - name: occasion
 *         description: occasion
 *         in: formData
 *         required: false
 *       - name: specialTermsConditions
 *         description: specialTermsConditions
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/promotion', auth.verifyToken, vendorController.editPromotion)


/**
 * @swagger
 * /api/v1/vendor/promotion/{promotionId}:
 *   get:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: promotionId
 *         description: promotionId
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
router.get('/promotion/:promotionId', auth.verifyToken, vendorController.viewPromotion)

/**
 * @swagger
 * /api/v1/vendor/offer:
 *  post:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: promotionId
 *         description: promotionId
 *         in: formData
 *         required: true
 *       - name: itemName
 *         description: itemName
 *         in: formData
 *         required: true
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true
 *       - name: subCategoryId
 *         description: subCategoryId
 *         in: formData
 *         required: true
 *       - name: brandId
 *         description: brandId
 *         in: formData
 *         required: true
 *       - name: offerImage
 *         description: offerImage
 *         in: formData
 *         required: true
 *       - name: discount
 *         description: discount
 *         in: formData
 *         required: false
 *       - name: aed
 *         description: aed
 *         in: formData
 *         required: false
 *       - name: oldPrice
 *         description: oldPrice
 *         in: formData
 *         required: false
 *       - name: newPrice
 *         description: newPrice
 *         in: formData
 *         required: false
 *       - name: Buy
 *         description: Buy
 *         in: formData
 *         required: false
 *       - name: Get
 *         description: Get
 *         in: formData
 *         required: false
 *       - name: otherItemName
 *         description: otherItemName
 *         in: formData
 *         required: false
 *       - name: category
 *         description: category
 *         in: formData
 *         required: false
 *       - name: subCategory
 *         description: subCategory
 *         in: formData
 *         required: false
 *       - name: brand
 *         description: brand
 *         in: formData
 *         required: false
 *       - name: image
 *         description: image
 *         in: formData
 *         required: false
 *    responses:
 *       200:
 *         description: Offer has been added successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */
router.post('/offer', auth.verifyToken, vendorController.addOffer)


/**
 * @swagger
 * /api/v1/vendor/offer:
 *   put:
 *     tags:
 *       - VENDOR
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
 *         in: header
 *         required: true
 *       - name: itemName
 *         description: itemName      
 *         in: formData
 *         required: false
 *       - name: catgeoryId
 *         description: catgeoryId
 *         in: formData
 *         required: false
 *       - name: subCategoryId
 *         description: subCategoryId
 *         in: formData
 *         required: false
 *       - name: brandId
 *         description: brandId
 *         in: formData
 *         required: false
 *       - name: offerImage
 *         description: offerImage
 *         in: formData
 *         required: false
 *       - name: discount
 *         description: discount
 *         in: formData
 *         required: false
 *       - name: aed
 *         description: aed
 *         in: formData
 *         required: false
 *       - name: oldPrice
 *         description: oldPrice
 *         in: formData
 *         required: false
 *       - name: newPrice
 *         description: newPrice
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */
router.put('/offer', auth.verifyToken, vendorController.editOffer)


/**
 * @swagger
 * /api/v1/vendor/offer/{offerId}:
 *   get:
 *     tags:
 *       - VENDOR
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
router.get('/offer/:offerId', auth.verifyToken, vendorController.viewOffer)

/**
 * @swagger
 * /api/v1/vendor/offer:
 *   delete:
 *     tags:
 *       - VENDOR
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
 *         in: path
 *         required: true     
 *     responses:
 *       200:
 *         description: Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/offer', auth.verifyToken, vendorController.deactivateOffer)

/**
 * @swagger
 * /api/v1/vendor/editItem:
 *  put:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: offerId
 *         description: offerId
 *         in: formData
 *         required: true
 *       - name: otherItemName
 *         description: otherItemName
 *         in: formData
 *         required: true
 *       - name: category
 *         description: category
 *         in: formData
 *         required: true
 *       - name: subCategory
 *         description: subCategory
 *         in: formData
 *         required: true
 *       - name: brand
 *         description: brand
 *         in: formData
 *         required: true
 *       - name: image
 *         description: image
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
router.put('/editItem', auth.verifyToken, vendorController.editItem)

/**
 * @swagger
 * /api/v1/vendor/offerList:
 *   post:
 *     tags:
 *       - VENDOR
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

router.post('/offerList', auth.verifyToken, vendorController.offerList)

/**
 * @swagger
 * /api/v1/vendor/promotion:
 *   delete:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: promotionId
 *         description: promotionId
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

router.delete('/promotion', auth.verifyToken, vendorController.deactivatePromotion)

/**
 * @swagger
 * /api/v1/vendor/promotionList:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: search
 *         description: search
 *         in: formData
 *         required: false
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

router.post('/promotionList', auth.verifyToken, vendorController.promotionList)

/**
 * @swagger
 * /api/v1/vendor/subAdmin:
 *  post:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: userName
 *         description: userName
 *         in: formData
 *         required: true
 *       - name: fullName
 *         description: fullName
 *         in: formData
 *         required: true
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *       - name: designation
 *         description: designation
 *         in: formData
 *         required: true
 *       - name: department
 *         description: department
 *         in: formData
 *         required: true
 *       - name: company
 *         description: company
 *         in: formData
 *         required: true
 *       - name: branch
 *         description: branch
 *         in: formData
 *         required: true
 *       - name: city
 *         description: city
 *         in: formData
 *         required: true
 *       - name: country
 *         description: country
 *         in: formData
 *         required: true
 *       - name: profilePic
 *         description: profilePic
 *         in: formData
 *         required: false
 *       - name: assignRole
 *         description: assignRole
 *         in: formData
 *         required: false
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Sub-admin has been created successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/subAdmin', auth.verifyToken, vendorController.addSubAdmin)

/**
 * @swagger
 * /api/v1/vendor/subAdmin/{subAdminId}:
 *   get:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: subAdminId
 *         description: subAdminId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Details have been fetched successfully
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */

router.get('/subAdmin/:subAdminId', auth.verifyToken, vendorController.viewSubAdmin)

/**
 * @swagger
 * /api/v1/vendor/subAdmin:
 *  put:
 *    tags:
 *       - VENDOR
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: subAdminId
 *         description: subAdminId
 *         in: formData
 *         required: true
 *       - name: fullName
 *         description: fullName
 *         in: formData
 *         required: false
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *       - name: designation
 *         description: designation
 *         in: formData
 *         required: false
 *       - name: department
 *         description: department
 *         in: formData
 *         required: false
 *       - name: company
 *         description: company
 *         in: formData
 *         required: false
 *       - name: branch
 *         description: branch
 *         in: formData
 *         required: false
 *       - name: city
 *         description: city
 *         in: formData
 *         required: false
 *       - name: country
 *         description: country
 *         in: formData
 *         required: false
 *       - name: profilePic
 *         description: profilePic
 *         in: formData
 *         required: false
 *       - name: assignRole
 *         description: assignRole
 *         in: formData
 *         required: false
 *       - name: password
 *         description: password
 *         in: formData
 *         required: false
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/subAdmin', auth.verifyToken, vendorController.editSubAdmin)

/**
 * @swagger
 * /api/v1/vendor/subAdmin:
 *   delete:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: subAdminId
 *         description: subAdminId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deactivated.
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */

router.delete('/subAdmin', auth.verifyToken, vendorController.deleteSubAdmin)

/**
 * @swagger
 * /api/v1/vendor/subAdminList:
 *   post:
 *     tags:
 *       - VENDOR
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: search
 *         description: search
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
 *         description: Requested data found
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */

router.post('/subAdminList', auth.verifyToken, vendorController.subAdminList)

/**
* @swagger
* /api/v1/vendor/dashboard:
*   get:
*     tags:
*       - VENDOR
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*     responses:
*       200:
*         description: Details have been fetched successfully.
*       404:
*         description: Requested data not found.
*       500:
*         description: Internal Server Error.
*/
router.get('/dashboard', auth.verifyToken, vendorController.dashboard);

module.exports = router;

