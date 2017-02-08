function include(var link, var container) {
  var part = new XMLHttpRequest();
  part.open('GET', link);
  part.onload = function() {
    container.innerHTML += part.responseText;
  }
  part.send();
}
include('/Smarf/siteCommon/commonSiteHeader.html', document.head);
