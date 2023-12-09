export type CommentType = {
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type OutputItemsCommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

