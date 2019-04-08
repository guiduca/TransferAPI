const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const RestrictedFile = require('../models/RestrictedFile')

router.get('/', (req, res) => res.render('welcome'))

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    RestrictedFile.find({}, function (err, files) {
        var fileMap = [];

        files.forEach(function (file) {
            fileMap.push(file)
        });
        console.log(fileMap)
        res.render('dashboard', {
            fileMap
        });
    })
})

module.exports = router;