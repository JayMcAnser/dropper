/**
 * Dropper Curator App
 * free from: https://medium.com/zero-equals-false/building-a-restful-crud-api-with-node-js-jwt-bcrypt-express-and-mongodb-4e1fb20b7f3d
 */
const express = require('express');
const cors = require('cors');
const Logging = require('./lib/logging');
const bodyParser = require('body-parser');
const Config = require('config');
const ApiReturn = require('./lib/api-return');
const Const = require('./lib/const')
const StaticSite = require('./lib/static-site');

const app = express();
app.use(cors())
Logging.init(app)


// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
//
// app.get('/', function(req, res) {
//   ApiReturn.result(req, res, {message : Const.results.dropperActive});
// });


const AuthController = require('./controllers/auth');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/public',  require('./routes/public'));
app.use('/api/user',  AuthController.validate,  require('./routes/user'));
app.use('/api/board', AuthController.validate,  require('./routes/board'));

// this must be the last route otherwise it will catch all previous defined routes
let staticSite = new StaticSite((app));

// handle errors
app.use(function(err, req, res, next) {
  ApiReturn.error(req, res, err, '[global.error]', err.status)
});

let listener = app.listen(Config.get('Server.port'),
  function() {
    Logging.log('info', `dropper server (http://localhost:${Config.get('Server.port')} listening on port ${Config.get('Server.port')}`)
//    console.log(`Node server (http://localhost:${Config.get('Server.port')} listening on port ${Config.get('Server.port')}`);
  }
);

module.exports = app;
