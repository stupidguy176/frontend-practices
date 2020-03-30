"use strict";

window.onscroll = function() {scrollFunction()};

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

function addClass(element,className) {
  console.log({element});
  var currentClassName = element.getAttribute("class");
  if (typeof currentClassName!== "undefined" && currentClassName) {
    element.setAttribute("class",currentClassName + " "+ className);
  }
  else {
    element.setAttribute("class",className);
  }
}

function removeClass(element,className) {
  var currentClassName = element.getAttribute("class");
  if (typeof currentClassName!== "undefined" && currentClassName) {
    var class2RemoveIndex = currentClassName.indexOf(className);
    var class2Remove = currentClassName.substr(class2RemoveIndex, className.length);
    var updatedClassName = currentClassName.replace(class2Remove,"").trim();
    element.setAttribute("class",updatedClassName);
  }
  else {
    element.removeAttribute("class");
  }
}


function scrollFunction() {
  var targetElement = document.getElementById("menu");
  console.log({targetElement});
  console.log({document});
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    console.log('aaaa', targetElement);
    let is_show =  document.getElementById("showing");
    if(targetElement) {
      if(!is_show) {
        addClass(targetElement,"showing");
      }
    }
  } else {
    console.log('bbbb',targetElement);
    if(targetElement){
      removeClass(targetElement,"showing");
    }
  }
}
