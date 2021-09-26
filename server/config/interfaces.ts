import { Document } from 'mongoose'
import { Request } from 'express'

export interface IUser extends Document {
    name: string,
    account: string,
    password: string,
    avatar: string,
    role: string,
    type: string,
    reset_token: string
}

export interface INewUser {
    name: string,
    account: string,
    password: string
}

export interface IDecodedToken {
    id?: string
    newUser?: INewUser
    iat: Number
    exp:Number
}

export interface IGgPayload {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface IReqAuth extends Request {
    user?: IUser
}

export interface Senario {
    title: string
    description: string
    universe: string
    picture: string
}