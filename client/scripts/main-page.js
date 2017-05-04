/**
 * main-page.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";


(function(){
  
  var urlInput = undefined;
  var apiInput = undefined;
  
  window.onload = init;
  
  //Makes an ajax request to the current server.
 /* function requestList(e){
    //Fetch the action and params from the HTML
    var action = $("dataRequestForm").attr("action");
    var url = encodeURIComponent(urlInput.value);
    var api = apiInput.value;
    
    //URL data string
    var data = "url="+url+"&api="+api;
    
    //Making the ajax request
    $.ajax({
      type: "get",
      url: action,
      data: data,
      dataType: "text\plain",
      success: function(result,status,xhr){
        console.dir(result);
        document.querySelector("#results").textContent = result;
        
      },
      failure: function(error,status,xhr){
        console.dir(error);
        document.querySelector("#results").textContent = error;
      }
    });
    
    e.preventDefault();
    
    return false;
  }*/

  //Initializes the index page.
  function init(){
    urlInput = document.querySelector("#url");
    apiInput = document.querySelector("#api");
    
    apiInput.onchange = function(e){
      urlInput.placeholder = SITES[e.target.value];
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
          console.dir(result);
          $("#results").text(result);
          /*
          var list = response.split("\n");
          var len = list.length;
          
          var resultSection = document.querySelector("#results");
          resultSection.innerHTML = "";
          
          for(var i = 0; i < len; i++){
            var p = document.createElement("p");
            p.textContent = list[i];
            resultSection.appendChild(p);
          }
          */
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