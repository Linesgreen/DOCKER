import {body} from "express-validator";
import {inputModelValidation} from "../inputModel/input-model-Validation";

export const loginValidation = body('login')
    .isString()
    .matches(/^[a-zA-Z0-9_-]*$/)
    .isLength({min: 3, max: 10})
    .withMessage('Incorrect login');

export const passwordValidation = body('password')
    .isString()
    .isLength({min: 6, max: 20})
    .withMessage('Incorrect password');

export const emailValidation = body('email')
    .isString()
    .matches(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)
    .isLength({min: 6, max: 20})
    .withMessage('incorrect email');

export const userPostValidation = () => [loginValidation, passwordValidation, emailValidation, inputModelValidation];