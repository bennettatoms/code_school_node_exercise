'use strict';

var axon = require('axon');
var socket = axon.socket('sub'); 
// now doing subscribe socket, refer to axon docs

// we need to connect our socket to the port
socket.connect(8001);

/*
* Since this is an event emitter, we should be 
* listening for an error event.
* axon docs recommend the following:
*/
socket.on('error', function(err) {
  throw err;
});

module.exports = socket;
