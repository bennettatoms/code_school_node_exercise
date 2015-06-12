'use strict';

var host = process.env.BADGES_HOST || 'http://localhost:8000/badges';
var request = require('request'); // to communicate with remote server

/**
 *  Load the last 10 badges from the pub/sub server
 * @param {Function} callback
 */
exports.get = function(callback) {
  request(host, function(err, resp, data) {
    data = JSON.parse(data);
    if (data.error) return callback(err, []);
    callback(null, data.data);
  });
};
  /* 
  * [request docs](https://www.npmjs.com/package/request)
  * request pre-fills the body of the response, and it's 
  * a string, so need to JSON.parse
  */
  
