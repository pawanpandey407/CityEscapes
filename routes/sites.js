const express = require('express');
const router = express.Router();
const sites = require('../controllers/sites');
const CatchAsync = require('../Utilities/CatchAsync');
const { isLoggedIn, isOwner, validateSite } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Site = require('../models/site');

router.route('/')
    .get(CatchAsync(sites.index))
    .post(isLoggedIn, upload.array('image'), validateSite, CatchAsync(sites.createSite));

router.get('/new', isLoggedIn, sites.renderNewForm);

router.route('/:id')
    .get(CatchAsync(sites.showSite))
    .put(isLoggedIn, isOwner, upload.array('image'), validateSite, CatchAsync(sites.updateSite))
    .delete(isLoggedIn, isOwner, CatchAsync(sites.deleteSite));

router.get('/:id/edit', isLoggedIn, isOwner, CatchAsync(sites.renderEditForm));

module.exports = router;