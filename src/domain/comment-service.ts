import {CommentUpdateModel} from "../types/comment/input";
import {CommentRepository} from "../repositories/repositury/comment-repository";


export class CommentService {
    // Обновляем комментарий =  успех ✅true, не тот логин или пароль ❌false, нет такого поста 0️⃣null
    static async updateComment(commentId: string, content: CommentUpdateModel) {
        return await CommentRepository.updateComment(content, commentId)
    };

    //Удаляем комментарий по коммент айди =  успех ✅true, не успех ❌false
    static async deleteComment(commentId: string) {
        return await CommentRepository.deleteComment(commentId)
    }
}