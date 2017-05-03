/**
 * server.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
//Gets Node.js http module
var http = require("http");

//import fs and querystring
var fs = require("fs");
var queryString = require('querystring');

//Index pages
var index = fs.readFileSync(__dirname + "/../client/index.html");
var indexCss = fs.readFileSync(__dirname + "/../client/styles/main-page.css");
var indexScript = fs.readFileSync(__dirname + "/../client/scripts/main-page.js");
var jsGlobals = fs.readFileSync(__dirname + "/../client/scripts/globals.js");

//Stores the port number we are going to be listening to
var port = process.env.port || 3000;

//////////////////////////////Helper functions///////////////////////////////////
//writes a request with the specified errorcode, message, and type
var writeMessage = function(response,errCode,msg,type){
  response.writeHead(errCode, {"Content-Type": type});
  response.write(msg);
  response.end();
};

///////////////////////////////Main code///////////////////////////
//Handles a request
var onRequest = function(request,response){
  var urlChunks = request.url.split("?");
  var url = urlChunks[0];
  var params = queryString.parse(urlChunks[1]);
  
  console.dir(url);
  
  try{
    switch(url){
      case "/getList":
        var contentType = "text/plain";
        
        var api = params.api;
        
        if(!api){
          writeMessage(response,400,"Bad Request Error - Missing an api.",contentType);
          return;
        }
        writeMessage(response,200,"No errors.",contentType);
        break;
      case "/styles/main-page.css":
        writeMessage(response,200,indexCss,"text/css");
        break;
      case "/scripts/globals.js":
        writeMessage(response,200,jsGlobals,"text/javascript");
        break;
      case "/scripts/main-page.js":
        writeMessage(response,200,indexScript,"text/javascript");
        break;
      case "/":
      default:
        writeMessage(response,200,index,"text/html");
        break;
    }
  }
  catch(err){
    if(url = "/getList"){
      writeMessage(response,200,"Error - " + err.message,"text/plain");
    } else{
      writeMessage(response,200,JSON.stringify(err),"text/json");
    }
  }
};



http.createServer(onRequest).listen(port);

console.log("The server is running (port - " + port + ").");

