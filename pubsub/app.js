'use strict';

var express = require('express');
var app = express();
var badges = require('./controllers/badges');

app.use(express.json()); /* invoke json method to interpret incoming json body, if it meets criteria -- it has to be a post request and have the Content-Type 'application/json' */

app.post('/', badges.save, badges.send); // save will save badges coming in from pub sub, send will publish them back out
/* could have anonymous function to terminate response here -- e.g res.render('dashboard'); -- after middleware next(), next(), but instead will terminate inside badges.send */

// app.post('/', badges.save, badges.send, function(req, res) {
//   res.send('\ndone\n\n');
// });

app.get('/badges', badges.get);

app.listen(8000, function() {
  console.log('Server is listening on port %d', 8000)
});



