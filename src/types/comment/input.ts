export type CommentParams = {
    id: string
}
export type CommentCreateModel = {
    content: string,
}

export type CommentUpdateModel = {
    content: string
}

export type CommentsSortData = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: string
    pageSize?: string
}
