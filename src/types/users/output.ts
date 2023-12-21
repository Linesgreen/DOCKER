// noinspection JSClassNamingConvention
import {ObjectId} from "mongodb";

export type UserDBType = {
    _id: ObjectId
    accountData: {
        "userName": string
        "email": string
        "passwordHash": string
        "createdAt": string
    }
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }

}

export type UserOutputType = {
    "id": string
    "login": string
    "email": string
    "createdAt": string
}

// noinspection JSClassNamingConvention
export type UserWithPaginationOutputType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputType[]
}




