const express = require('express');
var axios = require('axios');
const prettyjson = require('prettyjson');
const router = express.Router();

var request = require('request');

const dbService = require('../../dbService');

router.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    result
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err));
});

module.exports = router;