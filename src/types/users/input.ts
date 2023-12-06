export type UserCreateModel = {
    login: string
    password: string
    email: string
}


export type UserParams = {
    id: string
}

export type UserSortData = {
    searchEmailTerm?: string
    searchLoginTerm?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    pageNumber?: string
    pageSize?: string
}