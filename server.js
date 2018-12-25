const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/frotas-azul'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/frotas-azul/index.html'))
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
