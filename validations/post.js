import {body} from 'express-validator'

export const postCreateValidation = [
    body('title').isLength({min: 3}),
    body('text').isLength({min: 10}),
    body('imageUrl').optional().isString()
]
