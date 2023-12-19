import {UserDBType, UserOutputType} from "./output";

export const UserMapper = (user: UserDBType): UserOutputType => {
    return {
        id: user._id.toString(),
        login: user.accountData.userName,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt
    }
};