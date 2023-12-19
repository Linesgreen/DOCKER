import {UserDBType} from "../../types/users/output";
import {userCollection} from "../../db/db";
import {ObjectId, WithId} from "mongodb";

// noinspection UnnecessaryLocalVariableJS
export class UserRepository {
    //Возвращает id созданного пользователя
    static async addUser(newUser: UserDBType): Promise<string>{
        const result = await userCollection.insertOne(newUser);
        return result.insertedId.toString()
    }

    //Возвращает id созданного пользователя
    static async createUser(newUser: UserDBType): Promise<string> {
        const result = await userCollection.insertOne(newUser);
        return result.insertedId.toString()
    }

    static async getByLoginOrEmail(logOrEmail: string) {
        const user: WithId<UserDBType> | UserDBType | null = await userCollection.findOne({$or: [{email: logOrEmail}, {login: logOrEmail}]});
        return user
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});
        return !!deleteResult.deletedCount
    }
}