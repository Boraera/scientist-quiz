const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    question:  {
        type: String,
        required: true
    },
    starter:  {
        type: String,
        default: ""
    },
    answer:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


var studysetSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    exercises:[exerciseSchema]
}, {
    timestamps: true
});

var Studysets = mongoose.model('Studyset', studysetSchema);

module.exports = Studysets;