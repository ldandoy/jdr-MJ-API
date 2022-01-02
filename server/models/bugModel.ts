import mongoose, { Schema } from 'mongoose'

const bugSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    fullname: {
        type: String,
        require: true
    },
    report: {
        type: String,
        require: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('Bug', bugSchema)
