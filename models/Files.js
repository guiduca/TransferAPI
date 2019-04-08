const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    uploader: {
        type: String,
        required : true
    },
    permited : {
        type : [String],
        required: false
    }
})  

const File = mongoose.model('File', FileSchema)

module.exports = File;