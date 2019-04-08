const mongoose = require('mongoose');

const RestrictedFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    }
    writeUsers: {
        type: [String],
        required: ['Admin'],
    },
    readUsers: {
        type: String,
        required: ['Admin'],
    },
    publishUsers: {
        type: [String],
        default: ['Admin'],
    },
});

RestrictedFileSchema.methods.addUser(username: String, rights { r: Boolean, w: Boolean, x: Boolean }) {
    if (r && this.writeUsers.indexof(username) !== -1) { 
        this.writeUsers.push(username);
    }
    if (w && this.readUsers.indexof(username) !== -1)  { 
        this.readUsers.push(username);
     
    }
    if (x && this.publishUsers.indexof(username) !== -1) { 
        this.publishUsers.push(username);
    }
}

RestrictedFileSchema.methods.canAccess(username: String) {
    return ({
        r: this.writeUsers.indexof(username) !== -1,
        w: this.readUsers.indexof(username) !== -1,
        x: this.publishUsers.indexof(username) !== -1,
    });
}

const RestrictedFile = mongoose.model('RestrictedFile', RestrictedFileSchema)

module.exports = RestrictedFile;