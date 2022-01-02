import express from 'express'

import auth from '../middlewares/auth'
import bugCtrl from '../controllers/bugCtrl'

const Router = express.Router()

Router.post('/bug', auth, bugCtrl.createBug)

export default Router