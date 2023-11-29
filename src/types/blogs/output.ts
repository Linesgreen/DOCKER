export type OutputItemsBlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

// noinspection JSClassNamingConvention
export type OutputBlogType = {
    pagesCount: any
    page: number
    pageSize: number
    totalCount: number
    items: OutputItemsBlogType[]
}

export type BlogType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
