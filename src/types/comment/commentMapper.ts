import {WithId} from "mongodb";
import {CommentType, OutputItemsCommentType} from "./output";

export const CommentMapper = (comment: WithId<CommentType>): OutputItemsCommentType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt
    }
};