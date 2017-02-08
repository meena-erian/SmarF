function include(link, container) {
  var part = new XMLHttpRequest();
  part.open('GET', link);
  part.onload = function() {
    container.innerHTML += part.responseText;
  }
  part.send();
}
include('/SmarF/siteCommon/commonSiteHeader.html', document.head);
include('/SmarF/siteCommon/commonSiteFooter.html', document.getElementsByClassName("paper")[0]);
document.getElementById('link-to-github').setAttribute("href", "https://github.com/meena-erian/SmarF/blob/master/" + document.URL.split('?')[0].split('/').slice(4).join('/'));
