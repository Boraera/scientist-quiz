const path = require('path');
require('dotenv').config();

//express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//mongo DB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.on('open', function() {
    console.log('Connected to Mongo DB.');
});

//authentication, session handling
const cookieSession = require('cookie-session')
app.use(cookieSession({
    secret: process.env.SESSION_SIGNING_KEY
}));
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
}, (accessToken, refreshToken, extraParams, profile, done) => done(null, profile));
passport.use(strategy);
passport.serializeUser((user, done) => {
    // this will be stored in the session cookie, so we should aim to minimize the size
    done(null, {
        displayName: user.displayName,
        emails: user.emails,
        picture: user.picture
    });
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

app.get(
    '/login',
    passport.authenticate('auth0', {
        clientID: process.env.AUTH0_CLIENT_ID,
        domain: process.env.AUTH0_DOMAIN,
        redirectUri: process.env.AUTH0_CALLBACK_URL,
        audience: 'https://' + process.env.AUTH0_DOMAIN + '/userinfo',
        responseType: 'code',
        scope: 'openid email profile'
    }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get(
    '/callback',
    passport.authenticate('auth0', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/'
    })
);

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
app.use(ensureLoggedIn());

var studysetRouter = require('./routes/studysetRouter');
const Studysets = require('./models/Studysets');
app.use('/studysets', studysetRouter);

var checkerRouter = require('./routes/checkerRouter');
app.use('/checker', checkerRouter);

var workoutRouter = require('./routes/workoutRouter');
const Workouts = require('./models/Workouts');
app.use('/workouts', workoutRouter);

//static resources like app icon
app.use('/bundle', express.static(path.join(__dirname + '/../build/bundle')));
app.use('/marvinjs', express.static(path.join(__dirname + '/../marvinjs')));

//ui
app.set('view engine', 'pug');
app.get(/.*/, function (req, res) {
    res.render('index', { user: JSON.stringify(req.user) });
});

//start
app.listen(process.env.PORT, function () {
    console.log('Started on port ' + process.env.PORT + '.');
});