import {UserOutputType} from "./users/output";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserOutputType | null
        }
    }
}