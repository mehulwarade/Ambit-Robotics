const express = require('express');

const app = express();
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API server port: ${port}`);
});
app.get('/', function(req, res) {
  res.send('hello');
});