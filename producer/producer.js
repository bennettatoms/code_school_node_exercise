'use strict';
 
var request = require('request');
var arrandom = require('arrandom');
 
var data = [
  {
    "course_id": 102,
    "badge_id": "javascript-road-trip-part-2-d4fd45ae7ecb6601fe4a0c8d506ca306.png"
  },
  {
    "course_id": 104,
    "badge_id": "javascript-road-trip-part-3-6c96fe52f9c68b790937d3db2110325a.png"
  },
  {
    "course_id": 111,
    "badge_id": "discover-drive-2b1029e989beb93b6fe63af100dd28d9.png"
  },
  {
    "course_id": 112,
    "badge_id": "exploring-google-maps-for-ios-c6bbca90b0b53d7ba338f91acc88d741.png"
  },
  {
    "course_id": 105,
    "badge_id": "front-end-formations-165329e44a56cd6d401c0c60369d368e.png"
  },
  {
    "course_id": 97,
    "badge_id": "ios-operation-mapkit-1de49437d7999696885179345c443692.png"
  },
  {
    "course_id": 98,
    "badge_id": "jquery-the-return-flight-6bf0a32c22a6804cc007ee71308a5afd.png"
  },
  {
    "course_id": 101,
    "badge_id": "rails-4-patterns-e029cd411b83525e82500b0ce2b268ec.png"
  },
  {
    "course_id": 28,
    "badge_id": "rails-4-zombie-outlaws-34baf50cb535a8ef10496a09cb6f9e07.png"
  },
  {
    "course_id": 22,
    "badge_id": "ruby-bits-part-2-59098ceb97c12ac640eebadf6a4da58a.png"
  },
  {
    "course_id": 108,
    "badge_id": "surviving-apis-with-rails-482f87efd9827f52ecaa027f733592cb.png"
  }
];
 
var requestObj = {
  json: data,
  method: 'POST',
  url: 'http://localhost:8000'
};
 
(function _request () {
  requestObj.json = [arrandom(data)[0]];
  request(requestObj, function(err){
    if (err) console.log(err);
    setTimeout(_request, 1900);
  });
})();