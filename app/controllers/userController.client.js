'use strict';

(function () {
	var displayName = document.querySelector('#display-name');
	var pic = document.querySelector('#pic');
	var apiUrl = appUrl + '/api/users';

	function updateHtmlElement (data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }

	ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
		var userObject = JSON.parse(data);

		if (userObject.displayName !== null) {
       updateHtmlElement(userObject, displayName, 'displayName');
    } else {
       updateHtmlElement(userObject, displayName, 'username');
    }

    pic.src = userObject.picture;

	}));
})();
