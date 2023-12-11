import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {UserQueryRepository} from "../../repositories/query repository/user-query-repository";

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction)=> {
    const auth: string | undefined = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(401);
        return
    }

    const [bearer, token] = auth.split(" ");
    if (bearer !== 'Bearer') {
        console.log('Bearer не тот что надо');
        res.sendStatus(401);
        return
    }
    const userId = await jwtService.getUserIdByToken(token);
    console.log(userId);
    if (!userId) {
        console.log('Токен не прошел');
        res.send(401);
        return
    }
    req.user = await UserQueryRepository.getUserById(userId);
    console.log('user найден');
    next()
};