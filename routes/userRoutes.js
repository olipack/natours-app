const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)
router.patch('/updateMyPassword', authController.protect, authController.updatePassword)
// authController.protect:
// the id of the user that is being updated comes from request.user which was set by
// the .protect middleware which in turn got the id from the JWT and nobody can change
// that id without knowing the secret

router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteMe)

module.exports = router
