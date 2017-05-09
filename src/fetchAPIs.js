/**
 * fetchAPIs.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";

var nodeGlobals = require("./globals.js");

/////////////////////Node dependencies//////////////////////////
var nodemw = require("nodemw")
var Client = require("node-rest-client");

var client = new Client.Client();

////////////////////////////////////////Helper functions/////////////////////////////////////////////
//Creates a paintext list using the title values in the JSON.
var returnListFromJSON = function(response,json){
  var rawList = [];
  if(json){
    var length = json.length;
    for(var i = 0; i < length;i++){
      var title = json[i].title;
      if(rawList.indexOf(title) < 0){
        rawList.push(title);
      }
    }
    length = rawList.length;
    var text = "";
    for(var i = 0; i < length;i++){
      text += rawList[i] + "\n";
    }
    nodeGlobals.write(response,200,text,"text\plain");
  } else {
    nodeGlobals.write(response,200,"(No data found.)","Text\plain");
  }
}

//Fetches a list of words from a wiki using the MediaWiki API
var fetchMediaWikiList = function(resp,url,limit){
  try{
    //Sets up the starting params
    //var urlFULL = url + "/w/api.php";
    var params = {
      action: "query",
      list:"allpages",
      aplimit: limit,
      apfrom:"0"
    };
    var bot = new nodemw({
      server: url,
      path:"\w",
      userAgent: "WikiWordlist/1.0"
    })
    var request = bot.api.call(params,function(err,info,next,data){
      if(err){
        //console.dir(err);
        var responseMessage = "Unknown Error - An unknown error occured with the MediaWiki API";
        nodeGlobals.write(resp,400,responseMessage,"text/plaintext");
        return false;
      }
      returnListFromJSON(resp,info.allpages);
    });
  }
  catch(e){
    nodeGlobals.write(resp,500,e.name + " - " + e.message,"text/plain");
  }
};

////////////////////////////////API fetching functions//////////////////////////////////////////
//Fetches a list of words from a wiki using the Wikia API
var fetchWikiaList = function(resp,url,limit){
  try{
    //Sets up the starting params
    var urlFULL = "https://" + url + "/api/v1/Articles/List";
    var args = {
      parameters: {namespaces: {ns:0}, limit: limit}
    };
    
    var request = client.get(urlFULL,args,function(data,response){
      returnListFromJSON(resp,data.items);
    });
    request.on("error",function(e){
      var responseMessage = "Unknown Error - An unknown error occured with the Wikia API";
      nodeGlobals.write(resp,400,responseMessage,"text/plaintext");
      return false;
    });
  }
  catch(e){
    nodeGlobals.write(resp,500,e.name + " - " + e.message,"text/plain");
  }
};

//Exporting
module.exports.fetchMediaWikiList = fetchMediaWikiList;
module.exports.fetchWikiaList = fetchWikiaList;