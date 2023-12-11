import {CommentUpdateModel} from "../types/comment/input";
import {CommentRepository} from "../repositories/repositury/comment-repository";
import {CommentQueryRepository} from "../repositories/query repository/comment-query-repository";
import {OutputItemsCommentType} from "../types/comment/output";

export class CommentService {
    // Обновляем комментарий =  успех ✅true, не тот логин или пароль ❌false, нет такого поста 0️⃣null
    static async updateComment(userInfo: {userId: string, userLogin: string},commentId: string, content: CommentUpdateModel) {
        const comment: OutputItemsCommentType | null = await CommentQueryRepository.getCommentById(commentId);
        if (!comment) {
            return null
        }
        if (comment?.commentatorInfo.userId === userInfo.userId && comment?.commentatorInfo.userLogin === userInfo.userLogin) {
            return await CommentRepository.updateComment(content, commentId)
        }
        return false
    };

    //Удаляем комментарий по коммент айди =  успех ✅true, не успех ❌false
    static async deleteComment(id: string) {
        return await CommentRepository.deleteComment(id)
    }
}