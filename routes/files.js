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
    const { originalname, uploader } = req.body;
    // console.log(req.body)
    const file = req.file
    const newFile = new File({
        originalname,
        uploader
    })
    newFile.save()
        .then(file => {
            req.flash('success_msg', 'File uploaded')
        })
        .catch(err => console.log(err));
    res.send(file)
})

module.exports = router;