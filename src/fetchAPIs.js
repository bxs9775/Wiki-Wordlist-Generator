/**
 * fetchAPIs.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";

//loads the globals file
var nodeGlobals = require("./globals.js");

/////////////////////Node dependencies//////////////////////////
var nodemw = require("nodemw")
var Client = require("node-rest-client");

var client = new Client.Client();

////////////////////////////////////////Helper functions/////////////////////////////////////////////
//Creates a paintext list using the title values in the JSON.
var returnListFromJSON = function(response,json){
  var rawList = [];
  //Only runs when a json value is given
  if(json){
    var length = json.length;
    for(var i = 0; i < length;i++){
      var title = json[i].title;
      //adds the title to the list if it is not already present
      if(rawList.indexOf(title) < 0){
        rawList.push(title);
      }
    }
    length = rawList.length;
    var text = "";
    //creates a plain-text string using the tempory list
    for(var i = 0; i < length;i++){
      text += rawList[i] + "\n";
    }
    //writes the string to the response
    nodeGlobals.write(response,200,text,"text\plain");
  } else {
    //writes a message to the response to let users know that no data was retrieved from the server*/
    nodeGlobals.write(response,200,"(No data found.)","Text\plain");
  }
}

//Fetches a list of words from a wiki using the MediaWiki API
var fetchMediaWikiList = function(resp,url,limit){
  try{
    //sets up the starting params
    var params = {
      action: "query",
      list:"allpages",
      aplimit: limit,
      apfrom:"0"
    };
    //creates a new MediaWiki bot
    var bot = new nodemw({
      server: url,
      path:"\w",
      userAgent: "WikiWordlist/1.0"
    });
    //the bot makes a get request to the MediaWiki API
    var request = bot.api.call(params,function(err,info,next,data){
      //if there is an error - send an error response
      if(err){
        var responseMessage = "Unknown Error - An unknown error occured with the MediaWiki API";
        nodeGlobals.write(resp,400,responseMessage,"text/plaintext");
        return false;
      }
      //if there isn't an error - process the data
      returnListFromJSON(resp,info.allpages);
    });
  }
  catch(e){
    //if an error occured outside of the api send an error response
    nodeGlobals.write(resp,500,e.name + " - " + e.message,"text/plain");
  }
};

////////////////////////////////API fetching functions//////////////////////////////////////////
//Fetches a list of words from a wiki using the Wikia API
var fetchWikiaList = function(resp,url,limit){
  try{
    //sets up the API url
    var urlFULL = "https://" + url + "/api/v1/Articles/List";
    //sets up the parameters for the call
    var args = {
      parameters: {namespaces: {ns:0}, limit: limit}
    };
    //Makes a get request to the url
    var request = client.get(urlFULL,args,function(data,response){
      //processes the data that was returned
      returnListFromJSON(resp,data.items);
    });
    //if there was an error - send an error response
    request.on("error",function(e){
      var responseMessage = "Unknown Error - An unknown error occured with the Wikia API";
      nodeGlobals.write(resp,400,responseMessage,"text/plaintext");
      return false;
    });
  }
  catch(e){
    //if an error occured outside of the api send an error response
    nodeGlobals.write(resp,500,e.name + " - " + e.message,"text/plain");
  }
};

//export all functions used by other scripts
module.exports.fetchMediaWikiList = fetchMediaWikiList;
module.exports.fetchWikiaList = fetchWikiaList;