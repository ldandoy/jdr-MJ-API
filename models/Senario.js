const mongoose = require("mongoose");

const SenarioSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    universe: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    picture: {
        type: String
    }
},{
    timestamps: true
});

module.exports = mongoose.model('senarios', SenarioSchema);