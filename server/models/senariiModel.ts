import mongoose, { Schema } from 'mongoose'

const senariiSchema = new mongoose.Schema({
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('Senario', senariiSchema)