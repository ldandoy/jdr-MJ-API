import express from 'express'
import multer from 'multer'
import path from 'path'

import authAdmin from '../middlewares/auth'
import adminUserCtrl from '../controllers/admin/userCtrl'

const storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: function(req, file, cb) {
        cb(null, "IMAGE-"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: {fileSize:1000000}
})

const Router = express.Router()

Router.get('/users', authAdmin, adminUserCtrl.getUsers)

Router.get('/users/:userId', authAdmin, adminUserCtrl.getUser)

Router.delete('/users/:userId', authAdmin, adminUserCtrl.deleteUser)

Router.patch('/users/:userId/edit', authAdmin,  upload.single('avatar'), adminUserCtrl.updateUser)

export default Router