const express = require('express')
const router = express.Router()
const adminController = require("../../controllers/adminController");
const auth = require('../../middleware/auth');

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/login', adminController.login)

/**
 * @swagger
 * /api/v1/admin/forgotPassword:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/forgotPassword', adminController.forgotPassword)

/**
 * @swagger
 * /api/v1/admin/otpVerify:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/otpVerify', adminController.otpVerify)

/**
 * @swagger
 * /api/v1/admin/resendOTP:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/resendOTP', adminController.resendOTP)

/**
 * @swagger
 * /api/v1/admin/resetPassword:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/resetPassword', adminController.resetPassword)

/**
 * @swagger
 * /api/v1/admin/profile:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/profile', auth.verifyToken, adminController.myProfile)

/**
 * @swagger
 * /api/v1/admin/profile:
 *   put:
 *     tags:
 *       - ADMIN
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: firstName
 *         description: firstName
 *         in: formData
 *         required: false
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
 *       - name: oldPassword
 *         description: oldPassword
 *         in: formData
 *         required: false
 *       - name: newPassword
 *         description: newPassword
 *         in: formData
 *         required: false
 *       - name: profilePic
 *         description: profilePic
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Your profile detail has been updated sucessfully
 *       404:
 *         description: This user does not exist
 *       500:
 *         description: Internal Server Error
 */

router.put('/profile', auth.verifyToken, adminController.editProfile)

/**
 * @swagger
 * /api/v1/admin/consumer:
 *  post:
 *    tags:
 *       - CONSUMER (USER MANAGEMENT - ENDUSER)
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: consumer
 *         description: Create new consumer.
 *         schema:
 *           type: object
 *           required:
 *             - consumerId
 *           properties:
 *             consumerId:
 *               type: string
 *             registrationDate:
 *               type: string
 *             status:
 *               type: string
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
 *             password:
 *               type: string
 *             dateOfBirth:
 *               type: string
 *             gender:
 *               type: string
 *             nationality:
 *               type: string
 *             language:
 *               type: string
 *             myLocations:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 poBox:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 coordinates:
 *                   type: array
 *                   items:
 *                    type: integer
 *             myInterests:
 *               type: string
 *             mySocialAccounts:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 Type:
 *                   type: string
 *                 url:
 *                   type: string
 *             company:
 *               type: string
 *             designation:
 *               type: string
 *             education:
 *               type: string
 *             university:
 *               type: string
 *             relationshipStatus:
 *               type: string
 *             spouseName:
 *               type: string
 *             spouseMobile:
 *               type: string
 *             spouseEmail:
 *               type: string
 *             skills:
 *               type: string
 *             accomplishment:
 *               type: string
 *             groups:
 *               type: string
 *             friends:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 friendName:
 *                   type: string
 *                 friendMobile:
 *                   type: string
 *                 friendEmail:
 *                   type: string
 *             validIdType:
 *               type: string
 *             idNumber:
 *               type: string
 *             idExpiry:
 *               type: string
 *             alerts:
 *               type: string
 *             favourites:
 *               type: string
 *             myList:
 *               type: string
 *             cardsHolder:
 *               type: string
 *             specialComments:
 *               type: string
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

router.post('/consumer', auth.verifyToken, adminController.addConsumer)

/**
 * @swagger
 * /api/v1/admin/consumer/{_id}:
 *   get:
 *     tags:
 *       - CONSUMER (USER MANAGEMENT - ENDUSER)
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

router.get('/consumer/:_id', auth.verifyToken, adminController.viewConsumer)

/**
 * @swagger
 * /api/v1/admin/consumer:
 *  put:
 *    tags:
 *       - CONSUMER (USER MANAGEMENT - ENDUSER)
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: consumer
 *         description: Update consumer.
 *         schema:
 *           type: object
 *           required:
 *             - _id
 *           properties:
 *             _id:
 *               type: string
 *             status:
 *               type: string
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
 *             dateOfBirth:
 *               type: string
 *             gender:
 *               type: string
 *             nationality:
 *               type: string
 *             language:
 *               type: string
 *             myLocations:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 poBox:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 city:
 *                   type: string
 *                 coordinates:
 *                   type: array
 *                   items:
 *                    type: integer
 *             myInterests:
 *               type: string
 *             mySocialAccounts:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 Type:
 *                   type: string
 *                 url:
 *                   type: string
 *             company:
 *               type: string
 *             designation:
 *               type: string
 *             education:
 *               type: string
 *             university:
 *               type: string
 *             relationshipStatus:
 *               type: string
 *             spouseName:
 *               type: string
 *             spouseMobile:
 *               type: string
 *             spouseEmail:
 *               type: string
 *             skills:
 *               type: string
 *             accomplishment:
 *               type: string
 *             groups:
 *               type: string
 *             friends:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 friendName:
 *                   type: string
 *                 friendMobile:
 *                   type: string
 *                 friendEmail:
 *                   type: string
 *             validIdType:
 *               type: string
 *             idNumber:
 *               type: string
 *             idExpiry:
 *               type: string
 *             alerts:
 *               type: string
 *             favourites:
 *               type: string
 *             myList:
 *               type: string
 *             cardsHolder:
 *               type: string
 *             specialComments:
 *               type: string
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
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/consumer', adminController.editConsumer)

/**
 * @swagger
 * /api/v1/admin/consumer:
 *   delete:
 *     tags:
 *       - CONSUMER (USER MANAGEMENT - ENDUSER)
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

router.delete('/consumer', auth.verifyToken, adminController.deactivateConsumer)

/**
 * @swagger
 * /api/v1/admin/consumerList:
 *   post:
 *     tags:
 *       - CONSUMER (USER MANAGEMENT - ENDUSER)
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

router.post('/consumerList', auth.verifyToken, adminController.consumerList)

/**
 * @swagger
 * /api/v1/admin/vendor:
 *  post:
 *    tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: vendor
 *         description: Create new vendor.
 *         schema:
 *           type: object
 *           required:
 *             - businessId
 *           properties:
 *             businessId:
 *               type: string
 *             registrationDate:
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
 *             password:
 *               type: string
 *             designation:
 *               type: string
 *             locationName:
 *               type: string
 *             address:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             lat:
 *               type: integer
 *             long:
 *               type: integer
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
 *         description: Vendor has been added successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/vendor', auth.verifyToken, adminController.addVendor)

/**
 * @swagger
 * /api/v1/admin/vendor/{vendorId}:
 *   get:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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

router.get('/vendor/:vendorId', auth.verifyToken, adminController.viewVendor)

/**
 * @swagger
 * /api/v1/admin/vendor:
 *  put:
 *    tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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
 *             locationName:
 *               type: string
 *             address:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             lat:
 *               type: integer
 *             long:
 *               type: integer
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

router.put('/vendor', auth.verifyToken, adminController.editVendor)

/**
 * @swagger
 * /api/v1/admin/branch:
 *  post:
 *    tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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
 *             poBox:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             lat:
 *               type: integer
 *             long:
 *               type: integer
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
 *         description: Branch has been added successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/branch', auth.verifyToken, adminController.addBranch)

/**
 * @swagger
 * /api/v1/admin/branch:
 *  put:
 *    tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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
 *             poBox:
 *               type: string
 *             country:
 *               type: string
 *             state:
 *               type: string
 *             city:
 *               type: string
 *             lat:
 *               type: integer
 *             long:
 *               type: integer
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

router.put('/branch', auth.verifyToken, adminController.editBranch)

/**
 * @swagger
 * /api/v1/admin/branch/{_id}:
 *   get:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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

router.get('/branch/:_id', auth.verifyToken, adminController.viewBranch)

/**
 * @swagger
 * /api/v1/admin/branch:
 *   delete:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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

router.delete('/branch', auth.verifyToken, adminController.deactivateBranch)

/**
 * @swagger
 * /api/v1/admin/branchList:
 *   post:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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

router.post('/branchList', auth.verifyToken, adminController.branchList)

/**
 * @swagger
 * /api/v1/admin/vendor:
 *   delete:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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
 *         description: Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/vendor', auth.verifyToken, adminController.deactivateVendor)

/**
 * @swagger
 * /api/v1/admin/vendorList:
 *   post:
 *     tags:
 *       - VENDORS (USER MANAGEMENT - VENDOR USER)
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

router.post('/vendorList', auth.verifyToken, adminController.vendorList)


/**
 * @swagger
 * /api/v1/admin/subAdmin:
 *  post:
 *    tags:
 *       - ADMIN
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

router.post('/subAdmin', auth.verifyToken, adminController.addSubAdmin)

/**
 * @swagger
 * /api/v1/admin/subAdmin/{subAdminId}:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/subAdmin/:subAdminId', auth.verifyToken, adminController.viewSubAdmin)

/**
 * @swagger
 * /api/v1/admin/subAdmin:
 *  put:
 *    tags:
 *       - ADMIN
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

router.put('/subAdmin', auth.verifyToken, adminController.editSubAdmin)

/**
 * @swagger
 * /api/v1/admin/subAdmin:
 *   delete:
 *     tags:
 *       - ADMIN
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

router.delete('/subAdmin', auth.verifyToken, adminController.deleteSubAdmin)

/**
 * @swagger
 * /api/v1/admin/subAdminList:
 *   post:
 *     tags:
 *       - ADMIN
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

router.post('/subAdminList', auth.verifyToken, adminController.subAdminList)

/**
 * @swagger
 * /api/v1/admin/promotion:
 *  post:
 *    tags:
 *       - PROMOTIONS-YNOT
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: promotion
 *         description: Add new promotion.
 *         schema:
 *           type: object
 *           required:
 *             - promotionName
 *           properties:
 *             promotionName:
 *               type: string
 *             branches:
 *               type: array
 *               items:
 *                type: string
 *             fromDate:
 *               type: string
 *             toDate:
 *               type: string
 *             occasion:
 *               type: string
 *             specialTermsConditions:
 *               type: string
 *    responses:
 *       200:
 *         description: Promotion has been added successfully.
 *       404:
 *         description: Promotion name already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/promotion', auth.verifyToken, adminController.addPromotion)

/**
 * @swagger
 * /api/v1/admin/promotion/{promotionId}:
 *   get:
 *     tags:
 *       - PROMOTIONS-YNOT
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

router.get('/promotion/:promotionId', auth.verifyToken, adminController.viewPromotion)

/**
 * @swagger
 * /api/v1/admin/offer:
 *  post:
 *    tags:
 *       - PROMOTIONS-YNOT
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

router.post('/offer', auth.verifyToken, adminController.addOffer)

/**
 * @swagger
 * /api/v1/admin/offer/{offerId}:
 *   get:
 *     tags:
 *       - PROMOTIONS-YNOT
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

router.get('/offer/:offerId', auth.verifyToken, adminController.viewOffer)

/**
 * @swagger
 * /api/v1/admin/promotion:
 *  put:
 *    tags:
 *       - PROMOTIONS-YNOT
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: promotion
 *         description: Update promotion.
 *         schema:
 *           type: object
 *           required:
 *             - promotionId
 *             - promotionName
 *           properties:
 *             promotionId:
 *               type: string
 *             promotionName:
 *               type: string
 *             branches:
 *               type: array
 *               items:
 *                type: string
 *             fromDate:
 *               type: string
 *             toDate:
 *               type: string
 *             occasion:
 *               type: string
 *             specialTermsConditions:
 *               type: string
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/promotion', auth.verifyToken, adminController.editPromotion)

/**
 * @swagger
 * /api/v1/admin/offer:
 *  put:
 *    tags:
 *       - PROMOTIONS-YNOT
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
 *       - name: Buy
 *         description: Buy
 *         in: formData
 *         required: false
 *       - name: Get
 *         description: Get
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

router.put('/offer', auth.verifyToken, adminController.editOffer)

/**
 * @swagger
 * /api/v1/admin/editItem:
 *  put:
 *    tags:
 *       - PROMOTIONS-YNOT
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

router.put('/editItem', auth.verifyToken, adminController.editItem)

/**
 * @swagger
 * /api/v1/admin/offer:
 *   delete:
 *     tags:
 *       - PROMOTIONS-YNOT
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
 *     responses:
 *       200:
 *         description: Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/offer', auth.verifyToken, adminController.deactivateOffer)

/**
 * @swagger
 * /api/v1/admin/offerList:
 *   post:
 *     tags:
 *       - PROMOTIONS-YNOT
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
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/offerList', auth.verifyToken, adminController.offerList)

/**
 * @swagger
 * /api/v1/admin/promotion:
 *   delete:
 *     tags:
 *       - PROMOTIONS-YNOT
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

router.delete('/promotion', auth.verifyToken, adminController.deactivatePromotion)

/**
 * @swagger
 * /api/v1/admin/promotionList:
 *   post:
 *     tags:
 *       - PROMOTIONS-YNOT
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

router.post('/promotionList', auth.verifyToken, adminController.promotionList)

/**
 * @swagger
 * /api/v1/admin/viewActivity/{activityId}:
 *   get:
 *     tags:
 *       - USER ACTIVITY LOG
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: activityId
 *         description: activityId
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

router.get('/viewActivity/:activityId', auth.verifyToken, adminController.viewActivity)

/**
 * @swagger
 * /api/v1/admin/activityList:
 *   post:
 *     tags:
 *       - USER ACTIVITY LOG
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
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

router.post('/activityList', auth.verifyToken, adminController.activityList)

/**
 * @swagger
 * /api/v1/admin/logout:
 *   get:
 *     tags:
 *       - ADMIN
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
 *         description: Logout successful.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/logout', auth.verifyToken, adminController.logout)

/**
 * @swagger
 * /api/v1/admin/getTotalCount:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/getTotalCount', auth.verifyToken, adminController.getTotalCount)

/**
 * @swagger
 * /api/v1/admin/consumer24hrs:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/consumer24hrs', auth.verifyToken, adminController.consumer24hrs)

/**
 * @swagger
 * /api/v1/admin/offerCount:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/offerCount', auth.verifyToken, adminController.offerCount)

/**
 * @swagger
 * /api/v1/admin/offer24hrs:
 *   get:
 *     tags:
 *       - ADMIN
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

router.get('/offer24hrs', auth.verifyToken, adminController.offer24hrs)

router.get('/offerDeactivated24hrs', auth.verifyToken, adminController.offerDeactivated24hrs)

/**
* @swagger
* /api/v1/admin/dashboard:
*   get:
*     tags:
*       - ADMIN
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
router.get('/dashboard', auth.verifyToken, adminController.dashboard);
router.post('/graphData', adminController.graphData);


module.exports = router;
