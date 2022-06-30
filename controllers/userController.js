const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./../controllers/handlerFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllUsers = factory.getAll(User)

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for pasSword updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  // 2) Filter out fields that are not allowed to be updated -> all fields except name and email
  const filteredBody = filterObj(req.body, 'name', 'email')

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  })
})

// when the user deletes himself he will not be deleted but "active" will be set to "false"
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.getUser = factory.getOne(User)
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not definded! Please use /signup instead'
  })
}

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User);