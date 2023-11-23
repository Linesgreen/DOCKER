import {NextFunction, Request, Response} from "express";

const login = "admin" ;
const password = "qwerty";

export const authMiddleware = (req : Request,res : Response,next : NextFunction) => {
    const auth : string | undefined = req.headers['authorization']

    if (!auth) {
        res.sendStatus(401)
        return
    }

    const [basic, token] = auth.split(" ")

    if (basic != 'Basic') {
        res.sendStatus(401)
        return
    }

    const decodedData = Buffer.from(token,'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(":")

   return decodedLogin === login && decodedPassword === password ? next() : res.sendStatus(401)
}
