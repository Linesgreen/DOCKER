import {UserDBType} from "../types/users/output";
import {userCollection} from "../db/db";

export class UserRepository {
    static async addUser(newUser: UserDBType) : Promise<string>{
        const result = await userCollection.insertOne(newUser);
        return result.insertedId.toString()
    }
}