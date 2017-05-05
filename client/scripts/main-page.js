/**
 * main-page.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";


(function(){
  
  var urlInput = undefined;
  var apiInput = undefined;
  
  var downloadButton = undefined;
  
  window.onload = init;
  
  function updateURL(e){
    downloadButton.href = "/List?url="+(urlInput.value)+"&api="+apiInput.value;
  }

  //Initializes the index page.
  function init(){
    urlInput = document.querySelector("#url");
    apiInput = document.querySelector("#api");
    downloadButton = document.querySelector("#download");
    
    urlInput.onchange = updateURL;
    
    apiInput.onchange = function(e){
      urlInput.placeholder = SITES[e.target.value];
      updateURL(e);
    }
    
    $("#dataRequestForm").submit(function(e){
      //Fetch the action and params from the HTML
      var action = $("#dataRequestForm").attr("action");
      var url = encodeURIComponent(urlInput.value);
      var api = apiInput.value;
      
      //URL data string
      var data = "url="+url+"&api="+api;
      
      //Making the ajax request
      $.ajax({
        type: "get",
        url: action,
        data: data,
        dataType: "text",
        success: function(result,status,xhr){
          $("#results").text(result);
        },
        failure: function(error,status,xhr){
          console.dir(error);
          $("#results").text(error);
        }
      });
      
      //Prevents default behavior
      e.preventDefault();
      
      return false;
    });
  }
}());