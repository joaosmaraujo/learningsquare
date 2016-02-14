function initialize() {
  var mapProp = {
    center:new google.maps.LatLng(41.367025,-8.738039),
    zoom:17,
    mapTypeId:google.maps.MapTypeId.HYBRID
  };
  var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);
}
google.maps.event.addDomListener(window, 'load', initialize);