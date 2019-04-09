const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');

const RestrictedFile = require('../models/RestrictedFile')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/upload', ensureAuthenticated, upload.single('file'), (req, res, next) => {
    const file = req.file
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
        name: file.originalname,
        uploader: req.user.name,
        writeUsers: ['Admin', req.user._id],
        readUsers: ['Admin', req.user._id],
        publishUsers: ['Admin', req.user._id],
    });
    newFile.save()
    req.flash('success_msg', 'File uploaded')
    res.redirect('/dashboard')
})

router.get('/download/:file(*)', ensureAuthenticated, (req, res) => {
    var file = req.params.file;
    var fileLocation = path.join('./uploads', file);
    res.download(fileLocation, file);
});

module.exports = router;