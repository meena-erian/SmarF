var part = new XMLHttpRequest();
part.open('GET', '/Smarf/siteCommon/commonSiteHeader.html');
part.onload = function() {
  document.head.innerHTML += part.responseText;
}
client.send();
 
