'use strict';

var axon = require('axon');
var socket = axon.socket('pub'); // check [axon docs](github.com/visionmedia/axon)

socket.bind(8001);

/**
 *  On error
 */
socket.on('error', function(err){
  throw err;
});

/*
* Send a badge to the publish socket
*/
exports.send = function(badge) {
  socket.send(badge); // axon has built-in send method on socket
};
// could actually do: exports.send = socket.send;