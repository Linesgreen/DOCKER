import {UserDBType} from "../types/users/output";
import {userCollection} from "../db/db";
import {isValidObjectId} from "./utils/Objcet(Id)Chek";
import {ObjectId, WithId} from "mongodb";

// noinspection UnnecessaryLocalVariableJS
export class UserRepository {
    static async addUser(newUser: UserDBType) : Promise<string>{
        const result = await userCollection.insertOne(newUser);
        return result.insertedId.toString()
    }

    static async getByLoginOrEmail(logOrEmail: string): Promise<WithId<UserDBType> | null> {
        const user: WithId<UserDBType> | null = await userCollection.findOne({$or: [{email: logOrEmail}, {login: logOrEmail}]});
        return user
    }

    static async deleteUserById(id: string): Promise<boolean> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("id no objectID!");
            }
            const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});
            return !!deleteResult.deletedCount
        } catch (e) {
            console.log(e);
            return false
        }
    }
}