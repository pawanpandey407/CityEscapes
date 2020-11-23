const Site = require('../models/site');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const sites = await Site.find({});
  res.render('sites/index', {sites});
}

module.exports.renderNewForm =  (req, res) => {
  res.render('sites/new');
}

module.exports.createSite = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.site.location,
    limit: 1
  }).send()  

  const site = new Site(req.body.site);
  site.geometry = geoData.body.features[0].geometry;
  site.owner = req.user._id;
  await site.save();
  req.flash('success', 'Site Successfully Added!!');
  res.redirect(`/sites/${site._id}`);
}

module.exports.showSite = async (req, res) => {
  const site = await Site.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
    path: 'owner'
  }}).populate('owner');

  if(!site) {
    req.flash('error', 'Site Not Found!!');
    return res.redirect('/sites');
  }
  res.render('sites/show', { site });
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const site = await Site.findById(id);
  if(!site) {
    req.flash('error', 'Site Not Found!!');
    return res.redirect('/sites');
  }
  res.render('sites/edit', { site });
}

module.exports.updateSite = async (req, res) => {
  const { id } = req.params;
  const site = await Site.findByIdAndUpdate(id, {...req.body.site });
  req.flash('success', 'Site Successfully Updated!!');
  res.redirect(`/sites/${site._id}`);
}

module.exports.deleteSite = async (req, res) => {
  const { id } = req.params;
  await Site.findByIdAndDelete(id);
  req.flash('success', 'Site Successfully Deleted!!');
  res.redirect('/sites');
}