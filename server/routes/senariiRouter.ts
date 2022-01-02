import express from 'express'

import auth from '../middlewares/auth'
import senariiCtrl from '../controllers/senariiCtrl'

const Router = express.Router()

Router.get('/senarii', senariiCtrl.all)

Router.get('/senarii/visible', senariiCtrl.visible)

Router.get('/senarii/:id', senariiCtrl.get)

Router.put('/senarii/:id', auth, senariiCtrl.update)

Router.post('/senarii/:id/comment', auth, senariiCtrl.addComment)

Router.post('/senarii/new', auth, senariiCtrl.create)

Router.delete('/senarii/:id', auth, senariiCtrl.delete)

export default Router