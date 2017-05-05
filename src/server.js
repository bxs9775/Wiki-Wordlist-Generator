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

//Other scripts
var nodeGlobals = require("./globals.js");
var jsGlobals = fs.readFileSync(__dirname + "/../client/scripts/globals.js");
var fetchAPIs = require("./fetchAPIs.js");

//Stores the port number we are going to be listening to
var port = process.env.PORT || process.env.NODE_PORT || 3000;



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
        var url = params.url;
        var limit = Number.parseInt(params.limit) || 100;
        
        if(!api){
          nodeGlobals.write(response,400,"Bad Request Error - Missing an api.",contentType);
          return false;
        }
        if(nodeGlobals.SITES[api] == undefined){
          nodeGlobals.write(response,400,"Bad Request Error - Invalid api, api options are MediaWiki and Wikia",contentType);
          return false;
        }
        var fullURL = (url || nodeGlobals.SITES[api]);
        
        switch(api){
          case "MediaWiki":
            fetchAPIs.fetchMediaWikiList(response,fullURL,limit);
            break;
          case "Wikia":
            console.log("Wikia");
            fetchAPIs.fetchWikiaList(response,fullURL,limit);
            break;
        }
        break;
      case "/styles/main-page.css":
        nodeGlobals.write(response,200,indexCss,"text/css");
        break;
      case "/scripts/globals.js":
        nodeGlobals.write(response,200,jsGlobals,"text/javascript");
        break;
      case "/scripts/main-page.js":
        nodeGlobals.write(response,200,indexScript,"text/javascript");
        break;
      case "/":
      default:
        nodeGlobals.write(response,200,index,"text/html");
        break;
    }
  }
  catch(err){
    if(url = "/getList"){
      console.dir(err);
      nodeGlobals.write(response,400,err.name + " - " + err.message,"text/plain");
    } else{
      nodeGlobals.write(response,400,JSON.stringify(err),"text/json");
    }
  }
};



http.createServer(onRequest).listen(port);

console.log("The server is running (port - " + port + ").");

