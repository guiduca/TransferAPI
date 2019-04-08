const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');

const RestrictedFile = require('../models/RestrictedFile')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

router.post('/upload', ensureAuthenticated, upload.single('myFile'), (req, res) => {
    const file = req.file
    const user = req.user;
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    if (!req.user || !req.user._id) {
        const error = new Error('Error with session ID')
        error.httpStatusCode = 400
        return next(error)
    }
    const newFile = new RestrictedFile({
        userID: req.user._id,
        writeUsers: ['Admin', req.user._id],
        readUsers: ['Admin', req.user._id],
        publishUsers: ['Admin', req.user._id],
    });
    console.log('This is sparta', newFile )
    newFile.save()
    req.flash('success_msg', 'File uploaded')
    res.redirect('/dashboard')
})

module.exports = router;