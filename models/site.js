const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumb').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const SiteSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
  price: Number,
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

SiteSchema.post('findOneAndDelete', async function (document) {
  if (document) {
      await Review.deleteMany({
          _id: {
              $in: document.reviews
          }
      })
  }
});

module.exports = mongoose.model('Site', SiteSchema);