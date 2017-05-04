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

////////////////////////////////////////Helper functions/////////////////////////////////////////////
//Creates a paintext list using the title values in the JSON.
var returnListFromJSON = function(response,json){
  //console.dir(json);
  var rawList = [];
  if(json){
    var length = json.length;
    for(var i = 0; i < length;i++){
      var title = json[i].title;
      if(rawList.indexOf(title) < 0){
        rawList.push(title);
      }
    }
    //console.dir(rawList);
    length = rawList.length;
    var text = "";
    for(var i = 0; i < length;i++){
      text += rawList[i] + "\n";
    }
    console.log(text);
    jsGlobals.write(response,200,text,"text\plain");
  } else {
    jsGlobals.write(response,200,"(No data found.)","Text\plain");
  }
}

//Fetches a list of words from a wiki using the MediaWiki API
var fetchMediaWikiList = function(response,url,limit){
  try{
    bot.settings.endpoint = url + "/w/api.php";
    
    var request = bot.get({ action: "query", list:"allpages", aplimit: limit, apfrom:"0"})
    request.complete(function(resp){
      console.log("Fetching from MediaWiki");
      //jsGlobals.write(response,200,JSON.stringify(list),"text\plain");
      returnListFromJSON(response,resp.query.allpages);
    });
    request.error(function(e){
      throw e;
    });
  }
  catch(e){
    jsGlobals.write(response,400,e.name + " - " + e.message,"text/plain");
    //throw e;
  }
};

////////////////////////////////API fetching functions//////////////////////////////////////////
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
    
    var request = client.get(urlFULL,args,function(data,statusResponse){
      //console.log(data);
      
      //jsGlobals.write(response,200,JSON.stringify(data),"text\plain");
      returnListFromJSON(response,data.items);
    });
    request.on("error",function(e){
      throw e;
    });
  }
  catch(e){
    jsGlobals.write(response,400,e.name + " - " + e.message,"text/plain");
  }
};

//Exporting
module.exports.fetchMediaWikiList = fetchMediaWikiList;
module.exports.fetchWikiaList = fetchWikiaList;