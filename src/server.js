/**
 * server.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/

//gets Node.js http module
var http = require("http");

//import fs and querystring
var fs = require("fs");
var queryString = require('querystring');

//index pages
var index = fs.readFileSync(__dirname + "/../client/index.html");
var indexCss = fs.readFileSync(__dirname + "/../client/styles/main-page.css");
var indexScript = fs.readFileSync(__dirname + "/../client/scripts/main-page.js");

//other scripts
var nodeGlobals = require("./globals.js");
var jsGlobals = fs.readFileSync(__dirname + "/../client/scripts/globals.js");
var fetchAPIs = require("./fetchAPIs.js");

//stores the port number we are going to be listening to
var port = process.env.PORT || process.env.NODE_PORT || 3000;



///////////////////////////////Main code///////////////////////////
//handles a request to the server
var onRequest = function(request,response){
  //stores the url and parameters
  var urlChunks = request.url.split("?");
  var url = urlChunks[0];
  var params = queryString.parse(urlChunks[1]);
  
  //Decides what to do next based on url
  try{
    switch(url){
      //these urls trigger a get function involving external apis
      case "/List":
      case "/getList":
        var contentType = "text/plain";
        
        var api = params.api;
        var url = params.url;
        var limit = Number.parseInt(params.limit) || 100;
        
        //checks if there is an api specified, api is a required parameter
        if(!api){
          nodeGlobals.write(response,400,"Bad Request Error - Missing an api.",contentType);
          return false;
        }
        //checks if api has an acceptable value
        if(nodeGlobals.SITES[api] == undefined){
          nodeGlobals.write(response,400,"Bad Request Error - Invalid api, api options are MediaWiki and Wikia",contentType);
          return false;
        }
        //sets the url if a url parameter was not given the program uses the default
        var fullURL = (url || nodeGlobals.SITES[api]);
        
        //runs a different api data retrievial method depending on the api
        switch(api){
          case "MediaWiki":
            fetchAPIs.fetchMediaWikiList(response,fullURL,limit);
            break;
          case "Wikia":
            fetchAPIs.fetchWikiaList(response,fullURL,limit);
            break;
        }
        break;
      //serves the css page for the index
      case "/styles/main-page.css":
        nodeGlobals.write(response,200,indexCss,"text/css");
        break;
      //serves the globals script for client-side files
      case "/scripts/globals.js":
        nodeGlobals.write(response,200,jsGlobals,"text/javascript");
        break;
      //serves the index script
      case "/scripts/main-page.js":
        nodeGlobals.write(response,200,indexScript,"text/javascript");
        break;
      //serves the index page
      case "/":
      default:
        nodeGlobals.write(response,200,index,"text/html");
        break;
    }
  }
  catch(err){
    //if anything goes wrong - write an error response
    if(url = "/getList"){
      nodeGlobals.write(response,400,err.name + " - " + err.message,"text/plain");
    } else{
      nodeGlobals.write(response,400,JSON.stringify(err),"text/json");
    }
  }
};

//creates and starts a new server
http.createServer(onRequest).listen(port);
