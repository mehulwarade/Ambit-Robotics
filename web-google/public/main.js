$(function() {
    $('#loadRequest').click(function() {
        $.get('/ajax', function(res) {
            $('#val').text(res);
        });
    });
});

function initMap() {

    var markicon = 'http://localhost:8000/marker'
    var API = "http://localhost:8000/csv"

    // console.log();
    
    var latlong = [{lat: -25.344, lng: 131.036},{lat: -25.444, lng: 131.036}]
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: latlong[0]});
    
    for (var i = 0; i < latlong.length; i++) {
      var latLng = new google.maps.LatLng(latlong[i].lat,latlong[i].lng);
      var marker = new google.maps.Marker({
        position: latLng,
        map: map, 
        icon: markicon
      });
    }
  }     

