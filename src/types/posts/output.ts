// noinspection JSClassNamingConvention


export type PostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
//OutputItemsBlogType
export type OutputItemsPostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type OutputPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: OutputItemsPostType[]
}

