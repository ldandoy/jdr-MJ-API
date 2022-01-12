import express from 'express'

import auth from '../middlewares/auth'
import scenariosCtrl from '../controllers/scenariosCtrl'

const Router = express.Router()

Router.get('/scenarios', scenariosCtrl.all)

Router.get('/scenarios/visible', scenariosCtrl.visible)

Router.get('/scenarios/:id', scenariosCtrl.get)

Router.put('/scenarios/:id', auth, scenariosCtrl.update)

Router.post('/scenarios/:id/comment', auth, scenariosCtrl.addComment)

Router.post('/scenarios/new', auth, scenariosCtrl.create)

Router.delete('/scenarios/:id', auth, scenariosCtrl.delete)

Router.delete('/scenarios/:id/comment/:index', auth, scenariosCtrl.deleteComment)

export default Router