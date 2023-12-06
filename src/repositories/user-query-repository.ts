import {isValidObjectId} from "./utils/Objcet(Id)Chek";
import {userCollection} from "../db/db";
import {ObjectId, WithId} from "mongodb";
import {UserDBType, UserOutputType} from "../types/users/output";
import {UserMapper} from "../types/users/UserMapper";

export class UserQueryRepository {
    static async getAllUsers(): Promise<UserOutputType[]> {
        const usersFromDB: WithId<UserDBType>[] = await userCollection.find({}).toArray();
        return usersFromDB.map(UserMapper)
    }
    static async getUserById(id: string): Promise<UserOutputType | null> {
        try {
            if (!isValidObjectId(id)) {
                throw new Error('id no objectID!');
            }
            const user: WithId<UserDBType> | null = await userCollection.findOne({_id: new ObjectId(id)});
            return user ? UserMapper(user) : null
        } catch (error) {
            console.log(error);
            return null
        }
    }
}