var numberOfActiveHTTPRequests = 0;
function include(link, container, prepend=0) {
  numberOfActiveHTTPRequests++;
  var part = new XMLHttpRequest();
  part.open('GET', link);
  part.onload = function() {
    if(prepend) container.innerHTML = part.responseText + container.innerHTML;
    else container.innerHTML += part.responseText;
    numberOfActiveHTTPRequests--;
  }
  part.send();
}

include('/SmarF/siteCommon/commonSiteHeader.html', document.head);
include('/SmarF/siteCommon/commonSiteFooter.html', document.getElementsByClassName("paper")[0]);
include('/SmarF/siteCommon/commonSiteNav.html', document.getElementsByClassName("paper")[0]);

function createBreadCrumbs() {
	var address = document.URL;
	address = address.split('/');
	address = address.slice(3, address.length-1);
	address[0]  = 'Root';

	var headerNav = document.getElementById('header-nav');
	for(var i=0; i<address.length; i++) {
		if(i == address.length-1 ) {
			var e = document.createElement('span');
			e.class = "current-link";
			e.innerHTML = address[i] + "/";
			headerNav.appendChild(e);
		}
		else {
			var e = document.createElement('a');
			e.class = "parent-link";
			e.innerHTML = address[i] + "/ ";
			e.href = document.URL + "../".repeat(address.length - i - 1);
			headerNav.appendChild(e);
		}
	}
}

window.onload = function() {
  function lateOnLoad() { //Excute this function after loading everything including external parts.
    document.getElementById('link-to-github').setAttribute("href", "https://github.com/meena-erian/SmarF/tree/master/" + document.URL.split('?')[0].split('/').slice(4).join('/'));
    createBreadCrumbs();
  }
  var loopHandler = setInterval(function() {if(!numberOfActiveHTTPRequests) {clearInterval(loopHandler); lateOnLoad();} }, 100);
}
