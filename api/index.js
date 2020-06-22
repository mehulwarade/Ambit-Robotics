/*
  <=====  Initialisation for the node project ===========>
*/
const express = require('express');
const app = express();
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`API server port: ${port}`);
});
/*
  <======  End initialisation ==========>
*/

const base = `${__dirname}/files`;

app.get('/csv', function(req, res) {
    // res.sendFile(`${base}/Spray Log 20200608-111530.csv`);
    res.sendFile(`${base}/log.csv`);
});