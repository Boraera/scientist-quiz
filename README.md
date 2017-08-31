# ChemAxon Synergy integration with Node.js

Live demo available at https://synergy-demo-app-nodejs.herokuapp.com/

## Boilerplate

Branch called `boilerplate` contains a simple _Express_ app 
without the ChemAxon Synergy integration. You can use it as a starting point
if you would like to try the steps of integration yourself.

Boilerplate app has a simple local user management using 
_MongoDB_ and _Passport.js_ with `passport-local-mongoose` strategy.
(App does not contain forms for login or register.)

First make sure that a MongDB server is running on your machine
(you can get it from here: 
https://www.mongodb.com/download-center#community),
and then start the app: 
```
npm install
npm start
```

App will run on `http://localhost:3000`. 

Swagger api documentation is available on `http://localhost:3000/apidoc`.
Once you have made changes in code, you can update it with `npm run doc`.

See the differences between `boilerplate` and `master` branches to see
what has to be done to properly integrate to ChemAxon Synergy.

## Integration with ChemAxon Synergy

First you have to implement some api endpoints. 
See `src/integration-synergy.js` in the master branch.

To make the app accessible by Synergy, you have to deploy it. 
Here we will use GitHub and Heroku.

 * Push your app into a GitHub repository
 * Create an app on Heroku.com, set _Deployment method_ to _GitHub_ 
   and connect your GitHub repository
 * Add a _mLab MongoDB_ add-on with _Sandbox - Free_ plan. 
   This will add a Config Var called `MONGODB_URI`
 * Add another Config vars on Settings tab:
   - `PORT`: `80`
   - `SYNERGY_URL`: `https://team1.synergy-demo.cxn.io/`
   - `URL`: `https://<YOUR_HEROKU_APP_NAME>.herokuapp.com`

If your app is propery running on
https://<YOUR_HEROKU_APP_NAME>.herokuapp.com, it can be registered on
https://admin.synergy-demo.cxn.io. Your app info url is: 
https://<YOUR_HEROKU_APP_NAME>.herokuapp.com/api/synergy/info

## Authentication with ChemAxon Synergy

If your application is deployed and registered, you can implement 
authentication. Synergy uses Openid Connect to authenticate users.
See `src/authentication-synergy.js` in the master branch.

To make authentication work, you will need the client id and
client secret of your app from 
https://admin.synergy-demo.cxn.io. Add these Config vars to your app:
   - `SYNERGY_CLIENT_ID`: client id of the registered app
   - `SYNERGY_CLIENT_SECRET`: client secret of the registered app
