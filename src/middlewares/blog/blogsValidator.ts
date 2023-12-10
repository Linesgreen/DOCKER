// noinspection AnonymousFunctionJS

import {body} from "express-validator";
import {inputModelValidation} from "../inputModel/input-model-Validation";
import {BlogQueryRepository} from "../../repositories/query repository/blog-query-repository";
import {NextFunction, Request, Response} from "express";
import {mongoIDValidation} from "../mongoIDValidation";

export const nameValidation = body('name')
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Incorrect name');


export const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description');

export const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .matches('https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
    .withMessage('Incorrect websiteUrl');


export const blogIdValidationInBody = body('blogId').isString().trim().custom(async (value) => {
    const blog = await BlogQueryRepository.getBlogById(value);
    if (!blog) {
        throw new Error('Incorrect blogId!')
    }
    return true
}).withMessage('Incorrect blogId!');

export const blogIdInParamsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const blogIg: string = req.params.id;
    const blog = await BlogQueryRepository.getBlogById(blogIg);
    if (!blog) {
        res.sendStatus(404);
        return undefined;
    }
    return next()
};


export const blogPostValidation = () => [websiteUrlValidation, descriptionValidation, nameValidation, mongoIDValidation, inputModelValidation];

export const blogPutValidation = () => [websiteUrlValidation, descriptionValidation, nameValidation, mongoIDValidation, inputModelValidation];