const express = require('express');
const router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware');
const Site = require('../models/site');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../Utilities/ExpressError');
const CatchAsync = require('../Utilities/CatchAsync');

router.post('/', isLoggedIn, validateReview, CatchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewOwner, CatchAsync(reviews.deleteReview));

module.exports = router;