import mongoose, { Schema } from 'mongoose'

const bugSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    report: {
        type: String,
        require: true
    },
    comments: [{
        content: {
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

export default mongoose.model('Bug', bugSchema)
