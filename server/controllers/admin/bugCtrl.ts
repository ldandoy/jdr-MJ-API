import { Response } from 'express'
import { IReqAuth } from '../../config/interfaces'

import bugModel from '../../models/bugModel'

const bugCtrl = {
    getBugs: async (req: IReqAuth, res: Response) => {
        try {
            const bugs = await bugModel.find().populate("owner")
            res.status(200).json(bugs)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getBug: async (req: IReqAuth, res: Response) => {
        try {
            const bug = await bugModel.findOne({
                _id: req.params.bugId
            }).populate("owner")
            res.status(200).json(bug)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteBug: async (req: IReqAuth, res: Response) => {
        try {
            await bugModel.findOneAndDelete({
                _id: req.params.bugId
            })
            res.status(200).json({msg: "Report deleted !"})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
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

export default bugCtrl