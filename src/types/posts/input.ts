export type PostParams = {
    id: string
}

export type PostCreateModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostToBlogCreateModel = {
    title: string,
    shortDescription: string,
    content: string,
}

export type PostUpdateModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
export type PostSortData = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: string
    pageSize?: string
}