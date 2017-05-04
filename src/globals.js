/**
 * globals.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";

//Gives a default url for each API site
var SITES = Object.freeze({
  "MediaWiki": "www.mediawiki.org",
  "Wikia": "www.wikia.com"
});

//writes a request with the specified errorcode, message, and type
var write = function(response,errCode,msg,type){
  response.writeHead(errCode, {"Content-Type": type});
  response.write(msg);
  response.end();
};

//Exporting
module.exports.SITES = SITES;
module.exports.write = write;