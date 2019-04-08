const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const multer = require('multer');

const File = require('../models/Files')

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
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    const newFile = new 
    req.flash('success_msg', 'File uploaded')
    res.redirect('/dashboard')
})

module.exports = router;