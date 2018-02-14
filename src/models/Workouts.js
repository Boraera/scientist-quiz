const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var workoutSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    studyset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studyset',
    },
    answers:[String],
    score: Number
}, {
    timestamps: true
});

var Workouts = mongoose.model('Workout', workoutSchema);

module.exports = Workouts;