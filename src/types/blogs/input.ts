export type BlogParams = {
    id: string
}

export type GetBlogsSortDataType = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: number
    pageSize?: number
}

export type SortData = {
    searchNameTerm: string | null
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
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


