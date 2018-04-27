var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var session = require('express-session');
var notificationModel = require('./app/notifications/notifications.model');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Configuring the database
var connect = function() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };
  // Configuring the database
  mongoose.connect(dbConfig.url);
  mongoose.connection.on('error', () => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
  });

  mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');
  });
};

connect();

// Set request headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// To allow any unauthorised self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Set template for node
app.set('view engine', 'ejs');

// Cross-Origin
app.use(
  cors({
    origin: '*'
  })
);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// json spaces set
app.set('json spaces', 2);

// session management for express
app.use(
  session({
    secret: 'tekOneSecret',
    resave: true,
    saveUninitialized: false
  })
);

// Initialize passport & session
app.use(passport.initialize());
app.use(passport.session());

// define a simple route
app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to TEKOne api.' });
});

// inject all routes here
require('./routes')(app);

// listen for requests
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// open socket connection on this server
try {
  io.on('connection', function(socket) {
   // console.log('user connected');
    var intervalIndex = 100,
      notificationInterval = setInterval(function() {
        // genrate notification on every 1 minuts
        (function(index) {
          var body = {
            recipientid: 'Pooja' + index,
            image: '1',
            comment: 'sent you dummy notification ' + index
          };
          notificationModel(body).save(function(err, data, count) {
            if (!err) {
              // console.log("notification body" + data);
              socket.emit('notificationCreated', {
                type: 'new-data',
                text: data
              });
              //console.log(data);
            } else {
              console.log(err);
            }
          });
        })(intervalIndex);
        intervalIndex++;
      }, 500);

    socket.on('disconnect', function() {
      clearInterval(notificationInterval);
    });
    socket.on('reconnect_attempt', () => {
      socket.io.opts.query = {
        token: 'fgh'
      };
    });
  });
} catch (es) {
  console.log(es);
}
