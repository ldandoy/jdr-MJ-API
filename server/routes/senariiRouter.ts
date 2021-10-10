import express from 'express'

import auth from '../middlewares/auth'
import senariiCtrl from '../controllers/senariiCtrl'

const Router = express.Router()

Router.get('/senarii', senariiCtrl.all)

Router.get('/senarii/visible', senariiCtrl.visible)

Router.get('/senarii/:id', senariiCtrl.get)

Router.post('/senarii/:id', auth, senariiCtrl.update)

export default Router