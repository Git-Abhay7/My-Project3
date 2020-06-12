const express = require('express')
const router = express.Router()
const notificationController = require("../../controllers/notificationController");
const auth = require('../../middleware/auth');


/**
 * @swagger
 * /api/v1/notification/addNotification:
 *   post:
 *     tags:
 *       - NOTIFICATION-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: isPushNotification
 *         description: isPushNotification
 *         in: formData
 *         required: true
 *       - name: isOpportunityBar
 *         description: isOpportunityBar
 *         in: formData
 *         required: true
 *       - name: isPopUpMessage
 *         description: isPopUpMessage
 *         in: formData
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *       - name: frequency
 *         description: frequency
 *         in: formData
 *         required: true
 *       - name: frequencyTime
 *         description: frequenyTime
 *         in: formData
 *         required: true
 *       - name: broadcastFrom
 *         description: broadcastFrom
 *         in: formData
 *         required: true
 *       - name: broadcastTo
 *         description: broadcastTo
 *         in: formData
 *         required: true
 *       - name: sharedWith
 *         description: sharedWith
 *         in: formData
 *         required: true
 *       - name: condition
 *         description: condition
 *         in: formData
 *         required: true
 *       - name: linkTo
 *         description: linkTo
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Notification has been added successfully.
 *       404:
 *         description: This title already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/addNotification', auth.verifyToken, notificationController.addNotification)

/**
 * @swagger
 * /api/v1/notification/notification/{notificationId}:
 *   get:
 *     tags:
 *       - NOTIFICATION-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: notificationId
 *         description: notificationId
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

router.get('/notification/:notificationId', auth.verifyToken, notificationController.viewNotification)

/**
 * @swagger
 * /api/v1/notification/notification:
 *   put:
 *     tags:
 *       - NOTIFICATION-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: notificationId
 *         description: notificationId
 *         in: formData
 *         required: true
 *       - name: isPushNotification
 *         description: isPushNotification
 *         in: formData
 *         required: false
 *       - name: isOpportunityBar
 *         description: isOpportunityBar
 *         in: formData
 *         required: false
 *       - name: isPopUpMessage
 *         description: isPopUpMessage
 *         in: formData
 *         required: false
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
 *         in: formData
 *         required: false
 *       - name: frequency
 *         description: frequency
 *         in: formData
 *         required: false
 *       - name: frequencyTime
 *         description: frequenyTime
 *         in: formData
 *         required: false
 *       - name: broadcastFrom
 *         description: broadcastFrom
 *         in: formData
 *         required: false
 *       - name: broadcastTo
 *         description: broadcastTo
 *         in: formData
 *         required: false
 *       - name: sharedWith
 *         description: sharedWith
 *         in: formData
 *         required: false
 *       - name: condition
 *         description: condition
 *         in: formData
 *         required: false
 *       - name: linkTo
 *         description: linkTo
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/notification', auth.verifyToken, notificationController.editNotification)

/**
 * @swagger
 * /api/v1/notification/notification:
 *   delete:
 *     tags:
 *       - NOTIFICATION-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: notificationId
 *         description: notificationId
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

router.delete('/notification', auth.verifyToken, notificationController.deactivateNotification)

/**
 * @swagger
 * /api/v1/notification/notificationList:
 *   post:
 *     tags:
 *       - NOTIFICATION-MANAGEMENT
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
 *       - name: title
 *         description: title
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

router.post('/notificationList', auth.verifyToken, notificationController.notificationList)


module.exports = router;
