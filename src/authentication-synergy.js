var passport = require('passport');
var User = require('./userModel');

var OidcStrategy = require('passport-openidconnect').Strategy;

module.exports = function(app, passport) {

    const synergyUrl = process.env.SYNERGY_URL;

    passport.use(new OidcStrategy({
        issuer: synergyUrl,
        authorizationURL: synergyUrl + '/oauth/authorize',
        tokenURL: synergyUrl + '/oauth/token',
        callbackURL: process.env.URL + '/auth/synergy/callback',
        skipUserProfile: true,
        clientID: process.env.SYNERGY_CLIENT_ID,
        clientSecret: process.env.SYNERGY_CLIENT_SECRET
    }, function (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, done) {
        try {
            var email = sub;
            User.findOneAndUpdate({email: email}, {
                $set:{
                    email: email,
                    jwtClaims: jwtClaims,
                    params: params
                }
            }, {
                upsert: true,
                new: true
            }, function(err, user){
                return done(err, user);
            });
        }
        catch(err) {
            done(err, false);
        }
    }));

    /**
     * @swagger
     * /auth/synergy:
     *   get:
     *     tags: ["authentication-synergy"]
     */
    app.get('/auth/synergy',
        passport.authenticate('openidconnect', {scope: ['openid']})
    );

    /**
     * @swagger
     * /auth/synergy/callback:
     *   get:
     *     tags: ["authentication-synergy"]
     */
    app.get('/auth/synergy/callback',
        passport.authenticate('openidconnect', {failureRedirect: '/?error=Cannot%20authenticate!'}),
        function (err, req, res, next) {
            if (err) {
                console.log(err);
                res.redirect('/?error=Authentication%20error!');
            }
            else
                next();
        },
        function (req, res) {
            res.redirect('/');
        }
    );
};