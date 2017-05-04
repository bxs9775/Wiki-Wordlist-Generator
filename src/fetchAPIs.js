/**
 * fetchAPIs.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";

var jsGlobals = require("./globals.js");

/////////////////////Node dependencies//////////////////////////
var MediaWiki = require("mediawiki");
var Client = require("node-rest-client");

var bot = new MediaWiki.Bot();
var client = new Client.Client();

//Fetches a list of words from a wiki using the MediaWiki API
var fetchMediaWikiList = function(response,url,limit){
  try{
    bot.settings.endpoint = url + "/w/api.php";
    
    bot.get({ action: "query", list:"allpages", aplimit: limit, apfrom:"0"}).complete(function(list){
      console.log("Fetching from MediaWiki");
      jsGlobals.write(response,200,JSON.stringify(list),"text\plain");
    });
  }
  catch(e){
    jsGlobals.write(response,400,e.name + " - " + e.message,"text/plain");
  }
};

//Fetches a list of words from a wiki using the Wikia API
var fetchWikiaList = function(response,url,limit){
  console.log("Fetching from Wikia");
  try{
    //Sets up the starting params
    var urlFULL = url + "/api/v1/Articles/List";
    var args = {
      namespaces: {ns:0},
      limit: limit
    };
    
    client.get(urlFULL,args,function(data,statusResponse){
      //console.log(data);
      
      jsGlobals.write(response,200,JSON.stringify(data),"text\plain");
    });
  }
  catch(e){
    jsGlobals.write(response,400,e.name + " - " + e.message,"text/plain");
  }
};

//Exporting
module.exports.fetchMediaWikiList = fetchMediaWikiList;
module.exports.fetchWikiaList = fetchWikiaList;