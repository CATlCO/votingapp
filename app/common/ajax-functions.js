var appUrl = window.location.origin;
var path = window.location.pathname;
var ajaxFunctions = {};

var ajaxFunctions = {
	ready: function ready (fn) {
	  if (typeof fn !== 'function') { return; }
	  if (document.readyState === 'complete') { return fn(); }

	  document.addEventListener('DOMContentLoaded', fn, false);
	},
	ajaxRequest: function ajaxRequest (method, url, callback, data) {
	  var xmlhttp = new XMLHttpRequest();

	  xmlhttp.onreadystatechange = function () {
	    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
	      callback(xmlhttp.response);
	    }
	  };

	  xmlhttp.open(method, url, true);
	  if (data) xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  xmlhttp.send(data);
	}
};
