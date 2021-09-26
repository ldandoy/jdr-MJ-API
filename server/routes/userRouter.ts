import express from 'express'
import auth from '../middlewares/auth'
import userCtrl from '../controllers/userCtrl'

const Router = express.Router()

Router.patch('/me', auth, userCtrl.updateUser)

Router.patch('/reset_password', auth, userCtrl.resetPassword)

Router.post('/update_profile_image', auth, userCtrl.updateProfileImage)

export default Router