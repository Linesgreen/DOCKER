import {commentCollection} from "../../db/db";
import {CommentType} from "../../types/comment/output";
import {CommentUpdateModel} from "../../types/comment/input";
import {ObjectId} from "mongodb";


export class CommentRepository {

    // Возвращает ID созданного поста
    static async addComment(newComment: CommentType): Promise<string> {
        const addResult = await commentCollection.insertOne(newComment);
        return addResult.insertedId.toString()
    }

    // успех ✅true, не успех ❌false
    static async updateComment(params: CommentUpdateModel, id: string) {
        const updateResult = await commentCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: params.content
            }
        });
        return !!updateResult.matchedCount
    }

    // успех ✅true, не успех ❌false
    static async deleteComment(id: string) {
        const deleteResult = await commentCollection.deleteOne({_id: new ObjectId(id)});
        return !!deleteResult.deletedCount
    }
}