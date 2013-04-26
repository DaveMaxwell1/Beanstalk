(function () {

    function configureUI() {

        var returnElement;
        var containerElement;
        var shareFacebookElement;
        var shareTwitterElement;
        var shareEmailElement;

        var shareFacebookUrl = 'https://www.facebook.com/sharer.php?u=' + location.href + '&t=' + document.title;
        var shareTwitterUrl = 'http://twitter.com/share';
		if(document.title == '') {
			var shareEmailURL = 'mailto:?subject=Check out Beanstalk&body=Check out this new cool app! %0A %0A' + location.href + '%0A%0A';
		} else {
		    var shareEmailURL = 'mailto:?subject=' + document.title + '&body=Check out the ' + document.title + ' app. %0A %0A' + location.href + '%0A%0A';
		}
        containerElement = document.getElementById('ReturnAndShareControls');

        shareFacebookElement = document.createElement('a');
        shareFacebookElement.setAttribute('class', 'ShareOnFacebookButton');
		shareFacebookElement.setAttribute('className', 'ShareOnFacebookButton');
        shareFacebookElement.setAttribute('href', shareFacebookUrl);
        shareFacebookElement.setAttribute('target', '_blank');
        shareFacebookElement.setAttribute('alt', 'Share this demo on Facebook');
        shareFacebookElement.setAttribute('title', 'Share this demo on Facebook');

        shareTwitterElement = document.createElement('a');
        shareTwitterElement.setAttribute('class', 'ShareOnTwitterButton');
		shareTwitterElement.setAttribute('className', 'ShareOnTwitterButton');
        shareTwitterElement.setAttribute('href', shareTwitterUrl);
        shareTwitterElement.setAttribute('target', '_blank');
        shareTwitterElement.setAttribute('alt', 'Tweet a link to this demo');
        shareTwitterElement.setAttribute('title', 'Tweet a link to this demo');

        shareEmailElement = document.createElement('a');
        shareEmailElement.setAttribute('class', 'ShareViaEmailButton');
		shareEmailElement.setAttribute('className', 'ShareViaEmailButton');
        shareEmailElement.setAttribute('href', shareEmailURL);
        shareEmailElement.setAttribute('target', '_blank');
        shareEmailElement.setAttribute('alt', 'Email a link to this demo');
        shareEmailElement.setAttribute('title', 'Email a link to this demo');
	

        containerElement.appendChild(shareEmailElement);
		containerElement.appendChild(shareFacebookElement);
        containerElement.appendChild(shareTwitterElement);
	}

    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', configureUI, false);
    } else {
        window.attachEvent('onload', configureUI);
    }

} ());