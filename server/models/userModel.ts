import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ajouter votre nom'],
        trim: true,
        maxLength:[20, "Votre nom ne peut dépasser 20 caractères"]
    },
    account: {
        type: String,
        required: [true, 'Entrez votre email ou votre numéro de téléphone'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Entrez votre mot de passe'],
        trim: true,
        min:[6, "Votre mot de passe doit avoir au moins 6 caractères"]
    },
    avatar: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: String,
        default: 'user' // [user, admin]
    },
    type: {
        type: String,
        default: 'normal' // [normal, fast]
    },
    reset_token: {
        type: String,
        default: ''
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

export default mongoose.model('User', userSchema)