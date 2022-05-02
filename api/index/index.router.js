const express = require('express');
var axios = require('axios');
//var data = JSON.stringify({"first_name":"Todd","last_name":"Brannon","username":"tbrannon","email_address":"todd@nowhere.com","password":"password1234"});
const prettyjson = require('prettyjson');
const router = express.Router();

var request = require('request');

const dbService = require('../../dbService');

router.get('/delete', (req, res)=>{
    const db = dbService.getDbServiceInstance();
    const result = db.deleteEnrollmentRefresh();
    result
    .then(data => res.json({ data : data }))
    .catch(err => console.log(err));
})

router.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    // const emails = db.pushEmails();
    result
    // emails
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err));
});



router.get('/getArray', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getArray();
    result
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err));
});

router.get('/getEmails', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.pushEmails();
    result
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err));
})



module.exports = router;