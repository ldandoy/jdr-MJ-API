import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import routes from './routes/index'

// Middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: [`${process.env.BASE_URL}`],
    credentials: true,
}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.static('public'))

// Database
import './config/database'

// Routes
app.use('/api', routes.authRouter)
app.use('/api', routes.userRouter)
app.use('/api', routes.senariiRouter)
app.use('/api', routes.bugRouter)

// server listenning
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.BASE_URL}`)
})