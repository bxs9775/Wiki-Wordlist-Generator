/**
 * main-page.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/
"use strict";


(function(){
  
  var urlInput = undefined;
  var apiInput = undefined;
  var limitInput = undefined;
  
  var downloadButton = undefined;
  
  var ENTER_KEY = 13;
  
  window.onload = init;
  
  //updates the URL for the download button
  function updateURL(){
    downloadButton.href = "/List?url="+(urlInput.value)+"&api="+apiInput.value;
  }
  
  //updates the API and related fields.
  function updateAPI(apiField){
    urlInput.placeholder = SITES[apiField.value];
    updateURL();
  }
  
  function setForm(url,api,limit){
    if(url != null){
      urlInput.value = url;
    }
    if(api){
      apiInput.value = api;
    }
    if(limit != null){
      limitInput.value = limit;
    }
    
    updateAPI(apiInput);
  }
  
  //Saves the url and api values to local storage
  function saveForm(){
    localStorage.setItem("url",urlInput.value);
    localStorage.setItem("api",apiInput.value);
    localStorage.setItem("limit",limitInput.value);
  }
  
  //Saves the url and api values from local storage
  function loadForm(){
    var url = localStorage.getItem("url");
    var api = localStorage.getItem("api");
    var limit = localStorage.getItem("limit");
    setForm(url,api,limit);
  }
  
  //requests a wordlist from the server
  function ajaxRequest(){
      //Fetch the action and params from the HTML
      var action = $("#dataRequestForm").attr("action");
      var url = encodeURIComponent(urlInput.value);
      var limit = Number(limitInput.value) || 100;
      var api = apiInput.value;
      
      //URL data string
      var data = "url="+url+"&api="+api+"&limit="+limit;
      
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
      
  }

  //Initializes the index page.
  function init(){
    urlInput = document.querySelector("#url");
    apiInput = document.querySelector("#api");
    limitInput = document.querySelector("#limit");
    downloadButton = document.querySelector("#download");
    
    urlInput.onchange = updateURL;
    
    apiInput.onchange = function(e){
      updateAPI(e.target);
    }
    
    loadForm();
    
    document.querySelector("#save").onclick = saveForm;
    document.querySelector("#load").onclick = loadForm;
    document.querySelector("#clear").onclick = function(){
      setForm("","MediaWiki",100);
    };
    
    $("#dataRequestForm").submit(function(e){
      ajaxRequest();
      
      //Prevents default behavior
      e.preventDefault();
      
      return false;
    });
    
    $("document").keydown(function(e){
      if(e.keycode == ENTER_KEY){
        ajaxRequest();
      }
    });
    
    
  }
}());