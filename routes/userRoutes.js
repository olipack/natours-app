const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
// authController.protect:
// the id of the user that is being updated comes from request.user which was set by
// the .protect middleware which in turn got the id from the JWT and nobody can change
// that id without knowing the secret

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// Protect all routes after this middleware
router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)
router.get('/me', userController.getMe, userController.getUser)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
