'use strict';

var redis = require('../lib/redis');
var broadcast = require('../lib/broadcast');

/*
* Save badges to database
* @param {Array} badges
* @param {Function} callback
*/

exports.save = function(badges, callback) { // asynchronous recursion
  if (!badges.length) return callback(null, null); /* once there are no more badges in the array, complete callback with null value for error and null value for data */
  var badge = badges.pop(); // remove last item from badges array and assign to badge
  redis.lpush('badges', JSON.stringify(badge), function(err) { // have to send strings to redis, not objects, so have to stringify
    if (err) return callback(err, null); // truthy error, null value for the data
    exports.save(badges, callback); // function will run until there are no more badges in the array
  }); 
};

/*
* Trim the redis list
*/
exports.trim = function() {
  redis.ltrim('badges', 0, 9); // caps the badges list at ten items
};

/*
* Send out badges to the broadcaster
* @param {Array} badges
* @param {Function} callback
*/

exports.send = function(badges, callback) {
  badges.forEach(broadcast.send); // what's the ideal interface to send out these badges?
  /* OR badges.forEach(function(badge) {
          broadcast.send(badge);
        }); */
  callback(null, null); // null for error, null for data
    /* we accept a callback just in case some time in the future something changes, we won't have to change our controller, which right now is waiting for a callback to be invoked */
};

/*
* Get badges from redis (already trimmed to 10)
* @param {Function} callback
*/

exports.get = function(callback) {
  redis.lrange('badges', 0, -1, function(err, data) {
    if (err) return callback(err, null);
    callback(null, data.map(JSON.parse));
      /* interprets data coming back from redis, an array of strings, an converts into an array of objects */
  });
};
/*
* data = data.map(JSON.parse);
* 
* is the same as:
* 
* data = data.map(function(badge) {
*   return JSON.parse(badge);
* })
*/


