import { Request, Response } from 'express'
import { Senario, IReqAuth, Comment } from '../config/interfaces'
import senariiModel from '../models/senariiModel'
import userModel from '../models/userModel'

const createSenarii = async (senarii:Senario) => {
    return await senariiModel.create(senarii)
}

const addSenariiToUser = async (userId:string, senariiId: string) => {
    return await userModel.findByIdAndUpdate(
        userId,
        { $push: { senarii: senariiId } },
        { new: true, useFindAndModify: false }
      );
}

const senariiCtrl = {
    all: async (req: Request, res: Response) => {
        try {
            const senarii = await senariiModel.find().populate('owner')
            return res.json(senarii)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    visible: async (req: Request, res: Response) => {
        try {
            const senarii = await senariiModel.find({$or: [{status: "Béta"}, {status: "Publié"}]})
            return res.json(senarii)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const senario = await senariiModel.findOne({
                "_id" : req.params.id
            }).populate('owner')
            
            return res.json(senario)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    delete: async (req: IReqAuth, res: Response) => {
        try {
            const senario = await senariiModel.findOne({
                "_id" : req.params.id
            }).populate('owner')

            if (senario.owner._id.equals(req.user?._id)) {
                await senariiModel.deleteOne({
                    "_id": req.params.id
                })

                await userModel.updateOne({ '_id': senario.owner._id }, { $pull: { senarii: senario._id } })
            }
            
            res.status(200).json({"message": "Sénario bien supprimé !"})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    create: async (req: IReqAuth, res: Response) => {
        try {
            const senario = {
                title:          req.body.title,
                description:    req.body.description,
                universe:       req.body.universe,
                status:         req.body.status,
                picture:        req.body.picture,
                nbPersonne:     req.body.nbPersonne,
                duration:       req.body.duration,
                sections:       req.body.sections,
                owner:          req.user?._id
            };
        
            let newSenario = await createSenarii(senario)
            await addSenariiToUser(req.user?._id, newSenario._id)

            res.status(200).json(senario)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    update: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let data: Senario = req.body

            await senariiModel.updateOne({
                "_id": req.params.id
            }, {
                $set: data
            })

            res.status(200).json('Sénario bien mis à jour !')
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    addComment: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let comment: Comment = req.body

            await senariiModel.updateOne({
                "_id": req.params.id
            }, {
                $push: {comments: comment}
            })

            res.status(200).json({msg: 'Commentaire bien ajouter !'})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteComment : async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let scenario = await senariiModel.findOne({"_id": req.params.id})

            if (req.user._id.equals(scenario.comments[req.params.index].owner)) {
                scenario.comments.splice(req.params.index, 1);

                await scenario.save()

                res.status(200).json({scenario, msg: 'Commentaire bien supprimer !'})
            } else {
                return res.status(500).json({msg: "Vous n'êtes pas l'auteur de commentaire !"})
            }
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default senariiCtrl;