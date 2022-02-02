import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { IReqAuth } from '../config/interfaces'
import Users from '../models/userModel'
import bugModel from '../models/bugModel'

const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let { avatar, name, type, password, cf_password } = req.body
            
            if (typeof req.file === 'object') {
                avatar = process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
            }

            if (type === 'Google') {
                const user = await Users.findOneAndUpdate({_id: req.user._id, type: "Google"}, {$set:{
                    avatar,
                    name
                }}, {new: true}).select('-password').populate('senarii')
                res.json({msg:"User bien mise à jour !", user})
            } else if (type === 'normal') {
                if (password === '') {
                    return res.status(500).json({msg: "Le mot de passe est vide !"})    
                }

                if (password !== cf_password) {
                    return res.status(500).json({msg: "Error lors de la confirmation du mot de passe !"})    
                }
                
                const passwordHash = await bcrypt.hash(password, 12)
                const user = await Users.findOneAndUpdate({_id: req.user._id, type: "normal"}, {$set:{
                    avatar,
                    name,
                    password: passwordHash
                }}, {new: true}).select('-password').populate('senarii')
                res.json({msg:"User bien mise à jour !", user})
            } else {
                return res.status(500).json({msg: "Error lors de la mise à jour de votre compte !"})    
            }
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBugsUser: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            const bugs = await bugModel.find({ owner: req.user._id }).populate('owner')
            res.json(bugs)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getBugUser: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            const { id } = req.params
            const bug = await bugModel.findOne({ _id: id, owner: req.user._id })
                .populate('owner')
                .populate({
                    path:     'comments',			
                    populate: {
                        path:  'owner'
                    }
                })
            res.json(bug)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    addComment: async (req: IReqAuth, res: Response) => {
        try {
            const bug = await bugModel.findOneAndUpdate({
                "_id": req.params.bugId
            }, {
                $push: {comments: {
                    content: req.body.content,
                    owner: req.user?._id
                }}
            }, {new: true})

            res.status(200).json({
                msg: "Réponse bien ajouté !",
                bug
            })
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteComment : async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let bug = await bugModel.findOne({"_id": req.params.bugId})

            if (req.user._id.equals(bug.comments[req.params.index].owner)) {
                bug.comments.splice(req.params.index, 1);

                await bug.save()

                res.status(200).json({bug, msg: 'Commentaire bien supprimer !'})
            } else {
                return res.status(500).json({msg: "Vous n'êtes pas l'auteur de commentaire !"})
            }
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}


export default userCtrl;