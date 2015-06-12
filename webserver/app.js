'use strict';

var express = require('express');
var app = express();
// pass the express app into the request handler
var server = require('http').createServer(app); 
// pass the server into socket.io
var io = require('socket.io').listen(server); 
/* 
* socket.io and express are going to share the same server
* can check out [socket.io docs](http://socket.io/#how-to-use) for how do this
*/

/**
 *  Allows third party clients to connect to the socket server
 */
app.use(function(request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

var badges = require('./models/badges');

// require the subscribe socket so we can hook it up to server
var subSocket = require('./lib/socket');

/* 
* TJ's convention is to have backend servers on port 3000, 
* servers that render views/interact with browser on 8000
*/
var port = process.env.PORT || 3000;
server.listen(3000, function() {
  console.log('Server is running on port %d', port);
});

/*
* Serve static assets out of public directory
*/
app.use(express.static('public'));

/* the following is unnecessary, implicitly handled
* by the app.use...static above, but helps with clarity
*/
app.get('/', function(req, res) {
  res.sendfile('./public/index.html'); // sends file from public
});

/**
 *  Watch for connections
 */
io.sockets.on('connection', function(socket) {
  // pre-fill user's screen with content (badges) when browser connects
  badges.get(function(err, data) {
    if (err) return;
    data.forEach(function(badge) { // sends each item in the array of badges
      socket.emit('badge', badge);
    });
  });
});

/* 
* Hook up subSocket to socket.io
* When we get a message (a badge) from out subscribe socket
*/
subSocket.on('message', function(message) {
  io.sockets.emit('badge', message); 
  /* 
  * Since we're emitting from top-level io.socket, 
  * it will emit to all sockets (similar in nature 
  * to broadcast from real-time with node course)
  * -- with broadcast, emission is specific to that
  * particular socket, so sends to all other sockets,
  * but not itself.
  * 
  * Also, since socket.io can interpret types (like axon),
  * we can pass in a JavaScript object and it will make
  * sense of it on both ends for us.
*/
});

