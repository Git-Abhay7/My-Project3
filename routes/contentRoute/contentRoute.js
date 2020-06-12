const express = require('express')
const router = express.Router()
const contentController = require("../../controllers/contentController");
const auth = require('../../middleware/auth');


/**
 * @swagger
 * /api/v1/content/contentList:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.get('/contentList', auth.verifyToken, contentController.contentList)

/**
 * @swagger
 * /api/v1/content/staticContent/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/staticContent/:id', auth.verifyToken, contentController.viewStaticContent)

/**
 * @swagger
 * /api/v1/content/staticContent:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
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

router.put('/staticContent', auth.verifyToken, contentController.editStaticContent)

/**
 * @swagger
 * /api/v1/content/contract:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
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
 *       - name: document
 *         description: document
 *         in: formData
 *         required: true 
 *     responses:
 *       200:
 *         description: contract added successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/contract', auth.verifyToken, contentController.addContract)

/**
 * @swagger
 * /api/v1/content/contract:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
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
 *       - name: document
 *         description: document
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

router.put('/contract', auth.verifyToken, contentController.editContract)

/**
 * @swagger
 * /api/v1/content/contract/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/contract/:id', auth.verifyToken, contentController.viewContract)

/**
 * @swagger
 * /api/v1/content/contract:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.delete('/contract', auth.verifyToken, contentController.deactivateContract)

/**
 * @swagger
 * /api/v1/content/contractList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/contractList', auth.verifyToken, contentController.contractList)

/**
 * @swagger
 * /api/v1/content/faq:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: question
 *         description: question
 *         in: formData
 *         required: true
 *       - name: answer
 *         description: answer
 *         in: formData
 *         required: true
 *       - name: video
 *         description: video
 *         in: formData   
 *         required: true
 *     responses:
 *       200:
 *         description: added  successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/faq', auth.verifyToken, contentController.addFaq)

/**
 * @swagger
 * /api/v1/content/faq:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: answer
 *         description: answer
 *         in: formData
 *         required: true
 *       
 *     responses:
 *       200:
 *         description:  Successfully updated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/faq', auth.verifyToken, contentController.editFaq)

/**
 * @swagger
 * /api/v1/content/faq:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       
 *     responses:
 *       200:
 *         description:  Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/faq', auth.verifyToken, contentController.deactivateFaq)

/**
 * @swagger
 * /api/v1/content/faqList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.    
 */

router.post('/faqList', auth.verifyToken, contentController.faqList)

/**
 * @swagger
 * /api/v1/content/news:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
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
 *       - name: document
 *         description: document
 *         in: formData
 *         required: true   
 *     responses:
 *       200:
 *         description: News added successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/news', auth.verifyToken, contentController.addNews)

/**
 * @swagger
 * /api/v1/content/news:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: false
 *       - name: description
 *         description: description
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
 *       - name: document
 *         description: document
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

router.put('/news', auth.verifyToken, contentController.editNews)

/**
 * @swagger
 * /api/v1/content/news/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/news/:id', auth.verifyToken, contentController.viewNews)

/**
 * @swagger
 * /api/v1/content/news:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.delete('/news', auth.verifyToken, contentController.deactivateNews)

/**
 * @swagger
 * /api/v1/content/newsList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/newsList', auth.verifyToken, contentController.newsList)

/**
 * @swagger
 * /api/v1/content/event:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
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
 *       - name: document
 *         description: document
 *         in: formData
 *         required: true   
 *     responses:
 *       200:
 *         description: Event added successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/event', auth.verifyToken, contentController.addEvent)

/**
* @swagger
* /api/v1/content/event:
*   put:
*     tags:
*       - CONTENT-MANAGEMENT
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
*         in: formData
*         required: true
*       - name: title
*         description: title
*         in: formData
*         required: false
*       - name: description
*         description: description
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
*       - name: document
*         description: document
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

router.put('/event', auth.verifyToken, contentController.editEvent)

/**
 * @swagger
 * /api/v1/content/event/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/event/:id', auth.verifyToken, contentController.viewEvent)

/**
 * @swagger
 * /api/v1/content/event:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       
 *     responses:
 *       200:
 *         description:  Successfully deactivated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/event', auth.verifyToken, contentController.deactivateEvent)

/**
 * @swagger
 * /api/v1/content/eventList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/eventList', auth.verifyToken, contentController.eventList)

/**
 * @swagger
 * /api/v1/content/photo:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: image
 *         description: image
 *         in: formData
 *         required: true
 *      
 *     responses:
 *       200:
 *         description: contract added successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/photo', auth.verifyToken, contentController.addPhoto)

/**
 * @swagger
 * /api/v1/content/photo/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/photo/:id', auth.verifyToken, contentController.viewPhoto)

/**
* @swagger
* /api/v1/content/photo:
*   put:
*     tags:
*       - CONTENT-MANAGEMENT
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
*         in: formData
*         required: true
*       - name: image
*         description: image
*         in: formData
*         required: true
*            
*     responses:
*       200:
*         description: Successfully updated.
*       404: 
*         description: Requested data not found.
*       500:
*         description: Internal Server Error.
*/

router.put('/photo', auth.verifyToken, contentController.editPhoto)

/**
 * @swagger
 * /api/v1/content/photo:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.delete('/photo', auth.verifyToken, contentController.deactivatePhoto)

/**
 * @swagger
 * /api/v1/content/photoList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/photoList', auth.verifyToken, contentController.photoList)

/**
* @swagger
* /api/v1/content/video:
*   post:
*     tags:
*       - CONTENT-MANAGEMENT
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
*            
*     responses:
*       200:
*         description: added successfully.
*       404: 
*         description: Requested data not found.
*       500:
*         description: Internal Server Error.
*/

router.post('/video', auth.verifyToken, contentController.addVideo)

/**
* @swagger
* /api/v1/content/video:
*   put:
*     tags:
*       - CONTENT-MANAGEMENT
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
*         in: formData
*         required: true
*       - name: video
*         description: video
*         in: formData
*         required: true
*            
*     responses:
*       200:
*         description: Successfully updated.
*       404: 
*         description: Requested data not found.
*       500:
*         description: Internal Server Error.
*/

router.put('/video', auth.verifyToken, contentController.editVideo)

/**
 * @swagger
 * /api/v1/content/video/{id}:
 *   get:   
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/video/:id', auth.verifyToken, contentController.viewVideo)

/**
 * @swagger
 * /api/v1/content/video:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.delete('/video', auth.verifyToken, contentController.deactivateVideo)

/**
 * @swagger
 * /api/v1/content/videoList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/videoList', auth.verifyToken, contentController.videoList)

/**
 * @swagger
 * /api/v1/content/socialMedia:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: socialSite
 *         description: socialSite
 *         in: formData
 *         required: true
 *       - name: url
 *         description: url
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Social link has been added successfully.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/socialMedia', auth.verifyToken, contentController.addSocialMedia)

/**
 * @swagger
 * /api/v1/content/socialMedia:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: socialId
 *         description: socialId
 *         in: formData
 *         required: true
 *       - name: socialSite
 *         description: socialSite
 *         in: formData
 *         required: false
 *       - name: url
 *         description: url
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

router.put('/socialMedia', auth.verifyToken, contentController.editSocialMedia)

/**
 * @swagger
 * /api/v1/content/socialMedia:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.get('/socialMedia', auth.verifyToken, contentController.socialMediaList)

/**
 * @swagger
 * /api/v1/content/logo:
 *   put:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *         in: formData
 *         required: true
 *       - name: productLogo
 *         description: productLogo
 *         in: formData
 *         required: true
 *            
 *     responses:
 *       200:
 *         description: Successfully updated.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/logo', auth.verifyToken, contentController.editLogo)

/**
 * @swagger
 * /api/v1/content/logo/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/logo/:id', auth.verifyToken, contentController.viewLogo)

/**
 * @swagger
 * /api/v1/content/splash:
 *  post:
 *    tags:
 *       - CONTENT-MANAGEMENT
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: image
 *         description: image
 *         in: body
 *         required: true
 *    responses:
 *       200:
 *         description: Data is saved successfully.
 *       404:
 *         description: Already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/splash', auth.verifyToken, contentController.addSplash)

/**
 * @swagger
 * /api/v1/content/splash:
 *  put:
 *    tags:
 *       - CONTENT-MANAGEMENT
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: id
 *         description: id
 *         in: body
 *         required: true
 *       - name: image
 *         description: image
 *         in: body
 *         required: true
 *    responses:
 *       200:
 *         description: Successfully updated.
 *       404:
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.   
 */

router.put('/splash', auth.verifyToken, contentController.editSplash)

/**
 * @swagger
 * /api/v1/content/splash/{_id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.get('/splash/:_id', auth.verifyToken, contentController.viewSplash)

/**
 * @swagger
 * /api/v1/content/splash:
 *   delete:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.delete('/splash', auth.verifyToken, contentController.deactivateSplash)

/**
 * @swagger
 * /api/v1/content/splashList:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
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

router.post('/splashList', auth.verifyToken, contentController.splashList)


/**
 * @swagger
 * /api/v1/content/newsListWebsite:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/newsListWebsite', auth.verifyToken, contentController.newsListWebsite)


/**
 * @swagger
 * /api/v1/content/phototListWebsite:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/phototListWebsite', auth.verifyToken, contentController.phototListWebsite)


/**
 * @swagger
 * /api/v1/content/vediosListWebsite:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/vediosListWebsite', auth.verifyToken, contentController.vediosListWebsite)


/**
 * @swagger
 * /api/v1/content/eventListWebsite:
 *   post:
 *     tags:
 *       - CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       
 *     responses:
 *       200:
 *         description: Requested data found.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/eventListWebsite', auth.verifyToken, contentController.eventListWebsite)

/**
 * @swagger
 * /api/v1/content/viewEventWebsite/{id}:
 *   get:
 *     tags:
 *       - CONTENT-MANAGEMENT
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
 *       
 *     responses:
 *       200:
 *         description: Details have been fetched successfully.
 *       404: 
 *         description: Requested data not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/viewEventWebsite/:id', auth.verifyToken, contentController.viewEventWebsite)
/**
 * @swagger
 * /api/v1/content/viewFaq/{faqId}:
 *   get:
 *     tags:
 *       -  CONTENT-MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: faqId
 *         description: faqId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Data is saved successfully
 *       404:
 *         description: Requested data not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/viewFaq/:id', auth.verifyToken, contentController.viewFaq);

module.exports = router;  