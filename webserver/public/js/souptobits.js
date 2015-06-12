'use strict'; 
// Can use ^^ even in browsers that don't support it.
// Browser just reads as a string literal and disregards.

$(function(){ // jQuery's DOM.ready -- invoke when DOM loaded
  var socket = io.connect(); 
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
  socket.on('badge', function(badge){
    var img = $('<img src="'+badge.badge_id+'">');
    $('.badge-wrapper').prepend(img);

    setTimeout(function(){
      img.addClass('on');
    }, 0);
  });
});