const mongoose = require('mongoose');

const RestrictedFileSchema = new mongoose.Schema({
    userID: {
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
        type: String,
        required: ['Admin'],
    },
    publishUsers: {
        type: [String],
        default: ['Admin'],
    },
});

RestrictedFileSchema.methods.addUser = (userID, rights = { r, w, x }) => {
    if (rights.r && this.writeUsers.indexof(userID) !== -1) {
        this.writeUsers.push(userID);
    }
    if (rights.w && this.readUsers.indexof(userID) !== -1) {
        this.readUsers.push(userID);

    }
    if (rights.x && this.publishUsers.indexof(userID) !== -1) {
        this.publishUsers.push(userID);
    }
}

RestrictedFileSchema.methods.canAccess =(userID) => {
    return ({
        r: this.writeUsers.indexof(userID) !== -1,
        w: this.readUsers.indexof(userID) !== -1,
        x: this.publishUsers.indexof(userID) !== -1,
    });
}

const RestrictedFile = mongoose.model('RestrictedFile', RestrictedFileSchema)

module.exports = RestrictedFile;