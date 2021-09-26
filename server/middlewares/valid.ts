import { Request, Response, NextFunction } from 'express'

export const validRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { name, account, password } = req.body

    const errors = []

    if (!name) {
        errors.push('Ajouter votre nom')
    } else if (name.length > 20) {
        errors.push('Votre nom ne peut dépasser 20 caractères')
    }

    if (!account) {
        errors.push({ msg: '' })
    } else if (!validPhone(account) && !validEmail(account)) {
        errors.push('Votre email ou votre numéro de téléphone est mal formaté')
    }

    if (password.length < 6) {
        errors.push("Votre mot de passe doit avoir au moins 6 caractères")
    }

    if (errors.length > 0) return res.status(400).json({msg: errors})
    
    next()
}

export const validPhone = (phone: string) => {
    const re = /^[+]/g
    return re.test(phone)
}

export const validEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}