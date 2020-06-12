 const router = require('express').Router();
 const userController = require('../../controllers/userController');
 const auth = require('../../middleware/auth');
 
 
/**
 * @swagger
 * /api/v1/user/signUp:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *       - name: language
 *         description: language
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Thanks, You have successfully signed up.
 *       404:
 *         description: This mobile number already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/signUp', userController.signUp)

/**
 * @swagger
 * /api/v1/user/addCardHolder:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: frontSide
 *         description: frontSide
 *         in: formData
 *         required: true
 *       - name: backSide
 *         description: backSide
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Card has been added successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/addCardHolder', auth.verifyToken, userController.addCardHolder)

/**
 * @swagger
 * /api/v1/user/viewCardHolder/{cardId}:
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
 *       - name: cardId
 *         description: cardId
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

router.get('/viewCardHolder/:cardId', auth.verifyToken, userController.viewCardHolder)

/**
 * @swagger
 * /api/v1/user/deleteCardHolder:
 *   delete:
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
 *       - name: cardId
 *         description: cardId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/deleteCardHolder', auth.verifyToken, userController.deleteCardHolder)

/**
 * @swagger
 * /api/v1/user/cardList:
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

router.get('/cardList', auth.verifyToken, userController.cardList)

/**
 * @swagger
 * /api/v1/user/addAlert:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: alert
 *         description: alert
 *         in: formData
 *         required: true
 *    responses:
 *       200:
 *         description: Alert has been added successfully.
 *       404:
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/addAlert', auth.verifyToken, userController.addAlert)

/**
 * @swagger
 * /api/v1/user/deleteAlert:
 *   delete:
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
 *       - name: alertId
 *         description: alertId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/deleteAlert', auth.verifyToken, userController.deleteAlert)

/**
 * @swagger
 * /api/v1/user/alertList:
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

router.get('/alertList', auth.verifyToken, userController.alertList)

router.get('/similarShops/:_id', auth.verifyToken, userController.similarShops)

router.get('/offerBooks', auth.verifyToken, userController.offerBooks)

/**
 * @swagger
 * /api/v1/user/addSmartList:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: smartList
 *         description: Create smart list.
 *         schema:
 *           type: object
 *           required:
 *             - smartList
 *           properties:
 *             smartList:
 *               type: array
 *               items:
 *                type: string
 *    responses:
 *       200:
 *         description: Data is saved successfully.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/addSmartList', auth.verifyToken, userController.addSmartList)

/**
 * @swagger
 * /api/v1/user/deleteSmartList:
 *   delete:
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
 *       - name: smartId
 *         description: smartId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/deleteSmartList', auth.verifyToken, userController.deleteSmartList)

router.put('/editSmartList', auth.verifyToken, userController.editSmartList)

router.post('/addInterest', auth.verifyToken, userController.addInterest)

router.put('/deleteInterest', auth.verifyToken, userController.deleteInterest)

router.post('/interestList', auth.verifyToken, userController.interestList)

router.post('/addLocation', auth.verifyToken, userController.addLocation)

router.post('/addSocialLink', auth.verifyToken, userController.addSocialLink)

router.put('/deleteSocialList', auth.verifyToken, userController.deleteSocialLink)

router.post('/socialLinkList',auth.verifyToken,userController.socialLinkList)


/**
 * @swagger
 * /api/v1/user/userCount:
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
router.get('/userCount', userController.userCount)

/**
 * @swagger
 * /api/v1/user/numberOfTeamMember:
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
router.get('/numberOfTeamMember', userController.numberOfTeamMember)

/**
 * @swagger
 * /api/v1/user/offerCount:
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

router.get('/offerCount', userController.offerCount)


/**
 * @swagger
 * /api/v1/user/reviewCount:
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
router.get('/reviewCount', userController.reviewCount)


/**
 * @swagger
 * /api/v1/user/videosCount:
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
router.get('/videoCount', userController.videoCount)

/**
 * @swagger
 * /api/v1/user/getShopList:
 *   post:
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
 *       - name: lat
 *         description: lat
 *         in: formData
 *         required: true
 *       - name: long
 *         description: long
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

router.post('/getShopList', auth.verifyToken, userController.getShopList)

/**
 * @swagger
 * /api/v1/user/viewShop/{_id}:
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

router.get('/viewShop/:_id', auth.verifyToken, userController.viewShop)

/**
 * @swagger
 * /api/v1/user/notificationList:
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

router.get('/notificationList', auth.verifyToken, userController.notificationList)

/**
 * @swagger
 * /api/v1/user/otpVerify:
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
 *       - name: otp
 *         description: otp
 *         in: header
 *         required: true   
 *     responses:
 *       200:
 *         description: otp verified.
 *       404: 
 *         description: invalid otp.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/otpVerify', auth.verifyToken, userController.otpVerify)

/**
 * @swagger
 * /api/v1/user/otpVerify:
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
 *         description: otp sent.
 *       404: 
 *         description: user not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/resendOTP', auth.verifyToken, userController.resendOTP)

/**
 * @swagger
 * /api/v1/user/getProfile:
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
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: This user does not exist.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/getProfile', auth.verifyToken, userController.getProfile)

/**
 * @swagger
 * /api/v1/user/editProfile:
 *  put:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: language
 *         description: language
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true 
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: This vendor does not exist.
 *       500:
 *         description: Internal Server Error.   
 */
router.get('/editProfile', auth.verifyToken, userController.editProfile)


/**
 * @swagger
 * /api/v1/user/contactUs:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId
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
 *       - name: message
 *         description: message
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully added.
 *       404:
 *         description: Requested data not found.
 *       500:    
 *         description: Internal Server Error.
 */

router.post('/contactUs', userController.contactUs)

/**
* @swagger
* /api/v1/user/addFeature:
*   post:
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
*       - name: video
*         description: video
*         in: formData
*         required: true
*       - name: featureName
*         description: featureName
*         in: formData
*         required: true 
*       - name: description
*         description: description
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Data is saved successfully.
*       500:
*         description: Internal Server Error.
*/

router.post('/addFeature', auth.verifyToken, userController.addFeature)

/**
 * @swagger
 * /api/v1/user/viewFeature/{featureId}:
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
 *       - name: featureId
 *         description: featureId
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

router.get('/viewFeature/:featureId', auth.verifyToken, userController.viewFeature)

/**
 * @swagger
 * /api/v1/user/deletefeature:
 *   delete:
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
 *       - name: featureId
 *         description: featureId
 *         in: formData
 *         required: true
 *       
 *     responses:
 *       200:
 *         description: Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/deletefeature', auth.verifyToken, userController.deletefeature)

/**
 * @swagger
 * /api/v1/user/featureList:
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

router.post('/featureList', auth.verifyToken, userController.featureList)

/**
 * @swagger
 * /api/v1/user/volunteerSignup:
 *  post:
 *    tags:
 *       - USER
 *    produces:
 *      - application/json
 *    parameters:
 *       - in: body
 *         name: volunteer
 *         description: Volunteer signup.
 *         schema:
 *           type: object
 *           required:
 *             - firstName
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             mobileNumber:
 *               type: string
 *             email:
 *               type: string
 *             company:
 *               type: string
 *             city:
 *               type: string
 *             location:
 *               type: string
 *             sales:
 *               type: boolean
 *             marketing:
 *               type: boolean
 *             coding:
 *               type: boolean
 *             designing:
 *               type: boolean
 *             admin:
 *               type: boolean
 *             paperWork:
 *               type: boolean
 *             goodHandWork:
 *               type: boolean
 *             creativeMind:
 *               type: boolean
 *             teamLeader:
 *               type: boolean
 *             goodOrganizer:
 *               type: boolean
 *             haveMelodiousVoice:
 *               type: boolean
 *             haveLoudVoice:
 *               type: boolean
 *             volunteeredIn:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 event:
 *                   type: string
 *                 yearMonth:
 *                   type: string
 *                 anySpecifics:
 *                   type: string
 *    responses:
 *       200:
 *         description: Thanks, You have successfully signed up.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/volunteerSignup', userController.volunteerSignup)


/**
 * @swagger
 * /api/v1/user/promotionList:
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
router.get('/promotionList', auth.verifyToken, userController.promotionList)



/**
 * @swagger
 * /api/v1/user/offerList:
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
router.get('/offerList', auth.verifyToken, userController.offerList)

router.post('/locationSearch', auth.verifyToken, userController.locationSearch)

/**
 * @swagger
 * /api/v1/user/addToFavourite:
 *  post:
 *    tags:
 *       - USER
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
 *    responses:
 *       200:
 *         description: Offer has been added to favourites list successfully.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/addToFavourite', auth.verifyToken, userController.addToFavourite)

/**
 * @swagger
 * /api/v1/user/deleteFavourite:
 *   delete:
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
 *       - name: favouriteId
 *         description: favouriteId
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/deleteFavourite', auth.verifyToken, userController.deleteFavourite)

/**
 * @swagger
 * /api/v1/user/favouriteList:
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

router.get('/favouriteList', auth.verifyToken, userController.favouriteList)

router.post('/locationSearch', userController.locationSearch)



module.exports = router;
