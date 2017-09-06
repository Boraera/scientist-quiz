# ChemAxon Synergy integration with Node.js

Live demo available at http://synergy-nodejs-integration.bpo.cxn:8080/

First make sure that a MongDB server is running on your machine
(you can get it from here: https://www.mongodb.com/download-center#community),
and then start the app: 
```
npm install
npm start
```

App will run on http://localhost:3000. 

Swagger api documentation is available on http://localhost:3000/apidoc.
Once you have made changes in code, you can update it with `npm run doc`.

## Integration with ChemAxon Synergy

First you have to implement some api endpoints. 
See `src/integration-synergy.js`.

To make the app accessible by Synergy, you have to deploy it.
 
*   Update application’s version by changing package.json file’s version property.
    Create package file (output file in builds folder: synergy-nodejs-integration-[VERSION].tgz)
    
    `npm run dist`

*   Upload application package to synergy-nodejs-integration.bpo.cxn

    ```
    sftp [USERNAME]@synergy-nodejs-integration.bpo.cxn
    put [PATH]/synergy-nodejs-integration-[VERSION].tgz
    exit
    ```

*   Login to synergy-nodejs-integration.bpo.cxn environment

    `ssh synergy-nodejs-integration.bpo.cxn`

*   Change to root

    `sudo su`

*   Check running processes

    `pm2 list`

*   If there is a running synergy-nodejs-integration instance, stop it

    `pm2 stop synergy-nodejs-integration`

*   Unzip application package

    `tar -xvzf [PATH]/synergy-nodejs-integration-[VERSION].tgz -C /data/current`

*   Copy runtime process variables configuration file

    `cp /data/current/.env /data/current/package`

*   Step into at the application’s folder

    `cd /data/current/package`

*   Start the application

    `npm run start:dist`

Application is available at http://synergy-nodejs-integration.bpo.cxn:8080/

`.env` file contains the necessary variables. Sample configuration for http://synergy-nodejs-integration.bpo.cxn:8080/ environment: 
```
SYNERGY_URL=https://team1.synergy-demo.cxn.io/
SYNERGY_CLIENT_ID=
SYNERGY_CLIENT_SECRET=
MONGODB_URI=mongodb://localhost/synergy-nodejs-integration
PORT=8080
URL=http://synergy-nodejs-integration.bpo.cxn:8080
```

If your app is properly running on http://synergy-nodejs-integration.bpo.cxn:8080/, it can be registered on
https://admin.synergy-demo.cxn.io. 

Your app info url is: http://synergy-nodejs-integration.bpo.cxn:8080/api/synergy/info

## Authentication with ChemAxon Synergy

If your application is deployed and registered, you can implement 
authentication. Synergy uses Openid Connect to authenticate users.
See `src/authentication-synergy.js` in the master branch.

To make authentication work, you will need the client id and
client secret of your app from 
https://admin.synergy-demo.cxn.io. Add these config variables to the .env file:
```
SYNERGY_CLIENT_ID: client id of the registered app
SYNERGY_CLIENT_SECRET: client secret of the registered app
```
