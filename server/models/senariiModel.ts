import mongoose, { Schema } from 'mongoose'

const senariiSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    status: {
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
    },
    nbPersonne: {
        type: String
    },
    duration: {
        type: String
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    sections:[{
        title: { type: String},
        picture: { type: String},
        description: { type: String},
        actions: [{
            label: {type: String},
            url: {type: String},
            type: {type: String},
            success: {type: String},
            competence: {type: String},
            gotoSuccess: {type: String},
            gotoLabelSuccess: {type: String},
            textSuccess: {type: String},
            gotoFailed: {type: String},
            gotoLabelFailed: {type: String},
            textFailed: {type: String},
            textCombat: {type: String},
        }]
    }],
    comments:[{
        com: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('Senario', senariiSchema)