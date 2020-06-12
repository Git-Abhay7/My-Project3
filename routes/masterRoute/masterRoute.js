const express = require('express')
const router = express.Router()
const masterController = require("../../controllers/masterController");
const auth = require('../../middleware/auth');


/**
 * @swagger
 * /api/v1/master/masterList:
 *   get:
 *     tags:
 *       - MASTER LIST
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
 *         description: data found successfully.
 *       404: 
 *         description: data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/masterList', auth.verifyToken, masterController.masterList)

/**
 * @swagger
 * /api/v1/master/interest:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: interestName
 *         description: interestName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Interest has been added successfully.
 *       404:
 *         description: This interest name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/interest', auth.verifyToken, masterController.addInterest)

/**
 * @swagger
 * /api/v1/master/interest/{interestId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: interestId
 *         description: interestId
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

router.get('/interest/:interestId', auth.verifyToken, masterController.viewInterest)

/**
 * @swagger
 * /api/v1/master/interest:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: interestId
 *         description: interestId
 *         in: formData
 *         required: true
 *       - name: interestName
 *         description: interestName
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

router.put('/interest', auth.verifyToken, masterController.editInterest)

/**
 * @swagger
 * /api/v1/master/interest:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: interestId
 *         description: interestId
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

router.delete('/interest', auth.verifyToken, masterController.deactivateInterest)

/**
 * @swagger
 * /api/v1/master/interestList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/interestList', auth.verifyToken, masterController.interestList)

/**
 * @swagger
 * /api/v1/master/businessCategory:   
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: businessCategoryName
 *         description: businessCategoryName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Business category has been added successfully.
 *       404:
 *         description: This business category name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/businessCategory', auth.verifyToken, masterController.addBusinessCategory)

/**
 * @swagger
 * /api/v1/master/businessCategory/{businessId}:
 *   get:    
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: businessId   
 *         description: businessId
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

router.get('/businessCategory/:businessId', auth.verifyToken, masterController.viewBusinessCategory)

/**
 * @swagger
 * /api/v1/master/businessCategory:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: businessId
 *         description: businessId
 *         in: formData
 *         required: true
 *       - name: businessCategoryName
 *         description: businessCategoryName
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

router.put('/businessCategory', auth.verifyToken, masterController.editBusinessCategory)

/**
 * @swagger
 * /api/v1/master/businessCategory:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: businessId
 *         description: businessId
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

router.delete('/businessCategory', auth.verifyToken, masterController.deactivateBusinessCategory)

/**
 * @swagger
 * /api/v1/master/businessCategoryList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/businessCategoryList', auth.verifyToken, masterController.businessCategoryList)

/**
 * @swagger
 * /api/v1/master/sortItem:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: sortItem
 *         description: sortItem
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Sort item has been added successfully.
 *       404:
 *         description: This sort item already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/sortItem', auth.verifyToken, masterController.addSortItem)

/**
 * @swagger
 * /api/v1/master/sortItem/{sortId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: sortId
 *         description: sortId
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

router.get('/sortItem/:sortId', auth.verifyToken, masterController.viewSortItem)

/**
 * @swagger
 * /api/v1/master/sortItem:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: sortId
 *         description: sortId
 *         in: formData
 *         required: true
 *       - name: sortItem
 *         description: sortItem
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

router.put('/sortItem', auth.verifyToken, masterController.editSortItem)

/**
 * @swagger
 * /api/v1/master/sortItem:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: sortId
 *         description: sortId
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

router.delete('/sortItem', auth.verifyToken, masterController.deactivateSortItem)

/**
 * @swagger
 * /api/v1/master/sortItemList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/sortItemList', auth.verifyToken, masterController.sortItemList)

/**
 * @swagger
 * /api/v1/master/brand:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: brandName
 *         description: brandName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Brand has been added successfully.
 *       404:
 *         description: This brand name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/brand', auth.verifyToken, masterController.addBrand)

/**
 * @swagger
 * /api/v1/master/brand/{brandId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: brandId
 *         description: brandId
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

router.get('/brand/:brandId', auth.verifyToken, masterController.viewBrand)

/**
 * @swagger
 * /api/v1/master/brand:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: brandId
 *         description: brandId
 *         in: formData
 *         required: true
 *       - name: brandName
 *         description: brandName
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

router.put('/brand', auth.verifyToken, masterController.editBrand)

/**
 * @swagger
 * /api/v1/master/brand:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: brandId
 *         description: brandId
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

router.delete('/brand', auth.verifyToken, masterController.deactivateBrand)

/**
 * @swagger
 * /api/v1/master/brandList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/brandList', auth.verifyToken, masterController.brandList)

/**
 * @swagger
 * /api/v1/master/category:
 *  post:
 *    tags:
 *       - MASTER LIST
 *    produces:
 *      - application/json
 *    parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - in: body
 *         name: category
 *         description: 
 *         schema:
 *           type: object
 *           required:
 *             - categoryName
 *           properties:
 *             categoryName:
 *               type: string
 *             subCategories:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                 subCategoryName:
 *                   type: string
 *    responses:
 *       200:
 *         description: Category has been added successfully.
 *       404:
 *         description: This category already exists.
 *       500:
 *         description: Internal Server Error.   
 */

router.post('/category', auth.verifyToken, masterController.addCategory)

/**
 * @swagger
 * /api/v1/master/subCategory:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true
 *       - name: subCategoryName
 *         description: subCategoryName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Sub-category has been added successfully.
 *       404: 
 *         description: This sub-category already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/subCategory', auth.verifyToken, masterController.addSubCategory)

/**
 * @swagger
 * /api/v1/master/category/{categoryId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
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

router.get('/category/:categoryId', auth.verifyToken, masterController.viewCategory)

/**
 * @swagger
 * /api/v1/master/subCategory:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true
 *       - name: subCategoryId
 *         description: subCategoryId
 *         in: formData
 *         required: true
 *       - name: subCategoryName
 *         description: subCategoryName
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

router.put('/subCategory', auth.verifyToken, masterController.editSubCategory)

/**
 * @swagger
 * /api/v1/master/subCategory:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true
 *       - name: subCategoryId
 *         description: subCategoryId
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

router.delete('/subCategory', auth.verifyToken, masterController.deactivateSubCategory)

/**
 * @swagger
 * /api/v1/master/category:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
 *         in: formData
 *         required: true
 *       - name: categoryName
 *         description: categoryName
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

router.put('/category', auth.verifyToken, masterController.editCategory)

/**
 * @swagger
 * /api/v1/master/category:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: categoryId
 *         description: categoryId
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

router.delete('/category', auth.verifyToken, masterController.deactivateCategory)

/**
 * @swagger
 * /api/v1/master/categoryList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/categoryList', auth.verifyToken, masterController.categoryList)

/**
 * @swagger
 * /api/v1/master/department:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: departmentName
 *         description: departmentName
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Department has been added successfully.
 *       404:
 *         description: This department name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/department', auth.verifyToken, masterController.addDepartment)

/**
 * @swagger
 * /api/v1/master/department/{departmentId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: departmentId
 *         description: departmentId
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

router.get('/department/:departmentId', auth.verifyToken, masterController.viewDepartment)

/**
 * @swagger
 * /api/v1/master/department:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: departmentId
 *         description: departmentId
 *         in: formData
 *         required: true
 *       - name: departmentName
 *         description: departmentName
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

router.put('/department', auth.verifyToken, masterController.editDepartment)

/**
 * @swagger
 * /api/v1/master/department:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: departmentId
 *         description: departmentId
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

router.delete('/department', auth.verifyToken, masterController.deactivateDepartment)

/**
 * @swagger
 * /api/v1/master/departmentList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/departmentList', auth.verifyToken, masterController.departmentList)

/**
 * @swagger
 * /api/v1/master/designation:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: designation
 *         description: designation
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Designation has been added successfully.
 *       404:
 *         description: This designation name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/designation', auth.verifyToken, masterController.addDesignation)

/**
 * @swagger
 * /api/v1/master/designation/{designationId}:
 *   get:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: designationId
 *         description: designationId
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

router.get('/designation/:designationId', auth.verifyToken, masterController.viewDesignation)

/**
 * @swagger
 * /api/v1/master/designation:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: designationId
 *         description: designationId
 *         in: formData
 *         required: true
 *       - name: designation
 *         description: designation
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

router.put('/designation', auth.verifyToken, masterController.editDesignation)

/**
 * @swagger
 * /api/v1/master/designation:
 *   delete:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: designationId
 *         description: designationId
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

router.delete('/designation', auth.verifyToken, masterController.deactivateDesignation)

/**
 * @swagger
 * /api/v1/master/designationList:
 *   post:
 *     tags:
 *       - MASTER LIST
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

router.post('/designationList', auth.verifyToken, masterController.designationList)

/**
 * @swagger
 * /api/v1/master/documentType:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: documentType
 *         description: documentType
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: documentType has been added successfully.
 *       404:
 *         description: This documentType name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/documentType', auth.verifyToken, masterController.addDocumentType)

/**
 * @swagger
 * /api/v1/master/documentType:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: documentType
 *         description: documentType
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: documentType has been updated successfully.
 *       404:
 *         description: This documentType name already exists.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/documentType', auth.verifyToken, masterController.editDocumentType)

/**
 * @swagger
 * /api/v1/master/documentTypeList:
 *   post:
 *     tags:
 *       - MASTER LIST
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
 *         description: data found successfully.
 *       404: 
 *         description: data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/documentTypeList', auth.verifyToken, masterController.documentTypeList)

/**
 * @swagger
 * /api/v1/master/userRole:
 *   post:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: roleName
 *         description: roleName
 *         in: formData
 *         required: true
 *       - name: dashboardYnot
 *         description: dashboardYnot
 *         in: formData
 *         required: false
 *       - name: consumers
 *         description: consumers
 *         in: formData
 *         required: false
 *       - name: vendors
 *         description: vendors
 *         in: formData
 *         required: false
 *       - name: promotions
 *         description: promotions
 *         in: formData
 *         required: false
 *       - name: reviews
 *         description: reviews
 *         in: formData
 *         required: false
 *       - name: notifications
 *         description: notifications
 *         in: formData
 *         required: false
 *       - name: contentManagement
 *         description: contentManagement
 *         in: formData
 *         required: false
 *       - name: masterList
 *         description: masterList
 *         in: formData
 *         required: false
 *       - name: appWebSettings
 *         description: appWebSettings
 *         in: formData
 *         required: false
 *       - name: userActivityLog
 *         description: userActivityLog
 *         in: formData
 *         required: false
 *       - name: myProfileYnot
 *         description: myProfileYnot
 *         in: formData
 *         required: false
 *       - name: usersAndRoles
 *         description: usersAndRoles
 *         in: formData
 *         required: false
 *       - name: reportsYnot
 *         description: reportsYnot
 *         in: formData
 *         required: false
 *       - name: dashboardVendor
 *         description: dashboardVendor
 *         in: formData
 *         required: false
 *       - name: myProfileVendor
 *         description: myProfileVendor
 *         in: formData
 *         required: false
 *       - name: myBranches
 *         description: myBranches
 *         in: formData
 *         required: false
 *       - name: myPromotions
 *         description: myPromotions
 *         in: formData
 *         required: false
 *       - name: myReviews
 *         description: myReviews
 *         in: formData
 *         required: false
 *       - name: myUsers
 *         description: myUsers
 *         in: formData
 *         required: false
 *       - name: reportsVendor
 *         description: reportsVendor
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Role has been added successfully.
 *       404:
 *         description: This role is exists already.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/userRole', auth.verifyToken, masterController.addUserRole)

/**
 * @swagger
 * /api/v1/master/userRole:
 *   put:
 *     tags:
 *       - MASTER LIST
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *       - name: roleName
 *         description: roleName
 *         in: formData
 *         required: true
 *       - name: consumers
 *         description: consumers
 *         in: formData
 *         required: true
 *       - name: vendors
 *         description: vendors
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Role has been updated successfully.
 *       404:
 *         description: This role is exists already.
 *       500:
 *         description: Internal Server Error.
 */

router.put('/userRole', auth.verifyToken, masterController.editUserRole)

/**
 * @swagger
 * /api/v1/master/userRole/{id}:
 *   get:
 *     tags:
 *       - MASTER LIST
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
 *         description: Data found successfully.
 *       404:
 *         description: Data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/userRole/:id', auth.verifyToken, masterController.viewUserRole)

/**
 * @swagger
 * /api/v1/master/userRole:
 *   delete:
 *     tags:
 *       - MASTER LIST
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
 *     responses:
 *       200:
 *         description: Data deleted successfully.
 *       404:
 *         description: Data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.delete('/userRole', auth.verifyToken, masterController.deleteUserRole)

/**
 * @swagger
 * /api/v1/master/userRoleList:
 *   post:
 *     tags:
 *       - MASTER LIST
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
 *         description: data found successfully.
 *       404: 
 *         description: data not found.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/userRoleList', masterController.userRoleList)


module.exports = router;    
