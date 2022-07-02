const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes')

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)
// in reviewRouter set "mergeParams" to true -> const router = express.Router({ mergeParams: true })

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  )

////////////////////////
/// Routes without id

router
  .route('/')
  // get all tours is not protected because we want to expose our tours to everyone
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  )

////////////////////////
/// Routes with id

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )

module.exports = router
