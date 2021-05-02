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
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('senarios', SenarioSchema);