import {UserCreateModel} from "../types/users/input";
import bcrypt from 'bcrypt'
import {UserDBType} from "../types/users/output";
import {UserRepository} from "../repositories/repositury/user-repository";
import {WithId} from "mongodb";

// noinspection UnnecessaryLocalVariableJS
export class UserService {
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

    static async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user: WithId<UserDBType> | null = await UserRepository.getByLoginOrEmail(loginOrEmail);

        return user ? await bcrypt.compare(password, user.password) : false
    }

    static async deleteUserByID(id: string): Promise<boolean> {
        return await UserRepository.deleteUserById(id)
    }
}