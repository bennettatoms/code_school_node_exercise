'use strict';

var _ = require('underscore');
var model = require('../models/badges');
/*
 Send badges to model to be saved
*/
exports.save = function(req, res, next) {
  var badges = _.clone(req.body); /* underscore method to copy req.body before we manipulate it, so that we don't alter the original object, delete its contents, etc. */ 
  model.save(badges, function(error) { /* when function is invoked, we're done saving to the database -- recursively works its way through the array of badges, saving each one */
    if (error) return res.json(503, { error: true }); /* res.json takes in an object, stringifies it to json and sends it back to the polling script with the appropriate content-type headers -- pass in status code 503, tells client there was an internal server error, unable to save */
    next(); // if no error, we've saved and go to next middleware
    model.trim();
  });
};

/*
 Send badges to pub/sub socket in model
*/
exports.send = function(req, res, next) {
  var badges = _.clone(req.body);
  model.send(badges, function(error) {
    if (error) return res.json(503, { error: true });
    res.json(200, { error: null }); /* when we're done, send a response with a 200 status code and say the error is null */
  });
  next();
};

/*
 Get 10 badges from model (in turn from DB)
*/
exports.get = function(req, res) {
  model.get(function(error, data) {
    if (error) return res.json(503, { error: true });
    res.json(200, data); // will make sense of json
    next();
  });
};






