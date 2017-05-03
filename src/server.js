/**
 * server.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
//Gets Node.js http module
var http = require("http");

var fs = require("fs");

//Stores the port number we are going to be listening to
var port = process.env.port || 3000;

//Handles a request
var onRequest = function(request,response){
  
}

http.createServer(onRequest).listen(port);

console.log("The server is running (port - " + port + ").");