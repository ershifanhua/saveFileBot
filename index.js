let path = require('path');
let express = require('express');

let app = express();
app.listen(config.port, function () {
   console.log(`${pkg.name} listening on port ${config.port}`);
});