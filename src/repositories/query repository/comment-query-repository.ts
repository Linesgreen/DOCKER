
import {ObjectId, WithId} from "mongodb";
import {commentCollection} from "../../db/db";
import {CommentType, OutputItemsCommentType} from "../../types/comment/output";
import {CommentMapper} from "../../types/comment/commentMapper";


// noinspection UnnecessaryLocalVariableJS
export class CommentQueryRepository {

    //Возвращает коментарии переработанные в мапере
    static async getAllComments() {

        const comments: WithId<CommentType>[] = await commentCollection
            .find({})
            .toArray();

        return comments
    }

    // Получаем коментарий по коммент айд
    static async getCommentById(id: string) : Promise<OutputItemsCommentType | null> {
        const comments: WithId<CommentType> | null = await commentCollection.findOne({_id: new ObjectId(id)});
        return comments ? CommentMapper(comments) : null
    }

    // Получаем коментарии по пост айди
    static async getCommentsByPostId(id: string): Promise<OutputItemsCommentType[] | null> {
        const comments: WithId<CommentType>[] | null = await commentCollection.find({postId: id}).toArray();
        return comments ? comments.map(CommentMapper) : null

    }

    //Полное удаление для тестов
    static async deleteAll() {
        await commentCollection.deleteMany({})
    }

}