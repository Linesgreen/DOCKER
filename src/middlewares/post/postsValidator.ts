import {body} from "express-validator";
import {blogIdValidationInBody,} from "../blog/blogsValidator";
import {inputModelValidation} from "../inputModel/input-model-Validation";
import {mongoIDValidation} from "../mongoIDValidation";

export const titleValidation = body('title')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Incorrect title');

export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect shortDescription');

export const contentValidation = body('content')
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect content');

export const commentContentValidation = body('content')
    .isString()
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Incorrect content');

export const postPostValidation = () => [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidationInBody, inputModelValidation];
export const postInBlogValidation = () => [titleValidation, shortDescriptionValidation, contentValidation, mongoIDValidation, inputModelValidation];
export const postPutValidation = () => [titleValidation, shortDescriptionValidation, contentValidation, mongoIDValidation, blogIdValidationInBody, inputModelValidation];
export const addCommentToPost = () => [mongoIDValidation, commentContentValidation, inputModelValidation];
