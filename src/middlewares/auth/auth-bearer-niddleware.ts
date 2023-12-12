import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {UserQueryRepository} from "../../repositories/query repository/user-query-repository";
import {ObjectId} from "mongodb";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction)=> {
    const auth: string | undefined = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401);

    }

    const [bearer, token] = auth.split(" ");
    if (bearer !== 'Bearer') {
        console.log('Bearer не Bearer');
        return res.sendStatus(401);

    }
    const userId = await jwtService.getUserIdByToken(token);
    console.log(userId);
    if (!ObjectId.isValid(userId)) {
        console.log('Токен не прошел');
        return res.send(401);

    }
    req.user = await UserQueryRepository.getUserById(userId);
    console.log('user найден');
    return  next()
};