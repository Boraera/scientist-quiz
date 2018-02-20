const express = require('express');
const bodyParser = require('body-parser');
var request = require('request-promise');


const url =
  "https://qvo8f27n7k.execute-api.eu-west-1.amazonaws.com/prod/DuplicateMS";

const checkerRouter = express.Router();
checkerRouter.use(bodyParser.json());

checkerRouter.route('/')


.post((req, res, next) => {
    const options = {
        method: 'POST',
        uri: 'https://qvo8f27n7k.execute-api.eu-west-1.amazonaws.com/prod/DuplicateMS',
        body: req.body,
        json: true 
    }

    request(options)
    .then((duplicateSearch) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ duplicate: duplicateSearch.body.duplicate });
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = checkerRouter;