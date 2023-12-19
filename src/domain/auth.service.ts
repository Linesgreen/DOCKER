import {UserCreateModel} from "../types/users/input";
import bcrypt from "bcrypt";
import {UserDBType} from "../types/users/output";
import {v4 as uuidv4} from "uuid"
import {add} from "date-fns";
import {ObjectId} from "mongodb";
import {UserRepository} from "../repositories/repositury/user-repository";
import {UserQueryRepository} from "../repositories/query repository/user-query-repository";

export const authService = {
    async createUser(userData: UserCreateModel) {
        const passwordHash = await bcrypt.hash(userData.password, 12);
        const newUser: UserDBType = {
            _id: new ObjectId(),
            accountData: {
                userName: userData.login,
                email: userData.email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        };
        const newUserID = await UserRepository.createUser(newUser);
        const user = await UserQueryRepository.getUserById(newUserID);
    }
};