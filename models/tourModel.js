const mongoose = require('mongoose')
const slugify = require('slugify')
// const User = require('./userModel')  *not required for child referencing

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have e difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is eiher: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summery: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
    // in tourCountroler: const tour = await Tour.findById(req.params.id).populate('guides')
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

////////////////////////
/// INDEXES

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

//////////////////////////////
/// VIRTUAL FIELDS & POPULATE

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

////////////////////////
/// DOCUMENT MIDDLEWARE  *runs before the .save() and .create(); does NOT work with update!

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// EMBEDDEDING USERS INTO TOURS
// * in tourSchema: guides: Array
// * if we update a user we'd need a functions that updates the user data in all tour documents

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)
//   next()
// })

/////////////////////
/// QUERY MIDDLEWARE  *runs before any query; 'this' always points to the current query

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  })
  next()
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  next()
})

///////////////////////////
/// AGGREGATION MIDDLEWARE  * deactivated in order to make geoNear work
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   console.log(this.pipeline())
//   next()
// })

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
