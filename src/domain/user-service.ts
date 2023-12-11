import {UserCreateModel} from "../types/users/input";
import bcrypt from 'bcrypt'
import {UserDBType} from "../types/users/output";
import {UserRepository} from "../repositories/repositury/user-repository";
import {WithId} from "mongodb";

// noinspection UnnecessaryLocalVariableJS
export class UserService {

    //Возвращает id созданного пользователя
    static async addUser(userData: UserCreateModel): Promise<string> {
        const passwordHash = await bcrypt.hash(userData.password, 12);
        const newUser: UserDBType = {
            login: userData.login,
            email: userData.email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        };

        return await UserRepository.addUser(newUser)

    }


    static async checkCredentials(loginOrEmail: string, password: string): Promise<WithId<UserDBType> | null> {
        const user: WithId<UserDBType> | null = await UserRepository.getByLoginOrEmail(loginOrEmail);
        if (user && await bcrypt.compare(password, user.password)) {
            return user
        }
        return null
    }

    //Возвращаем ✅true или ❌false
    static async deleteUserByID(id: string): Promise<boolean> {
        return await UserRepository.deleteUserById(id)
    }
}