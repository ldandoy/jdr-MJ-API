import express from 'express'

import auth from '../middlewares/auth'
import adminBugCtrl from '../controllers/admin/bugCtrl'

const Router = express.Router()

Router.get('/bugs', auth, adminBugCtrl.getBugs)

export default Router