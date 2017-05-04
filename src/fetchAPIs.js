/**
 * fetchAPIs.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";

var jsGlobals = require("./globals.js");

/////////////////////Node dependencies//////////////////////////
var MediaWiki = require("mediawiki");

//Fetches a list of words from a wiki using the MediaWiki API
var fetchMediaWikiList = function(response,url,limit){
  var bot = new MediaWiki.Bot();
  bot.settings.endpoint = url + "/w/api.php";
  
  bot.get({ action: "query", list:"allpages", aplimit: limit}).complete(function(list){
    jsGlobals.write(response,200,JSON.stringify(list),"text\plain");
  });
};

//Fetches a list of words from a wiki using the Wikia API
var fetchWikiaList = function(response,url,limit){
  jsGlobals.write(response,501,"API not yet implemented.","text\plain");
};

//Exporting
module.exports.fetchMediaWikiList = fetchMediaWikiList;
module.exports.fetchWikiaList = fetchWikiaList;