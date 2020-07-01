/*
  <=====  Initialisation for the node project ===========>
*/
const express = require('express');
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

app.set('view engine', 'ejs');  //tell Express we're using EJS
app.set('views', __dirname + '/views');  //set path to *.ejs files
app.use('/public', express.static(__dirname + '/public'));

var latlong = []
var lines_to_skip = 10 /* Fill this when the file does not directly start with the data. Start counting the file from 0 */
var currentline = 0

var API = "http://localhost:8000/csv";

app.get('/', function(req, res) {
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
        console.log('data filled');
    });
    
    res.render('index', {val: latlong});
    // res.send(`Filling data`);
});

app.get('/ajax', function(req, res) {
  res.send(latlong);
});

