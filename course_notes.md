###Additional NodeJS resources:

* [soup to bits screencast](http://www.codeschool.com/screencasts/soup-to-bits-real-time-with-node-js): has source code for app
* [node docs](http://nodejs.org)
* [NPM website](http://npmjs.org)
* [how to node blog](http://howtonode.org)
* [stream handbook](http://github.com/substack/stream-handbook)
* [little redis book](http://openmymind.net/2012/1/23/The-Little-Redis-Book/)
* [socket.io](http://socket.io/docs)
* [expressJS website](http://expressjs.com/4x/api.html)
* [nodeup podcast](http://nodeup.com)

# Node JavaScript Jabber notes

Uses threads in the background that -- based on the reactor pattern (talked about in Douglas Crockford's Loopage and a couple TED talks) -- copy a file on one thread, and when it's finished it plants a flag in the event system to say, hey, I'm done. 

There is a queue of tasks, but the threads can handle multiple tasks at the same time.

Node does some things, like file access, that browser-based JS doesn't do. But at the same time JS was created for the browser, there was also JS created for the server.

JavaScript has an interesting ecosystem due to the fact that each browser has its own take on JavaScript

CommonJS is behind the 'require' helper method that Node employs. But in CommonJS standard, you can't export functions -- has to be an object. In Node you have access to the module and can export functions.

Node has excellent documentation -- built on V8 -- Node was heavily adopted by people that were using Ruby rather than JavaScript

Semantic versioning -- won't be considered to be stable until they hit 1.0 -- even numbers said to be stable (0.4, 0.6, 0.8), odd numbers less so. Current Version: v0.12.4

NPM does dependency resolution -- list the packages your app depends on, and it will install all of them (as well as their dependencies) in node_modules directory. 

It's very easy to publish code packages to NPM.

When you NPM install, it recursively installs. 

Best way to get started with NodeJS -- download from nodejs.org
How to find the modules that you need from NPM -- can search NPM -- google search -- all listed on GitHub, so check the number of forks, the number of watchers, and the most recent commit

Node IRC channel on freenode (#node.js) -- get advice

Strengths
  - real-time push stuff, esp. socket.io lets you push stuff back and forth between browser and server -- have an open connection that both sides can read from and write to, but over http
  - evented model -- e.g. chat room, get something in and wanted to generate events to manage it going back out
  - prototyping network code is easy and quick on Node (udp, tcp, http)
  - very competitive speed-wise among all the interpreted languages
  - reuse of code between the browser and the server

Weaknesses
  - not as stable on ARM as it is on x86
  - every time you change your code you have to restart your node server (or have some magic working to set watchers)
  - Node may not be appropriate for systems grips
  - start-up time is fairly long (probably fast enough on x86)
  - if you're doing something with lots of asynchronous calls, there might not be an advantage over doing them synchronously


# NodeJS code school notes

Allows you to build scalable network applications using JavaScript on the server side. Uses V8 JavaScript Runtime (all written in C, so very fast). 

What can you build with node?
  - Websocket server -- like a chat server
  - Fast File Upload Content
  - Ad Server
  - Any Real-Time Data Apps

It is not a web framework -- low-level network communication framework, not for beginners -- though there are libraries that people have written on top of Node to act as web frameworks

Node is not Multi-threaded -- you can think of it as a single-threaded server


## Blocking code

1) Read file from Filesystem, set equal to 'contents'
2) Print contents
3) Do something else

Blocking because cannot proceed with steps 2 and 3 until we've read the entire file

Node version: 
var contents = fs.readFileSync('/etc/hosts');   // synchronous call
console.log(contents);
console.log('Doing something else');

## Non-blocking code

1) Read file from Filesystem
  1.a. whenever you're complete, print the contents (callback)
3) Do something else

In non-blocking code, computer will move on to step 3 while the full file read is taking place, then will return to 1.a. to print contents when it's done.

Node version: 
fs.readFile('/etc/hosts', function(err, contents) {
  console.log(contents);
});
console.log('Doing something else');

OR callback alternative syntax:

var callback = function(err, contents) {
  console.log(contents);
};

fs.readFile('/etc/hosts', callback);

### Reading two files at the same time
In blocking version, reads one file, then the other. In non-blocking, reads the files in parallel and is much quicker.


## NodeJS hello world (hello.js)

var http = require('http');   // How we require modules

http.createServer(function(request, response) {
  response.writeHead(200);  // status code in header
  response.write('Hello, this is dog.');  // response body
  response.end();   // close the connection
}).listen(8080);    // listen for connections on this port

console.log('Listening on port 8080...');

And in command line, 
$ node hello.js     // Run the server

$ curl http://localhost:8080 (or go to browser) ==> 'Hello, this is dog.'

### Event Loops

How Node executes code -- the first time Node goes through our code, it registers events. In this case, it will register the request event.
Starts the event loop when finished registering, just checking continuously for events -- did request come in? did request come in? did request come in? 

When the request comes in, Node triggers the event and executes the callback that we wrote ('Hello, this is dog.').

"JavaScript has certain characteristics that make it very different than other dynamic languages, namely that it has no concept of threads. Its model of concurrency is completely based around events." -- Ryan Dahl, creator of Node

So, a Node application that is running registers a number of events, such as request, connection, close, etc. -- when the event loop catches one of the events, triggers events (or emits the event into an event queue). If multiple events are sitting in the event queue, they'll be processed one at a  on the event loop.

Back to hello dog...
var http = require('http');   // How we require modules

http.createServer(function(request, response) {
  response.writeHead(200);
  response.write('Dog is running.');
  setTimeout(function() {
    response.write('Dog is done.');
    response.end();
  }, 5000);     // 5 second timeout
}).listen(8080); 

Two events in above code -- request event and timeout event -- every time a request comes in, Node will create a new timeout event, which will then be called back in five seconds.

If the code is written to be blocking, then the setTimeout function blocks anything from happening for five seconds. If written in non-blocking code (as is NodeJS's custom), other things can happen during the initial five-second timeout. A new request can come in, and it will initiate a new timeout event, and so on. 


## Events

The DOM triggers events -- click, submit, hover, etc. -- you can listen for those.

$("p").on('click', function() { ... } ); // attach this function to the DOM

Just like in the DOM, many objects in Node emit events that they inherit from the EventEmitter cniostructor -- e.g. net.Server inherits from EventEmitter and emits request events; fs.readStream returns a stream which inherits from EventEmitter, which will emit a data event as we read data from the file

### custom EventEmitter --> create a logger

var EventEmitter = require('events').EventEmitter;

var logger = new EventEmitter();  // want EventEmitter to emit error, warning, and info events, and we want to write listeners for when those events occur

logger.on('error', function(message) {  // listen for error event, run callback
  console.log('ERR: ' + message);
})

logger.emit('error', 'Spilled Milk');   ==> 'ERR: Spilled Milk'

logger.emit('error', 'Eggs Cracked');   ==> 'ERR: Eggs Cracked'

### What's going on behind the scenes?

We write code that calls for a callback function every time our server emits a request event (http.createServer(function (request, response) { ... });)... but how is that event getting attached?

http://nodejs.org/api

Basically, we're creating the server and then adding a listener for the event, as shown below (equivalent to above):

var server = http.createServer();
server.on('request', function(request, response) { ... });

Similarly, if we wanted to listen for a close event, we would write:

server.on('close', function(request, response) { ... });


## Streams

How the data is being transferred back and forth -- where NodeJS shines.

Streams are like channels that data flows through. We need to be able to access data piece by piece (especially for large chunks of data, or when there is a lot of data flowing back and forth), so we can begin to manipulate data as soon as it comes in to the server, keeping it from being held in memory on the server all at once. 

Streams can be reeadable, writable, or both. 

(The API described here is for streams in Node v0.10x (aka streams2).)

http.createServer(function(request, response) {   // request is readable 
                                                  stream, response is writeable
  response.writeHead(200);
  response.write('Dog is running.');
  setTimeout(function() {
    response.write('Dog is done.');
    response.end();
  }, 5000);     // 5 second timeout
}).listen(8080); 

When we issue the request, the server responds with  a 200 status code and writes "Dog is running." to the stream. Our browser receives "Dog is running", then 5 seconds later "Dog is done." The channel from the server to the client is still good to receive data (stream is kept open) throughout the timeout. Finally we close the stream.

How do we read from the request?
Request object is a readable stream, and it inherits from the EventEmitter.
Request object can communicate with other objects through firing events. The events fired are 'readable', which is fired when the data is ready to be consument, and 'end', which is fired when the client is done sending all the data.

http.createServer(function(request, response) { 
  response.writeHead(200);
  request.on('readable', function() {
    var chunk = null;
    while (null !== (chunk = request.read())) {
      console.log(chunk.toString());   // print to the console the data we 
                                          receive from the request -- have to call toString function because the chunks we get are buffers, so we might be dealing with binary data
    }
  });
  request.on('end', function() {
    response.end();   // finish the response
  })
}).listen(8080);


^^^ Printing to the console the data that we get from the client. 
How might we echo back to the client the data we get from the request? Change one line... Instead of console.log, use response.write:

response.write(chunk);  // response.write does toString() behind the scenes

Now we are writing to a writable stream as soon as we can read from a readable stream --> Node has a helper method called pipe for both of these, handles all event listening and chunk reading behind the scenes. Now code looks like:

http.createServer(function(request, response) { 
  response.writeHead(200);
  request.pipe(response);
}).listen(8080);

$ curl -d 'hello' http://localhost:8080   ==> string is sent back ('hello' on client) 

Like pipe (|) on the command line, which streams the output of one operation to the input of the next one. Whenever you can, prefer  using pipe rather than listening for event and manually reading the chunks that come back -- can help protect your application from future breaking changes to the stream's API.

Node hasn't yet reached version 1.0, so you always want to check the docs for the stability score of the specific API you want to use -- each core module has a stability score -- The File System module has a score of 3, which is stable (no major changes expected). The Stream module has a score of 2, unstable (changes to the API are still possible). 

Next time a new version of Node comes out, it's important to check for changes to the Stream module, or any other unstable module that your application might be using.

### Reading and writing a file

We'll read contents of a file from one file and stream that to a destination file.

var fs = require('fs'); // require File System module

var file = fs.createReadStream('readme.md');
var newFile = fs.createWriteStream('readme_copy.md');

file.pipe(newFile);

Third-party libraries heavily depend on streaming capabilities, e.g. gulp

<strong>Gulp.js</strong> -- the build system that exposes the pipe function as its public API, so you can do all sorts of manipulation on assets with very few lines of code.

We can pipe any read stream into any write stream. Now we'll pipe the client request into the readme_copy file:

var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) { 
  var newFile = fs.createWriteStream('readme_copy.md');
  request.pipe(newFile);

  request.on('end', function() {
    response.end('uploaded!');
  }
}).listen(8080);

$ curl --upload-file readme.md http://localhost:8080  // run from client, passing in file as argument, and then we get the response back ('uploaded!')

We're streaming pieces of the file from the client to the server, and the server is streaming chunks of the file to disc as it reads them from the request. Never does the server hold the entire file in memory at once. And it's all non-blocking, so multiple files can be written at once.

We want to implement file uploading progress, so it will let us know what percentage of the way through the file we are at a given time. We're going to need HTTP server module and the File System module. We'll need to know the size of the file to be uploaded: var fileBytes = request.headers['content-length']; 

We'll create the uploadedBytes variable to monitor how many bytes were uploaded, and we'll initialize it to 0. Then, listening to the 'readable' event, we'll loop through and read each of the chunks from the request, incrementing the uploadedBytes with the length of each chunk inside the while loop. The progress will be the (uploadedBytes / fileBytes) * 100 -- stored as progess variable. Then we'll use the response.write function to send the progress percentage back to the client, using parseInt to round the number to an integer.

var fs = require('fs');
var http = require('http');

http.createServer(function(request, response) { 
  var newFile = fs.createWriteStream('readme_copy.md');
  var fileBytes = request.headers['content-length']; 
  var uploadedBytes = 0;

  request.on('readable', function() {
    var chunk = null;
    while (null !== (chunk = request.read())) {
      uploadedBytes += chunk.length;
      var progress = (uploadedBytes / fileBytes) * 100;
      response.write('progress: ' + parseInt(progress, 10) + '%\n');
    }
  });

  request.pipe(newFile); ==> taking care of the actual upload

  request.on('end', function() {
    response.end('uploaded!');
  }
}).listen(8080);

## Modules

In previous levels, we've brought in modules from other libraries (http and fs) so we could use their code.

How does require return these libraries, read these files? And how do we create one of our own? Two ways...

custom_hello.js                   custom_goodbye.js

var hello = function() {    ==>   exports.goodbye = function() {
  console.log('hello');             console.log('bye!');
}                                 }

module.exports = hello;   // exports defines what require returns

in app.js

var hello = require('./custom_hello');
var gb = require('./custom_goodbye');

hello();
gb.goodbye();

could also require and invoke in same line:
require('./custom_goodbye').goodbye();

Can have public and private functions within modules... e.g. 

my_module.js

var foo = function() { ... };
var bar = function() { ... };
var baz = function() { ... };

exports.foo = foo;
exports.bar = bar; // not exporting baz, it's private

in app.js
var myMod = require('./my_module');

myMod.foo();
myMod.bar();

### Refactor code for an http request into a module

var http = require('http');

var message = "Here's looking at you, kid."
var options = {
  host: 'localhost', port: 8080, path: '/', method: 'POST'
}

var request = http.request(options, function(response) {
  response.on('data', function(data) { // listen for data event
    console.log(data); // logs response
  });
});

request.write(message); // begins request
request.end();

BECOMES... make_request.js

var http = require('http');

var makeRequest = function(message) {  // refactor into function
  var options = {
    host: 'localhost', port: 8080, path: '/', method: 'POST'
  }

  var request = http.request(options, function(response) {
    response.on('data', function(data) { // listen for data event
      console.log(data); // logs response
    });
  });

  request.write(message); // begins request
  request.end();
}

module.exports = makeRequest;  

in app.js:

var makeRequest = require('./make_request')

makeRequest("Here's looking at you, kid.");
makeRequest("Hello, this is dog.");

Where does require look for modules? 

Using './' it looks in the same directory as app.js -- '../' would look up one directory (parent) -- could also specify absolute path

if you don't specify directory -- e.g. require('make_request') -- will look in node_modules directories (looking at app level first, then ascending to parent directories if it doesn't find it)

When you look inside node_modules folder, you see a bunch of directories (packages) -- managed by npm (Node package manager)

### NPM (http://npmjs.org)

  - comes with node
  - module repository
  - handles dependency management
  - easy to publish modules

If you want to install a package called 'request' in your app, you need to be in your app's top-level directory, then:

$ npm install request

And npm will install request module and all necessary dependencies in app/node_modules/request, and require will look for it there.

Installing packages globally:
$ npm install coffee-script -g
$ coffee app.coffee

Global npm modules can't be required, still have to install locally within your app.
$ npm install coffee-script (from app directory)
var coffee = require('coffee-script');

Search npm registry or github for modules that might do something you would otherwise need to code.

App needs a package.json file. 
{
  "name": "My App",
  "version": "1",
  "dependencies": {
    "connect": "1.8.7" // version number: 1 is major, 8 is minor, 7 is patch
  }
}

$ npm install will install all packages and dependencies listed in package.json file (e.g. my_app/node_modules/connect)

<strong>Bear in mind that if you are working on someone else's code on your local machine, you will not have the dependencies installed, so will have to run npm install for the app to run.</strong>

Each subdirectory in the node_module directory has a package.json of its own -- these are modules required for the parent module to run.

"dependencies": {
    "connect": "~1" // will install the most up-to-date version less than 2.0.0
  }

"dependencies": {
    "connect": "~1.8" //  most up-to-date version >= 1.8.0 but < 1.9.0
  }

Can check out semver.org to learn more about semantic versioning.

## Express

Node is very low level, so along comes Express to live on top -- Sinatra inspired web dev framework for Node -- fast, flexible, and simple

Out of the box, gives you:
  * Easy route URLs to callbacks
  * Middleware (from Connect)
  * Environment-based configuration
  * Redirection helpers
  * File Uploads

To start... var express = require('express'); // require the library, install if necessary

$ npm install --save express  // --save adds to dependencies in package.json
var app = express();

Then start defining endpoints:
app.get('/', function() {   // define root route endpoint
  response.sendFile(__dirname + "/index.html");  // dirname = current directory
});

app.listen(8080); // listening on port 8080

Want to create a route where you can enter a twitter user's usename, then return the most recent 10 tweets by that user:

app.js (code is now obsolete due to Twitter now requiring authentication): 

var request = require('request');
var url = require('url');

app.get('/tweets/:username', function(req, response) {  // route definition
  var username = req.params.username;
  options = {
    protocol: 'http:',
    host: 'api.twitter.com',
    pathname: '/1/statuses/user_timeline.json',
    query: { screen_name: username, count: 10 }  // get last 10 tweets for 
                                                    username
  }
  var twitterUrl = url.format(options);
  request(twitterUrl).pipe(response);   // pipe the request to response
});

$ node app.js   // start node server
$ curl -s http://localhost:8080/tweets/eallam ==> get back a big, garbled paragraph of recent tweets in JSON -- if you want more readable version, do the following:

$ npm install prettyjson -g  // gives executable so you can pipe response into prettyjson, as follows:

$ curl -s http://localhost:8080/tweets/eallam | prettyjson  ==> now more readable returned results

### Templates

First thing to do is install a templating library:
add "ejs": "1.0.0" to dependencies in package.json ==> embedded JavaScript, works exactly like erb (embedded Ruby)

app.js:

var request = require('request');
var url = require('url');

app.get('/tweets/:username', function(req, response) {
  var username = req.params.username;
  options = {
    protocol: 'http:',
    host: 'api.twitter.com',
    pathname: '/1/statuses/user_timeline.json',
    query: { screen_name: username, count: 10 } 
  }
  var twitterUrl = url.format(options);
  request(url, function(err, res, body) {
    var tweets = JSON.parse(body);
    response.locals = { tweets: tweets, name: username };
    response.render('tweets.ejs');
  });
});

tweets.ejs:

<h1>Tweets for @<% name %></h1>
<ul>
  <% tweets.forEach(function(tweet) { %>
    <li><%= tweet.text %></li>
  <% }); %>
</ul>

## Socket.io

A real-time app -- chat application in the browser using websockets

Traditional (browser) request / (server) response cycle -- browser sends request to server, waits for server to respond with something, then receives and renders what the response contains. Modern browsers with websockets allow a different interaction.

### Websockets
  * allow us to create a connection with each of our clients to the server
  * we can send data back and forth in real timeout (using duplexed websocket connection)
  * may not be compatible with every browser, so we need to use a library that abstracts websockets with fallbacks in case the websocket doesn't work --> socket.io

$ npm install --save socket.io  // install and add to package.json

var express = require('express');
var app = express();
var server = require('http').createServer(app); // server will dispatch requests to express
var io = require('socket.io')(server);  // now socket and express are sharing the same server

io.on('connection', function(client) {  // set up to listen for connection 
                                            events inside socket.io
  console.log('Client connected...');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');  // serve index.html file 
});

server.listen(8080);

Now in html we'll be sending through express, we need to include socket.io library and connect to socket.io server:

script src="/socket.io/socket.io.js">/script
script
  var socket = io.connect('http://localhost:8080');
/script

back in app.js, add emit method to socket connection:

io.on('connection', function(client) { 
  console.log('Client connected...');

  client.emit('messages', { hello: 'world' });  // emitting the messages event on our client
});

and in html, need to listen for messages events on the socket:

script
  var socket = io.connect('http://localhost:8080');
  socket.on('messages', function(data) {
    alert(data.hello);  // will listen for messages event that will transmit data that has a property of hello (whose value is 'world')
  });
/script

Now, start server: $ node app.js --- and go to http://localhost:8080, you get an alert popup that says 'world' -- this means socket has listened for and heard messages event -- connection established, and we've confirmed that our browser is listening for messages

However, now we need to set it up so that the browser can send chat messages to the server, and have the server listening for messages event.

io.on('connection', function(client) { 
  console.log('Client connected...');
  client.on('messages', function(data) {
    console.log(data); // listen for messages events and log what's received
  });
  client.emit('messages', { hello: 'world' }); 
});

Now set up some jQuery to capture the value of what the browser sends when the user submits a chat message (on <input id="chat_input">)

script
  var socket = io.connect('http://localhost:8080');
  $('#chat_form').submit(function(e) {
    var message = $('#chat_input').val();
    socket.emit('messages', message); /* emit to the socket the messages event 
                                          consisting of the data that the message variable refers to */
  });
  socket.on('messages', function(data) {
    alert(data.hello);  /* will listen for messages event that will transmit 
                          data that has a property of hello (whose value is 'world') */
  });
/script

Now start up node server again -- $ node app.js -- now messages are printing out on the console from client to server and vice versa

Since this is a chat app, we're going to want to broadcast messages from one client to the server and then back out to all the other clients, so we'll use socket.io's broadcast property.

in app.js:

io.on('connection', function(client) { 
  console.log('Client connected...');
  client.on('messages', function(data) {
    client.broadcast.emit('messages', data); /* broadcast msg to all other 
                                                connected clients */
  });
});

And on client side we want to revise the messages listener:
script
  socket.on('messages', function(data) {
    insertMessage(data); /* function not shown, but uses jQuery to print msg on 
                            screen */
  });
/script

var insertMessage = function(message){
  var newMessage = document.createElement('li');
  newMessage.innerHTML = message;
}

Restart server, open two browsers so there are two clients connected -- now it's sending one client's msg out to the other's and vice versa, but there are no usernames, and each user cannot see his own messages.

To add usernames, we'll add a join event to the io.on function in app.js:

io.on('connection', function(client) { 
  console.log('Client connected...');
  client.on('join', function(name) {
    client.nickname = name;  /* setting value this way means name will be 
                                available on server and client */
  });
  client.on('messages', function(data) {
    client.broadcast.emit('messages', data);
  });
});

Back in index.html (changing socket to server):

script
  var server = io.connect('http://localhost:8080');
  server.on('connect', function(data) {
    $('#status').html('Connected to chattr');
    nickname = prompt('What is your nickname?');
  })
  server.emit('join', nickname); // notify the server of the user's nickname

  var socket = io.connect('http://localhost:8080');
  $('#chat_form').submit(function(e) {
    var message = $('#chat_input').val();
    socket.emit('messages', message); 
  socket.on('messages', function(data) {
    alert(data.hello); 
  });
/script

And now we need to alter the messages event at the server to display the user's nickname along with his message:

io.on('connection', function(client) { 
  console.log('Client connected...');
  client.on('join', function(name) {
    client.nickname = name; // set the nickname associated with this client
  });
  client.on('messages', function(data) {
    var nickname = client.nickname; /* get the nickname of this client before 
                                        broadcasting the message */
    client.broadcast.emit('messages', nickname + ": " + message); /* broadcast 
                                                                  to all other clients 
                                                                  with the name and the message */
    client.emit('messages', nickname + ": " + message); /* send the same 
                                                            message back to our current client, the one that evoked the message event */
  });
});

## Persisting Data

In chat app, when user joins chat he cannot see existing messages (as is usually the case), but how could we set it up so that he can see a couple previous messages? This is where persisting data will come into play.

Existing code:

io.sockets.on('connection', function(client) {
  client.on('join', function(name) {
    client.set('nickname', name);
    client.broadcast.emit('chat', name + ": " + " joined the chat")
  });
  client.on('messages', function(message) {
    client.get('nickname', function(error, name) {
      client.broadcast.emit('messages', name + ": " + message);
      client.emit('messages', name + ": " + message);
    });
  });
});

To store messages on server, create a messages array and push new messages intoit:

var messages = []; // store messages in array
var storeMessage = function(name, data) {
  messages.push({name: name, data: data}); // add msg to end of array
  if (messages.length > 10) {
    messages.shift(); // if there are more than 10 msgs, remove the first
  }
}
And in messages listener, after message is emitted, store the message that we just received:
  client.broadcast.emit('messages', name + ": " + message);
  client.emit('messages', name + ": " + message);
  storeMessage(name, message);

And in the client join event listener:

  client.on('join', function(name) {
    messages.forEach(function(message) { /* iterate through the messages array 
                                          and emit a message on the connecting client for each of them /*
      client.emit('messages', message.name + ": " + message.data);
    })
    client.set('nickname', name);
    client.broadcast.emit('chat', name + ": " + " joined the chat")
  });

Now when a user joins the chat, the most recent 10 messages show up upon join, but if the server crashes, all the messages will disappear.

How to persist data even if server restarts? Database!

Node works well with MongoDB, CouchDB, PostgreSQL, Memcached, Riak, Redis -- all of which have <strong>non-blocking drivers</strong>. With blocking drivers, when you make a SQL request, the process just hangs there while the server waits for the DB to return. With non-blocking drivers, you can submit multiple simultaneous queries and keep doing work while you wait for the DB response.


Redis (key-value store) Data Structures and Commands -- redis.io
  - Strings (GET, SET, APPEND, DECR, INCR...)
  - Hashes (HSET, HGET, HDEL, HGETALL...)
  - Lists (LPUSH, LREM, LTRIM, RPOP, LINSERT...)
  - Sets (SADD, SREM, SMOVE, SMEMBERS...)
  - Sorted Sets (ZADD, ZREM, ZSCORE, ZRANK)

To connect Node application to a Redis database, need to use the Node_Redis library, which can be found on GitHub -- $ npm install redis --save

var redis = require('redis');
var client = redis.createClient();

client.set('message1', 'hello, yes this is dog.'); /* first argument is key, */
client.set('message2', 'hello, no this is spider.'); /* second is value */

To get the messages out of the database, we call:

client.get('message1', function(err, reply) {
  console.log(reply);  ==> 'hello, yes this is dog.'
});

We're going to store a list of messages in the redis DB:
Add a string to the 'messages' list, using: 
  * LPUSH to push it into array
  * LTRIM to only keep a certain number of strings in the list
  * LRANGE to retrieve a string from the list

var message = 'Hello, this is dog.';
client.lpush('messages', message, function(err, reply) {
  console.log(reply); // '1', replies with list length
});

Add another string to 'messages':
var message = 'Hello, no this is spider.';
client.lpush('messages', message, function(err, reply) {
  console.log(reply); // ==> '2', replies with list length
  client.ltrim('messages', 0, 1); // trim keeps the first two strings only
});

Retrieving from the list:
client.lrange('messages', 0, -1, function(err, messages) {
  console.log(messages); // 0 to -1 replies with all the strings in the list
})

Now we need to rewrite our storeMessage function to use redis rather than server memory:

var redisClient = redis.createClient();

var storeMessage = function(name, data) {
  var message = JSON.stringify({name: name, data: data}); /* turn object in to 
                                                              string to store in redis  
  redisClient.lpush('messages', message, function(err, reply) {
    redisClient.ltrim('messages', 0, 9); // keeps newest 10 messages
}

We also have to modify our old 'join' listener:

  client.on('join', function(name) {
    redisClient.lrange('messages', 0, -1, function(err, messages) {
      messages = messages.reverse(); /* reverse so they're emitted in 
                                        correct order /*
      messages.forEach(function(message) {
        message = JSON.parse(message); // parse into JSON object
        client.emit('messages', message.name + ": " + message.data);
      })
    })
  });

Also, we want to show a list of users that are currently in the chatroom. We'll use the redis 'set' data type to do this. Sets are lists of unique data.
We'll use SADD, SREM, SMEMBERS commands:
  * SADD('[name of set]', '[name of member]'); to add to set
  * SREM('[name of set]', '[name of member]'); to remove from set
  * SREM('[name of set]', function(err, names) { ... }); to list all in set

We'll add the chat member to our redis set upon join:
client.on('join', function(name) {
  client.broadcast.emit('add chatter', name); /* notify other clients a 
                                                 chatter has joined */
  redisClient.sadd('chatters', name); // add name to chatters set
})

And in our client, we need to define the 'add chatter' listener:
script
  socket.on('add chatter', function(name) {
    var chatter = $('<li>' + name + '</li>').data('name', name);
    $('#chatters').append(chatter);
  })
/script

But, when someone joins the chat, there may already be chatters in the chatroom (members in our set), so we need to check for that. Continuing:

client.on('join', function(name) {
  client.broadcast.emit('add chatter', name);
  redisClient.smembers('names', function(err, names) {
    names.forEach(function(name) {
      client.emit('add chatter', name); /* emit all the currently logged in 
                                           chatters to the newly connected client
    }); 
  });
  redisClient.sadd('chatters', name); // add name to chatters set
})

And now we need to remove chatters when they disconnect. In app.js:

client.on('disconnect', function(name) {
  client.get('nickname', function(err, name) {
    client.broadcast.emit('remove chatter', name);
    redisClient.srem('chatters', name);
  });
});

And in index.html:
script
  server.on('remove chatter', function(name) {
    $('#chatters li[data-name=' + name + ']').remove();
  });
/script

# Code School's Soup to Bits NodeJS Application
[PubSub server source code](https://github.com/codeschool/nodejs-soup-to-bits-pub-sub-server)
[Web server source code](https://github.com/codeschool/nodejs-soup-to-bits-web-server)

App architecture:
PostgreSQL 
  --> Polling Script
    --> Pub/Sub Server
      --> Web Server (socket.io, express)

Use polling script to poll the DB for new badges every 8 seconds. When new badge is found, we'll push it onto an array of badges. We'll take the data we get back and send it to a pub/sub server (that Code School has created) via HTTP POST request. The Pub/Sub server will communicate back and forth with a Redis database to save and return the most recent ten badges.

[A pub/sub server allows anyone to connect to it (could be ten clients) and ask for new data -- it's a 'pub'lication server that your node server can 'sub'scribe to to fetch data.]

We'll send the data out to a web server that will in turn stream the badges out to a web browser via socket.io.

[express](github.com/visionmedia/express)
[axon](github.com/visionmedia/axon)

Going to build two node applications. The first will be the pub/sub server, and the second will be the client that will subscribe to the pub/sub server and stream badges to browser.

We'll use express to handle incoming data from the polling script -- this will be our HTTP server.

For our pubsub, we'll use something called axon. Have a publisher on top that binds to a port, and a subscriber on the bottom that connects to a port or a different remote host and wait for messages events to happen.

We'll use redis client for our database to store a recent list of badges.

And we'll use the underscore utility library for a few things as well.

$ mkdir node_code_school
$ cd node_code_school/
$ mkdir pubsub
$ cd pubsub
$ npm init // asks name, version, description, etc. to fill out package.json
$ npm install express axon redis underscore --save
  // --save adds these as dependencies in package.json, but added 4.12.4, and they want to use something in the 3's for this tutorial, so edit package.json from "express": "4.12.4" to "express": "^3.0.0"
$ npm install // again, after altering express version -- now is 3.20.3
$ vim .gitignore // add to line 1: node_modules --> thensave and exit
$ vim app.js // add to line 1: 'use strict'; ECMAscript 5 feature for linting

[Linting basically analyzes code to check for egregious errors with formatting, conventions, etc., things that are likely to cause code to break.]

save, exit, and subl . to open project in Sublime Text editor (or whichever you prefer)

We'll use

The script that's running (and was set up prior to the course by Code School) is already sending out data (badges) in JSON format. But we need to tell express to interpret the request bodies that are coming in, so we'll use middleware to do that. Middleware are functions that on requests when they come in -- an app.use() function will run on every single request that comes in -- and each request will go through middleware before it gets to our declared route.

In this case, we'll declare middleware to parse the incoming request body before reaching the route.

set up app.js
/*
'use strict';

var express = require('express');
var app = express();

app.use(express.json()); /* invoke json method to interpret incoming json body, if it meets criteria -- it has to be a post request and have the Content-Type 'application/json' */

app.post('/', function(req, res) {
  res.send('hello world');
});

app.listen(8000, function() {
  console.log('Listening on port 8000')
});
*/

They use http POST rather than curl, a python tool he installed with PIP

There's global middleware and there's route-specific middleware. Think of middleware as controllers. Rather than putting a lot of logic in our app.js, we're going to encapsulate a lot of the logic into controllers that will receive the requests -- middleware. 

So, when we receive a request to this route (a post request to the root route), we're going to send it to the controller middleware, which we'll call badges.save and badges.send. badges is the name of the controller, save and send are the names of the method on the badges object.

/*
'use strict';

var express = require('express');
var app = express();
var badges = require('./controllers/badges');

app.use(express.json()); /* invoke json method to interpret incoming json body, if it meets criteria -- it has to be a post request and have the Content-Type 'application/json' */

app.post('/', badges.save, badges.send); // save will save badges coming in from pub sub, send will publish them back out
/* could have anonymous function to terminate response here -- e.g res.render('dashboard'); -- after middleware next(), next(), but instead will terminate inside badges.send */

app.listen(8000, function() {
  console.log('Listening on port 8000')
});
*/

Set up our badges middleware in controllers directory at the same level as app.js:
$ mkdir controllers
$ cd controllers/
$ touch badges.js

/*
'use strict';

var _ = require('underscore');
var model = require('../models/badges');
/*
 Send badges to model to be saved
*/
exports.save = function(req, res, next) {
  var badges = _.clone(req.body); /* underscore method to copy req.body before we manipulate it, so that we don't alter the original object, delete its contents, etc. */ 
  model.save(badges, fuction(error) { // when function is invoked, we're done saving to the database
    if (error) return res.json(503, { error: true }); /* res.json takes in an object, stringifies it to json and sends it back to the polling script with the appropriate content-type headers -- pass in status code 503, tells client there was an internal server error, unable to save */
    next(); // if no error, we've saved and go to next middleware
  });
};

/*
 Send badges to pub/sub socket in model
*/
exports.send = function(req, res, next) {
  next();
};
*/

We're going to send the req.body object clone to the model to save, so we need to cd into the main directory and create models directory and, inside it, a badges model:
$ mkdir models
$ cd models/
$ touch badges.js

/*
'use strict';

var redis = require('../lib/redis');

/*
Save badges to database
@param {Array} badges
@param {Function} callback
*/

exports.save = function(badges, callback) {

};
*/

We have a save method on model that saves the badges object to the database, so we need to create that. Will take in a badges array and a callback, which will be invoked within the save function to tell the callee when the save is complete. We need to create a reference to our database. The controller has no notion of a database, it doesn't care, but the model does. So we'll create a lib directory and set up a redis file within it. So, from main directory

$ mkdir lib
$ cd lib/
$ touch redis.js

/*
'use strict';

var redis = require('redis'); // require the database driver
var client = redis.createClient(); 
  /* initiate new connection -- since we're running the client locally, we don't need to pass in any parameters to the createClient() method as to where that client would be  -- connects to default localhost properties of a redis server, runs on port 6379 */

  // check github.com/mranney.node_redis 'Usage' for documentation

  /* if you needed to select a certain database, you'd issue client.select(integer, function() {};) -- defaults to 0 if you don't explicitly tell it which database to use */

  client.on("error", function (err) {
    console.log("Error " + err); 
      /* first thing to do is set up an error alert -- very important, because in node, if you have an error on a socket (something that's communicating over the network, or a stream that comes off your file system, or an http request), somewhere between the remote and your application, that error propagates back to your stream. You need to handle it, because if one of your connections isn't working properly, your application will start leaking memory and not responding quickly. Else your process will exit */
  });

module.exports = client; // expose the client
*/

So we'll create an asynchronus recursive badges save function in our model:
/*
'use strict';

var redis = require('../lib/redis');
var client = redis.createClient();

/*
Save badges to database
@param {Array} badges
@param {Function} callback
*/

exports.save = function(badges, callback) { //asynchronous recursion
  if (!badges.length) return callback(null, null); /* once there are no more badges in the array, complete callback with null value for error and null value for data */
  var badge = badges.pop(); /* remove last item from badges array and assign to badge */
  redis.lpush('badges', JSON.stringify(badge), function(err) { /* push the badge object into the database, but have to send strings to redis, not objects, so have to stringify */
    if (err) return callback(err, null); /* truthy error, null value for the data */
    exports.save(badges, callback); /* function will run until there are no more badges in the array */
  }); 
};
*/

Back in our controller:
exports.save = function(req, res, next) {
  var badges = _.clone(req.body); /* underscore method to copy req.body before we manipulate it, so that we don't alter the original object, delete its contents, etc. */ 
  model.save(badges, function(error) { /* when function is invoked, we're done saving to the database -- recursively works its way through the array of badges, saving each one */
    if (error) return res.json(503, { error: true }); /* res.json takes in an object, stringifies it to json and sends it back to the polling script with the appropriate content-type headers -- pass in status code 503, tells client there was an internal server error, unable to save */
    next(); // if no error, we've saved and go to next middleware
  });
};

### Integration Test

To test that the save function is working, can set up a dummy function for the post route so that the response will terminate:

app.post('/', badges.save, badges.send, function(req, res) {
  res.send('\ndone\n\n');
});

then start up the database ($ redis-server), start up the app server ($ node app.js),

$ curl -X POST http://localhost:8000 \ //jump to new line
  -H "content-type: application/json" \ // header value, jump again
  -d '[{"badge_id":"foo bar badge"}]' // pass in literal JSON string, array with one object in it

==> returns 'done'

Now, can check to see if the 'foo bar badge' data was actually pushed into redis:

$ redis-cli // command-line interface with redis DB

127.0.0.1:6379>LRANGE badges 0 -1
1) "{\"badge_id\":\"foo bar badge\"}"

run POST again...
127.0.0.1:6379> LRANGE badges 0 -1
1) "{\"badge_id\":\"foo bar badge\"}"
2) "{\"badge_id\":\"foo bar badge\"}"

So it pushed the foo badge in again. Now let's clear the DB:

127.0.0.1:6379> LPOP badges
"{\"badge_id\":\"foo bar badge\"}"
127.0.0.1:6379> LPOP badges
"{\"badge_id\":\"foo bar badge\"}"
127.0.0.1:6379> LPOP badges
(nil) // third time we popped, there was nothing left to pop

OK, so redis is hooked up and the save function (middleware and model) is working properly, but we only want to store ten badges at a time in the redis DB, so we have a few options for where to put the TRIM:

1) Can add it to the save middleware function
2) Can set up a distinct TRIM middleware
3) Can out it in the send middleware function 
4) We could put TRIM in the model, but the model is recursive, so that would be weird

We'll drop it into the save function in the badges controller, after the next() function. Since this middleware function is not returning a value, you can have it continue to do things (asynchronously) even after you've kicked the POST process off to the next middleware (synchronously) in the sequence.

Start with trim function in badges model:

/*
* Trim the redis list
*/
/*
exports.trim = function() {
  redis.ltrim('badges', 0, 9); // caps the badges list at ten items
};
*/

and in the controller:

/*
model.save(badges, function(error) { /
  if (error) return res.json(503, { error: true }); 
  next();
  model.trim();
*/

We add the one-line trim function in the model and then call it in the controller rather than just writing it in the controller because we don't really want our controller to communicate with the database. Keeps a level of abstraction there. 

Now we will tackle the send middleware, using axon, we'll create a module to deal with our pubsub that sends data out:

$ touch lib/broadcast.js

in badges controller:
/*
exports.send = function(req, res, next) {
  var badges = _.clone(req.body);
  model.send(badges, function(error) {
    if (error) return res.json(503, { error: true });
    res.json(200, { error: null }); /* when we're done, send a response with a 200 status code and say the error is null */
  });
  next();
};
*/

in badges model:

/*
* Send out badges to the broadcaster
* @param {Array} badges
* @param {Function} callback
*/
/*
exports.send = function(badges, callback) {
  badges.forEach(broadcast.send); // what's the ideal interface to send out these badges?
  /* OR badges.forEach(function(badge) {
          broadcast.send(badge);
        }); */
  callback(null, null); // null for error, null for data
    /* we accept a callback just in case some time in the future something changes, we won't have to change our controller, which right now is waiting for a callback to be invoked */
};
*/

At this point, broadcast doesn't exist, so doesn't have send method, have to create:

var broadcast = require('../lib/broadcast'); // add to top of badges model

Now, to broadcast.js:
/*
'use strict';

var axon = require('axon');
var socket = axon.socket('pub'); // check [axon docs](github.com/visionmedia/axon)

socket.bind(8001);
*/
/*
* Send a badge to the publish socket
*/
/*
exports.send = function(badge) {
  socket.send(badge); // axon has built-in send method on socket
};
// could actually do: exports.send = socket.send; -- but changes value of 'this'
*/

So, the publish socket is bound to this machine's port 8001, so the send method sends all published data through that port. Axon knows how to listen for data, so we don't have to define any endpoints. We'll connect with a remote host (with a defined IP address and port number) to get data, and Axon will take care of the rest.

We'll provide an HTTP endpoint that clients can connect to and receive the initial ten badges when they connect, and then the client will receive all subsequent badges down the socket as they occur. 

So, we need to set up a badges get route:

app.get('/badges', badges.get); // and need new controller and model methods

in controller:
/*
 Get 10 badges from model (in turn from DB)
*/
/*
exports.get = function(req, res) {
  model.get(function(error, data) {
    if (error) return res.json(503, { error: true });
    res.json(200, data); // will make sense of json
  })
};
*/

and in model:

exports.get = function(callback) {
  redis.lrange('badges', 0, -1, function(err, data) {
    if (err) return callback(err, null);
    callback(null, data.map(JSON.parse));
      /* interprets data coming back from redis, an array of strings, an converts into an array of objects -- return that value to the controller in the res.json(200, data) above */
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

We have the same callback function in the model and the controller, so could conceivably just say (in model) 
exports.get = function(callback) {
  redis.lrange('badges', 0, -1, callback); 
};

To test it out:

$ redis-server  // start database
$ nope app.js   // start web server
$ redis-cli     // command-line interface with redis DB

Send the following a number of times (10 for me):
$ curl -X POST http://localhost:8000 -H "content-type: application/json" -d '[{"badge_id":"foo bar badge"}]'

==> returns
{
  "error": null
}

now can $ curl http://localhost:8000/badges //
==> returns (GETs all badges -- 10 of them)
[
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  },
  {
    "badge_id": "foo bar badge"
  }
]

At this point, our pub-sub server is working!

##Setting up socket with socket.io
We're going to create a new repo now for the web server

$ mkdir webserver
$ cd webserver/
$ npm init // set up package.json

{
  "name": "webserver",
  "version": "1.0.0",
  "description": "node soup to bits webserver",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "MIT"
}

$ npm install axon express socket.io request --save 
/* request is utility to perform HTTP requests (hany way to deal with the /badges woute we exposed on ou pub-sub server) */
$ mkdir lib models public
$ touch app.js

in app.js:
/*
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

/* 
* TJ's convention is to have backend servers on port 3000, 
* servers that render views/interact with browser on 8000
*/
/*
server.listen(3000, function() {
  console.log('Server is running on port %d', 3000);
});
*/

/*
* Serve static assets out of public directory
*/
/*
app.use(express.static('public'));
*/

/* the following is unnecessary, implicitly handled
* by the app.use...static above, but helps with clarity
*/
/*
app.get('/', function(req, res) {
  res.sendfile('./public/index.html'); // sends file from public
});
*/

Test out that everything is set up properly:
$ node app.js 
Server is running on port 3000

Let's set up our index.html file in the public directory:
/*
<!DOCTYPE html>
<html>
  <head>
    <title>Soup to bits</title>
    <link href="/css/souptobits.css" rel="stylesheet">
  </head>
  <body>
    <div class="badge-wrapper"></div>
    <script src="/js/jquery.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/souptobits.js"></script>
  </body>
</html>
*/

And we need to set up a module for the socket, which is the subscribe end of the pub-sub:
$ touch lib/subscribe.js

/* subscribe.js:
'use strict';

var axon = require('axon');
var socket = axon.socket('sub'); 
// now doing subscribe socket, refer to axon docs

// we need to connect our socket to the port
socket.connect(8001);
*/
/*
* Since this is an event emitter, we should be 
* listening for an error event.
* axon docs recommend the following:
*/
/*
socket.on('error', function(err) {
  throw err;
});

module.exports = socket;
*/

And then, back in app.js:
/*
// require the subscribe socket so we can hook it up to server
var subSocket = require('./lib/subscribe');
*/
/*
io.sockets.on('connection', function(socket) {
  // pre-fill user's screen with content (badges) when browser connects
  badges.get(function(err, data) {
    if (err) return;
    data.forEach(function(badge) { // sends each item in the array of badges
      socket.emit('badge', badge);
    });
  });
});
*/
/* 
* Hook up subSocket to socket.io
* When we get a message (a badge) from out subscribe socket
*/
subSocket.on('message', function(message) {
  io.socket.emit('badge', message); 
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

**In Node, anywhere you have a callback you need to check for an error. Think about how many layers data has to pass through to get it from the database to the client. When the browser (client) makes a request to your http router, it passes through middleware in our controller, which calls on the model, which calls on the database, and the response data has to pass back through each of them. So we need to anticipate an error at any point, that the notification of the error propagates all the way up the call stack to that response.**

In our io.socket.on('connection'...) in app.js, we call the get method on the model, so we need to create that now. And also require the badges model at the top of our app.js. (var badges = require('./models/badges');)

$ touch models/badges.js

/* badges.js:

'use strict';

var request = require('request'); // to communicate with remote server
*/
/*
* Get badges from the pub-sub server 
* @param {Function} callback
*/
/*
exports.get = function(callback) {
*/
  /* 
  * [request docs](https://www.npmjs.com/package/request)
  * request pre-fills the body of the response, and it's 
  * a string, so need to JSON.parse
  */
/*  
  request('http://localhost:8000/badges', function(err, response, body) {
    callback(err, JSON.parse(body));
  });
};
*/

Need to add css, js files for souptobits from github (and jquery, which you can do by running $ curl http://code.jquery.com/jquery-1.11.3.min.js > public/jquery.js)

We'll write out our front-end JavaScript in our souptobits.js file:
/*
'use strict'; 
// Can use ^^ even in browsers that don't support it.
// Browser just reads as a string literal and disregards.

$(function(){ // jQuery's DOM.ready -- invoke when DOM loaded
  var socket = io.connect(); 
*/
  /* 
  * 1) Connect to socket.io
  * 2) Listen for events
  * 3) Put them into the DOM
  * If you call connect with no arguments, it connects
  * to the same host that the browser loaded the page from.
  */

  /* On badge event, we're getting singular badges 
  * (due to forEach function in badges.get in model).
  * We create an image tag for each of them and prepend
  * the image to the html body element with class attribute 
  * 'badge-wrapper'
  */
/*  
  socket.on('badge', function(badge){
    var img = $('<img src="'+badge.badge_id+'">');
    $('.badge-wrapper').prepend(img);

    setTimeout(function(){
      img.addClass('on');
    }, 0);
  });
});
*/

TJ created a [script that creates artificial data](https://gist.github.com/TJkrusinski/10735569), has array of badge objects
Outside of pubsub and webserver:

$ mkdir producer
$ cd producer/
$ npm init

here's the package.json info:

{
  "name": "producer",
  "version": "0.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "TJ Krusinski <tjkrus@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "arrandom": "0.0.3",
    "request": "^2.34.0"
  }
}

/* producer.js:
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
*/
