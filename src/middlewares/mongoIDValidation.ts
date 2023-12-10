import {param} from "express-validator";




export const mongoIDValidation = param('id').isMongoId().withMessage('id NOT mongoID');