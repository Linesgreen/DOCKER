import {UserDBType} from "../../types/users/output";
import {userCollection} from "../../db/db";
import {ObjectId} from "mongodb";

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
        const user: UserDBType | null = await userCollection.findOne({$or: [{"accountData.email": logOrEmail}, {"accountData.userName": logOrEmail}]});
        return user
    }

    static async activatedUser(code: string) {
        const result = await userCollection.updateOne({"emailConfirmation.confirmationCode": code},{$set: {"emailConfirmation.isConfirmed": true}});
        return !!result.modifiedCount
    }

    static async updateRegCode(email: string, newConfCode: string, expirationDate: Date): Promise<boolean> {
        const result = await userCollection
            .updateOne({"accountData.email": email}, {
                $set: {
                    "emailConfirmation.confirmationCode": newConfCode,
                    "emailConfirmation.expirationDate": expirationDate
                }
            });
        return !!result.modifiedCount
    }

    static async deleteUserById(id: string): Promise<boolean> {
        const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});
        return !!deleteResult.deletedCount
    }
}