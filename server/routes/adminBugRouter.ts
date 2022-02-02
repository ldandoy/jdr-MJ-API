import express from 'express'

import authAdmin from '../middlewares/auth'
import adminBugCtrl from '../controllers/admin/bugCtrl'

const Router = express.Router()

Router.get('/bugs', authAdmin, adminBugCtrl.getBugs)

Router.get('/bugs/:bugId', authAdmin, adminBugCtrl.getBug)

Router.delete('/bugs/:bugId', authAdmin, adminBugCtrl.deleteBug)

Router.post('/bugs/:bugId/comments', authAdmin, adminBugCtrl.addComment)

Router.delete('/bugs/:bugId/comment/:index', authAdmin, adminBugCtrl.deleteComment)

export default Router