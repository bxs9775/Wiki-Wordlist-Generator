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
  var displayFeild = undefined;
  
  var downloadButton = undefined;
  
  var ENTER_KEY = 13;
  var animDone = false;
  var animDoneEvent = "webkitTransitionEnd";
  
  window.onload = init;
  /////////////////////////////////FORM AND FORM DATA////////////////////////////////////////////
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
    hideResults();
  }
  
  //Saves the url and api values to local storage
  function saveForm(){
    localStorage.setItem("url",urlInput.value);
    localStorage.setItem("api",apiInput.value);
    localStorage.setItem("limit",limitInput.value);
    
    hideResults();
  }
  
  //Saves the url and api values from local storage
  function loadForm(){
    var url = localStorage.getItem("url");
    var api = localStorage.getItem("api");
    var limit = localStorage.getItem("limit");
    setForm(url,api,limit);
  }
  
  //////////////////////////////////////////DISPLAY FUNCTIONS//////////////////////////////////////////
  //hides the padding and border on the results display
  function hideBorders(){
    //console.log("Hide borders.");
    if(!animDone){
      animDone = true;
    displayFeild.style.border = "0";
    displayFeild.style.padding = "0";
    displayFeild.removeEventListener(animDoneEvent,hideBorders, false);
    }
  }
  
  //Hides the results section
  function hideResults(){
    animDone = false;
    displayFeild.style.maxHeight = "0";
    //animation callback from Mark Rhodes answer in http://stackoverflow.com/questions/2087510/callback-on-css-transition
    displayFeild.addEventListener(animDoneEvent,hideBorders, false);
    setTimeout(function(){
      if(!animDone){
        console.log("Animation timeout.");
        hideBorders();
      }
    },4000);
  }
  
  //Shows the results section
  function showResults(){
    animDone = true;
    displayFeild.style.maxHeight = "100000px";
    displayFeild.style.border = "1px solid black";
    displayFeild.style.padding = "8px";
  }
  
  ////////////////////////////////////////AJAX///////////////////////////////////////////
  //requests a wordlist from the server
  function ajaxRequest(){
    hideResults();
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
        showResults();
        $("#results").text(result);
      },
      error: function(xhr,status,error){
        //Display results
        showResults();
        $("#results").text(xhr.responseText);
      }
    });
  }
  ////////////////////////////////////////MAIN METHOD/////////////////////////////////////////////////////////
  //Initializes the index page.
  function init(){
    //html elements
    urlInput = document.querySelector("#url");
    apiInput = document.querySelector("#api");
    limitInput = document.querySelector("#limit");
    displayFeild = document.querySelector("#display");
    downloadButton = document.querySelector("#download");
    
    //sets the correct on transition end event
    //browser checking code from pilau's answer in http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    ////Firefox
    if(typeof InstallTrigger !== "undefined"){
      animDoneEvent = "transitionend";
    }
    ////IE9+
    if(false || !!document.documentMode){
      animDoneEvent = "msTransitionEnd";
    }
    ////Opera
    if(!!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0){
      animDoneEvent = "oTransitionEnd";
    }
    
    
    
    //update forms events
    urlInput.onchange = updateURL;
    apiInput.onchange = function(e){
      updateAPI(e.target);
    }
    
    //Loads local data
    loadForm();
    
    //Hides the results when any of the controls are in focus
    urlInput.onfocus = hideResults;
    apiInput.onfocus = hideResults;
    limitInput.onfocus = hideResults;
    
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