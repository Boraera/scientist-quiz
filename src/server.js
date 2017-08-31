const path = require('path');
const config = require('../config');

//express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//mongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/synergy-nodejs-integration');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.on('open', function() {
    console.log('Connected to DB.');
});

//live api documentation with Swagger - available at /apidoc
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
app.use('/apidoc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//cors headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", config.uiUrl);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//authentication - Passport.js init
const passport = require('passport');
const session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: '45873587345'
}));
app.use(passport.initialize());
app.use(passport.session());

//local user management
const User = require('./userModel');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//authentication
require('./authentication-general')(app);

//synergy authentication
require('./authentication-synergy')(app, passport);

//synergy integration
require('./integration-synergy')(app);

//static resources like app icon
app.use(express.static('public'));

//ui
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//start
app.listen(config.port, function () {
    console.log('ChemAxon Synergy integration demo app is running on '+config.url)
});