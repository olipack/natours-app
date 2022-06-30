const Review = require('./../models/reviewModel')
const factory = require('./../controllers/handlerFactory')

// Middleware that is run before createReview; allows nested routes in order to create a new review for a tour
exports.setTourUserIds = (req, res, next) => {
  if(!req.body.tour) req.body.tour = req.params.tourId
  if(!req.body.user) req.body.user = req.user.id
  next()
}

exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)