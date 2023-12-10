import {CommentUpdateModel} from "../types/comment/input";
import {CommentRepository} from "../repositories/repositury/comment-repository";

export class CommentService {
    // Обновляем комментарий =  успех ✅true, не успех ❌false
    static async updateComment(params: CommentUpdateModel, id: string) {
        return await CommentRepository.updateComment(params, id)
    };

    //Удаляем комментарий по коммент айди =  успех ✅true, не успех ❌false
    static async deleteComment(id: string) {
        return await CommentRepository.deleteComment(id)
    }
}