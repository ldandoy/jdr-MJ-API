import express from 'express'
import multer from 'multer'
import path from 'path'

import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'

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

Router.patch('/user/me', auth, upload.single('avatar'), userCtrl.updateUser)

Router.get('/user/bugs', auth, userCtrl.getBugsUser)

Router.get('/user/bugs/:id', auth, userCtrl.getBugUser)

Router.post('/user/bugs/:bugId/comments', auth, userCtrl.addComment)

Router.delete('/user/bugs/:bugId/comment/:index', auth, userCtrl.deleteComment)

export default Router