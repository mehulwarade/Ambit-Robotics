
function initMap() {

    // var markicon = 'http://localhost:8000/marker'
    var markerred = 'http://localhost:8000/red.png'
    var markerhome = 'http://localhost:8000/home.png'

    // console.log();
    $.get('/ajax', function(res) {
      $('#val').text(res[0][1]);

      var latlong = {lat: res[0][1], lng: res[0][0]}
      var map = new google.maps.Map(document.getElementById('map'), {zoom: 20, center: latlong});
      
      var marker = new google.maps.Marker({
        position: latlong,
        map: map, 
        icon: markerhome
      });

      for (var i = 0; i < res.length; i++) {
        var latlong = {lat: res[i][1], lng: res[i][0]}
        var marker = new google.maps.Marker({
          position: latlong,
          map: map, 
          icon: markerred
        });
      }
    });

  }