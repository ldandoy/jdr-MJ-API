import { Response } from 'express'
import { IReqAuth } from '../config/interfaces'

import Bug from '../models/bugModel'

const bugCtrl = {
    createBug: async (req: IReqAuth, res: Response) => {
        try {
            const bug = {
                owner:      req.user?._id,
                report:     req.body.report,
            };
        
            await Bug.create(bug)

            res.status(200).json({msg: 'Rapport bien créé ! Merci !'})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default bugCtrl