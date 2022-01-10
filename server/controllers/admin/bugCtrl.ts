import { Response } from 'express'
import { IReqAuth } from '../../config/interfaces'

import Bug from '../../models/bugModel'

const bugCtrl = {
    getBugs: async (req: IReqAuth, res: Response) => {
        try {
            const bugs = await Bug.find()
            console.log(bugs)

            res.status(200).json(bugs)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default bugCtrl