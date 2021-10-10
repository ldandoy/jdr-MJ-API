import { Request, Response } from 'express'
import { Senario, IReqAuth } from '../config/interfaces'
import senariiModel from '../models/senariiModel'

const senariiCtrl = {
    all: async (req: Request, res: Response) => {
        try {
            const senarii = await senariiModel.find()
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
            })
            
            return res.json(senario)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            await senariiModel.remove({
                "_id": req.params.id
            })
            
            res.status(200).json({"message": "Sénario bien supprimé !"})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const senario = new senariiModel ({
                title:          req.body.title,
                description:    req.body.description,
                universe:       req.body.universe,
                picture:        null
            });
        
            await senario.save()

            res.status(200).json(senario)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    update: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            let data: Senario = req.body

            console.log(req.body, req.params.id)

            await senariiModel.updateOne({
                "_id": req.params.id
            }, {
                $set: data
            })

            res.status(200).json('Sénario bien mis à jour !')
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default senariiCtrl;