import {UserCreateModel} from "../types/users/input";
import bcrypt from 'bcrypt'
import {UserDBType} from "../types/users/output";
import {UserRepository} from "../repositories/repositury/user-repository";
import {ObjectId, WithId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns";

// noinspection UnnecessaryLocalVariableJS
export class UserService {

    //Возвращает id созданного пользователя
    static async addUser(userData: UserCreateModel): Promise<string> {
        const passwordHash = await bcrypt.hash(userData.password, 12);
        const newUser: UserDBType = {
            _id: new ObjectId(),
            accountData: {
                "userName": userData.login,
                "email": userData.email,
                "passwordHash": passwordHash,
                "createdAt": new Date().toISOString(),
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

        return await UserRepository.addUser(newUser)

    }


    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDBType> | null> {
        const user: UserDBType | null = await UserRepository.getByLoginOrEmail(loginOrEmail);
        if (user && await bcrypt.compare(password, user.accountData.passwordHash)) {
            return user
        }
        return null
    }

    //Возвращаем ✅true или ❌false
    static async deleteUserByID(id: string): Promise<boolean> {
        return await UserRepository.deleteUserById(id)
    }

}