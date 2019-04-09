const mongoose = require('mongoose');

const RestrictedFileSchema = new mongoose.Schema({
    uploader: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    writeUsers: {
        type: [String],
        required: ['Admin'],
    },
    readUsers: {
        type: [String],
        required: ['Admin'],
    },
    publishUsers: {
        type: [String],
        default: ['Admin'],
    },
    date: {
        type: Date,
        default: Date.now
    }
});

RestrictedFileSchema.methods.addUser = (userID, rights = { r, w, x }) => {
    if (rights.r && this.writeUsers.indexOf(userID) !== -1) {
        this.writeUsers.push(userID);
    }
    if (rights.w && this.readUsers.indexOf(userID) !== -1) {
        this.readUsers.push(userID);

    }
    if (rights.x && this.publishUsers.indexOf(userID) !== -1) {
        this.publishUsers.push(userID);
    }
}

RestrictedFileSchema.methods.getUserRightsOnFile = function(userID) {
    return ({
        r: this.writeUsers.indexOf(userID) !== -1,
        w: this.readUsers.indexOf(userID) !== -1,
        x: this.publishUsers.indexOf(userID) !== -1,
    });
}

RestrictedFileSchema.methods.canAccess = function(userID) {
    if (this.readUsers.indexOf(userID) !== -1 ||
        this.writeUsers.indexOf(userID) !== -1 || 
        this.publishUsers.indexOf(userID) !== -1)
        return true;
    return false;
}

const RestrictedFile = mongoose.model('RestrictedFile', RestrictedFileSchema)

module.exports = RestrictedFile;