import { Request, Response } from 'express'
import userModel from '../models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import md5 from 'md5'

import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../utils/generateToken'
import sendMail from '../utils/sendMail'
import { validEmail, validPhone } from '../middlewares/valid'
import { IDecodedToken, IGgPayload } from '../config/interfaces'

const client = new OAuth2Client(`${process.env.GOOGLE_CLIENT_ID}`)
const CLIENT_URL = `${process.env.BASE_URL}`

const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body

            const user = userModel.findOne({account})
            
            if(!user) return res.status(400).json({msg: 'Email or Phone number already exists.'})

            const passwordhash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordhash }

            const active_token = generateActiveToken({newUser})

            const url = `${process.env.BASE_URL}/active/${active_token}`

            if (validEmail(account)) {
                const html = '<h1>Bonjour</h1><p>Merci de valider votre compte <a href="' + url + '">en cliquant ici</a></p>'
                sendMail(account, "Active your account", html)
            
                return res.json({ 
                    msg: 'Bravo ! Vous avez reçu un email pour activer votre compte.',
                })
            } else {
                return res.status(500).json({msg: "Vos informations ne nous permettent pas de créer le compte."})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { account, password } = req.body
            
            const user = await userModel.findOne({account})

            if(!user) return res.status(400).json({msg: "Ce compte n'existe pas."})

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) return res.status(400).json({msg: "Mot de passe incorrecte."})

            const access_token = generateAccessToken({ id: user._id })
            const refresh_token = generateRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: `/api/refresh_token`,
                maxAge: 30*24*60*60*1000
            })

            res.json({
                msg: "Login Success!",
                access_token,
                user: {...user._doc, password: ''}
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    activeAccount: async(req: Request, res: Response) => {
        try {
            const { active_token } = req.body

            console.log(active_token)
    
            const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)

            const { newUser } = decoded 
    
            if(!newUser) return res.status(400).json({msg: "Invalid authentication."})
            
            const user = await userModel.findOne({ account: newUser.account })

            if (user) return res.status(400).json({msg: "Ce user existe déjà."})

            const new_user = new userModel(newUser)

            console.log(new_user)

            await new_user.save()

            res.json({msg: "Account has been activated!"})
    
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshtoken', { path: `/api/refresh_token` })
            return res.json({msg: "Logout !"})
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken

            if (!rf_token) return res.status(500).json({ msg: "Merci de vous authentifier !" })

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)

            if (!decoded) return res.status(500).json({ msg: "Merci de vous authentifier !" })

            const user = await userModel.findById(decoded.id).select('-password')

            if (!user) return res.status(500).json({ msg: "Ce compte n'existe pas !" })

            const access_token = generateAccessToken({id: user._id})

            res.json({
                access_token,
                user
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    googleLogin: async(req: Request, res: Response) => {
        try {
            const { id_token } = req.body
            const verify = await client.verifyIdToken({ 
                idToken: id_token,
                audience: `${process.env.GOOGLE_CLIENT_ID}`
            })

            const { email, email_verified, name, picture } = <IGgPayload>verify.getPayload()

            if (!email_verified) return res.status(500).json({msg: "Email verification failed."})

            const password = email + process.env.GOOGLE_SALT
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await userModel.findOne({account: email})
    
            if (user) {
                const access_token = generateAccessToken({ id: user._id })
                const refresh_token = generateRefreshToken({ id: user._id })

                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: `/api/refresh_token`,
                    maxAge: 30*24*60*60*1000
                })

                return res.json({
                    msg: "Login Success!",
                    access_token,
                    user: {...user._doc, password: ''}
                })
            } else {
                const user = {
                    name,
                    account: email, 
                    password: passwordHash, 
                    avatar: picture,
                    type: 'Google'
                }
                
                const newUser = new userModel(user)
                await newUser.save()

                const access_token = generateAccessToken({id: newUser._id})
                const refresh_token = generateRefreshToken({id: newUser._id})

                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: `/api/refresh_token`,
                    maxAge: 30*24*60*60*1000 // 30days
                })

                return res.json({
                    msg: 'Login Success!',
                    access_token,
                    user: { ...newUser, password: '' }
                })
            }
          
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
    },
    forgot_password: async(req: Request, res: Response) => {
        try {
            const { account } = req.body

            const user = await userModel.findOne({account: account})
    
            if (user) {
                if (user.type === "normal") {
                    const reset_token = md5(account)
                    
                    await userModel.findOneAndUpdate({_id: user._id}, {
                        reset_token
                    })

                    const url = `${process.env.BASE_URL}/reset_password/${reset_token}`
                    const html = '<h1>Bonjour</h1><p>Pour mettre à jour votre mot de passe <a href="' + url + '">cliquer ici</a></p><p>Vous avez 24h</p>'
                    sendMail(account, "Reset password", html)
                    return res.json({
                        msg: 'Un mail vous a été envoyé avec les instructions pour reinitialiser votre mot de passe'
                    })
                } else {
                    return res.status(500).json({msg: "Cet utilisateur ne peut pas reinitialiser son mot de passe"})
                }
            } else {
                return res.status(500).json({msg: "Cet utilisateur n'existe pas"})
            }
        
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    reset_password: async(req: Request, res: Response) => {
        try {
            const { account, password, cf_password } = req.body.form
            const { reset_token } = req.params

            const user = await userModel.findOne({
                account,
                reset_token
            })
    
            if (user) {
                const passwordhash = await bcrypt.hash(password, 12)

                await userModel.findOneAndUpdate({_id: user._id}, {
                    password: passwordhash,
                    reset_token: ""
                })

                return res.json({
                    msg: 'Votre mot de passe a bien été mis à jour. Vous pouvez à présent vous connecter avec celui-ci'
                })
            } else {
                return res.status(500).json({msg: "Les infos envoyées n'ont pas permis de mettre à jour le mot de passe"})
            }
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    }
}

export default authCtrl