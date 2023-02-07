import {body} from 'express-validator'

export const registerValidation = [
    body('email').isEmail(),
    body('passwordHash').isLength({min: 7}),
    body('nickName').isLength({min: 3}),
    body('avatarUrl').optional().isURL()
]
export const loginValidation = [
    body('email').isEmail(),
    body('passwordHash').isLength({min: 7}),
]
