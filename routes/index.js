const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const RestrictedFile = require('../models/RestrictedFile')

router.get('/', (req, res) => res.render('welcome'))

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    RestrictedFile.find({}, function (err, files) {
        let fileMap = [];
        let usrId = req && req.user ? req.user._id : null;
        
        files.forEach(function (file) {
            if (file.canAccess(usrId))
                fileMap.push(file)
        });
        res.render('dashboard', {
            fileMap
        });
    })
})

module.exports = router;