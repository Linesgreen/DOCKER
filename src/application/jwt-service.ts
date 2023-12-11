// noinspection UnnecessaryLocalVariableJS

import {UserDBType} from "../types/users/output";
import jwt from 'jsonwebtoken'
import {WithId} from "mongodb";

require('dotenv').config();

const secretWord = process.env.JWT_SECRET || 'BLABLABLA';
export const jwtService = {

    async createJWT(user: WithId<UserDBType>) {
        console.log(`секретное слово = ${secretWord} = тока никому не говори!`);
        const token: string = jwt.sign({userId: user._id}, secretWord, {expiresIn: '1h'});
        return token;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, secretWord);
            return result.userId
        } catch (error) {
            console.log(error);
            return null
        }
    },
};