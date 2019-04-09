const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');
const path = require('path');

const User = require('../models/Users')
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

router.get('/permission/:id', (req, res) => {
    const fileId = req.params.id
    res.render('permission', {
        fileId
    })
})

router.post('/permission', (req, res) => {
    RestrictedFile.findOne({ _id: req.body.fileId })
        .then(file => {
            User.find({ name: req.body.name })
                .then(user => {
                    if (user.length) {
                        file.readUsers.push(user._id);
                        file.save();
                        req.flash('success_msg', req.body.name + ' have been added to the readers of ' + req.body.fileId)
                        res.redirect('/dashboard');
                    } else {
                        req.flash('error_msg', req.body.name + ' not found as user')
                        res.redirect('/dashboard');
                    }
                })
        })
})

module.exports = router;