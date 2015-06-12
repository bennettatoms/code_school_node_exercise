'use strict';

var port = process.env.REDIS_PORT || 6379;
var host = process.env.REDIS_HOST || 'localhost';
var auth = process.env.REDIS_AUTH || null;

var redis = require('redis'); // require the database driver
var client = redis.createClient(port, host); /* initiate new connection -- since we're running the client locally, we don't need to pass in any parameters to the createClient() method as to where that client would be  -- connects to default localhost properties of a redis server, runs on port 6379 */
// check github.com/mranney.node_redis 'Usage' for documentation
/* if you needed to select a certain database, you'd issue client.select(integer, function() {};) -- defaults to 0 if you don't explicitly tell it which database to use */
  
if (auth) client.auth(auth);

client.on("error", function (err) {
  console.log("Error " + err); /* first thing to do is set up an error alert -- very important, because in node, if you have an error on a socket (something that's communicating over the network, or a stream that comes off your file system, or an http request), somewhere between the remote and your application, that error propagates back to your stream, you need to handle it. If one of your connections isn't working properly, your application will start leaking memory and not responding quickly. Else your process will exit */
});

module.exports = client; // expose the client







