import {UserCreateModel} from "../types/users/input";
import bcrypt from 'bcrypt'
import {UserDBType} from "../types/users/output";
import {UserRepository} from "../repositories/user-repository";

export class UserService {
    static async addUser(userData: UserCreateModel): Promise<string> {
        const passwordHash = await bcrypt.hash(userData.password, 12);
        const newUser: UserDBType = {
            login : userData.login,
            email: userData.email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        };

        return await UserRepository.addUser(newUser)

    }
}