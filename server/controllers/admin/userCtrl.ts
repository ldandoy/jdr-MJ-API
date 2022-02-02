import { Response } from 'express'
import { IReqAuth } from '../../config/interfaces'
import bcrypt from 'bcrypt'

import userModel from '../../models/userModel'

const userCtrl = {
    getUsers: async (req: IReqAuth, res: Response) => {
        try {
            const users = await userModel.find().select('-password').populate('senarii')
            res.status(200).json(users)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req: IReqAuth, res: Response) => {
        try {
            const user = await userModel.findOne({
                _id: req.params.userId
            }).select('-password').populate('senarii')
            res.status(200).json(user)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteUser: async (req: IReqAuth, res: Response) => {
        try {
            await userModel.findOneAndDelete({
                _id: req.params.userId
            })
            res.status(200).json({msg: "User deleted !"})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateUser: async (req: IReqAuth, res: Response) => {
        try {
            let { avatar, name, type, password, cf_password } = req.body
            
            if (typeof req.file === 'object') {
                avatar = process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
            }

            if (type === 'Google') {
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    type,
                    name
                }}, {new: true}).populate('senarii')
                res.json(user)
            } else if (type === 'normal') {
                if (password === '') {
                    return res.status(500).json({msg: "Le mot de passe est vide !"})    
                }

                if (password !== cf_password) {
                    return res.status(500).json({msg: "Error lors de la confirmation du mot de passe !"})    
                }
                const passwordHash = await bcrypt.hash(password, 12)
                const user = await userModel.findOneAndUpdate({_id: req.params.userId}, {$set:{
                    avatar,
                    name,
                    type,
                    password: passwordHash
                }}, {new: true}).select('-password').populate('senarii')
                res.json(user)
            } else {
                return res.status(500).json({msg: "Error lors de la mise à jour de votre compte !"})    
            }
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}

export default userCtrl