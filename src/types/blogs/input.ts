export type BlogParams = {
    id: string
}

export type BlogSortData = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: string
    pageSize?: string
}


export type PostBlogReqBody = {
    name: string,
    description: string,
    websiteUrl: string
}


export type BlogCreateModel = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogUpdateModel = {
    name: string,
    description: string,
    websiteUrl: string
}


