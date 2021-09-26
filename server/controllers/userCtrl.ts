import { Request, Response } from 'express'
import { IReqAuth } from '../config/interfaces'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: function(req, file, cb) {
        cb(null, "IMAGE-"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize:1000000}
}).single('file')

const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            const { avatar, name } = req.body

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, name
            })

            res.json({ msg: "Update Success!" })
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})
    
        if(req.user.type !== 'normal')
            return res.status(400).json({
                msg: `Quick login account with ${req.user.type} can't use this function.`
            })

        try {
            const { password } = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user._id}, {
                password: passwordHash
            })

            res.json({ msg: "Reset Password Success!" })
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProfileImage: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication."})

        try {
            await upload(req, res, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({msg: err.code + ": " + err.message})
                }

                res.json({
                    msg: "File uploaded!",
                    url: process.env.BACK_HOST+":"+process.env.PORT+"/upload/"+req.file?.filename
                })
            })
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    }
}


export default userCtrl;