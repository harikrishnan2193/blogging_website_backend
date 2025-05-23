const express = require('express')
const userController = require('../controllers/usersController')
const jwtMiddleWare = require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multterMiddleware')

const router = new express.Router()

//register 
router.post('/users/register', userController.register)

//login
router.post('/users/login', userController.login)

//add blog
router.post('/product/addnew', jwtMiddleWare, multerConfig.single(`blogImage`), userController.addProduct)

//get all blogs
router.get('/project/all-blogs', userController.getAllblogs)

//get user blogs
router.get('/project/user-blogs/:userId', userController.getUserblogs)

//update the blog
router.put('/project/update-blog/:id', jwtMiddleWare, multerConfig.single('blogImage'), userController.updateBlog)

//delete a blog
router.delete('/project/delete-blog/:id',jwtMiddleWare, userController.deleteBlog)


module.exports = router