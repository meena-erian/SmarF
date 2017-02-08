var numberOfActiveHTTPRequests = 0;
function include(link, container) {
  numberOfActiveHTTPRequests++;
  part = new XMLHttpRequest();
  part.open('GET', link);
  part.onload = function() {
    container.innerHTML += part.responseText;
    numberOfActiveHTTPRequests--;
  }
  part.send();
}
include('/SmarF/siteCommon/commonSiteHeader.html', document.head);
include('/SmarF/siteCommon/commonSiteFooter.html', document.getElementsByClassName("paper")[0]);
window.onload = function() {
  function lateOnLoad() { //Excute this function after loading everything including external parts.
    document.getElementById('link-to-github').setAttribute("href", "https://github.com/meena-erian/SmarF/blob/master/" + document.URL.split('?')[0].split('/').slice(4).join('/'));
  }
  var loopHandler = setInterval(function() {if(!numberOfActiveHTTPRequests) {clearInterval(loopHandler); lateOnLoad();} }, 100);
}
