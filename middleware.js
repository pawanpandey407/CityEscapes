const { siteSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./Utilities/ExpressError');
const Site = require('./models/site');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please Sign In!!');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateSite = (req, res, next) => {
  const { error } = siteSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const site = await Site.findById(id);
  if(!site.owner.equals(req.user._id)) {
    req.flash('error', 'Permission denied!!');
    return res.redirect(`/sites/${id}`);
  }
  next();
}

module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.owner.equals(req.user._id)) {
    req.flash('error', 'Permission denied!!');
    return res.redirect(`/sites/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}