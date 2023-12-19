import {Request,Response, Router} from "express";
import nodemailer from "nodemailer";
import {emailAdapter} from "../adapters/email-adapter";
export const emailRouter = Router({});

emailRouter.post('/send', async (req : Request, res: Response) => {

    res.sendStatus(204);
});