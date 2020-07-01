/*
  <=====  Initialisation for the node project ===========>
*/
const express = require('express');
const StaticMaps = require('staticmaps');
const app = express();
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`http server port: ${port}`);
});
/*
  <======  End initialisation ==========>
*/

/*
  <========  CSV file reader and dependencies  ===========>
*/
var csv = require( "fast-csv" );
var request = require('request');

var latlong = []
var lines_to_skip = 10 /* Fill this when the file does not directly start with the data. Start counting the file from 0 */
var currentline = 0

var API = "http://localhost:8000/csv";

app.get('/', function(req, res) {
    res.send(`Filling data`);
    // Let request return the document pointed to by the URL
    // as a readable stream, and pass it to csv.fromStream()

    csv.parseStream(request(API))
      .on("data", function(row){
        // console.log(row)
        if(currentline >= lines_to_skip){
          latlong.push([parseFloat(row[3]), parseFloat(row[2])]);
        }
        else{
          currentline += 1   /* Iterating through the rows to skip to the line where data starts  */
        }
      })
      .on("end", function(){
        saveimg()
      });
});

app.get('/file', function(req, res) {
  res.sendFile(`abc.txt`);
});

app.get('/test', function(req, res) {
  res.send(latlong);
});

function saveimg(){
  // console.log(`test code work`);
  const options = {
    width: 300,
    height: 300,
  };

  const map = new StaticMaps(options);

  var line = {
    coords: latlong,
    color: '#0000FFBB',
    width: 3
  };
   
  map.addLine(line);

  map.render()
    .then(() => map.image.save('marker'+options.width+'.png'))
    .then(() => { console.log('File saved!')})
    .catch(console.log);

}



/* <=================== Extra test code ==================================> */
// app.get('/map', function(req, res) {
//   const options = {
//     width: 1024,
//     height: 1024,
//     zoomRange: 17
//   };

//   const map = new StaticMaps(options);

//   const marker = {
//     img: `mark.png`, // can also be a URL,
//     width: 48,
//     height: 48,
//     coord: [145.0728497, -37.7477025],
//    };
//   map.addMarker(marker);

//   map.render()
//     .then(() => map.image.save('single-marker.png'))
//     .then(() => { console.log('File saved!'); })
//     .catch(console.log);

// });