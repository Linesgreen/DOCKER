import {commentCollection} from "../../db/db";
import {CommentType} from "../../types/comment/output";
import {CommentUpdateModel} from "../../types/comment/input";
import {ObjectId} from "mongodb";


export class CommentRepository {
    /**
     * Добавляет комментариий к посту
     * @param newComment - Коментарий
     * @returns id in string
     */
    // Возвращает ID созданного поста
    static async addComment(newComment: CommentType): Promise<string> {
        const addResult = await commentCollection.insertOne(newComment);
        return addResult.insertedId.toString()
    }

    /**
     * Обновляет коментарий к посту
     * @param params - Текст нового коментария
     * @param id - id коментария
     * @returns ✅true, не успех ❌false
     */
    static async updateComment(params: CommentUpdateModel, id: string) {
        const updateResult = await commentCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content: params.content
            }
        });
        return !!updateResult.matchedCount
    }

    /**
     * Удаляет коментарий
     * @param id - id комментария
     * @returns успех ✅true, не успех ❌false
     */
    static async deleteComment(id: string) {
        const deleteResult = await commentCollection.deleteOne({_id: new ObjectId(id)});
        return !!deleteResult.deletedCount
    }
}