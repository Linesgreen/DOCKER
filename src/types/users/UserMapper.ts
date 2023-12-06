import {WithId} from "mongodb";
import {UserDBType, UserOutputType} from "./output";

export const UserMapper = (user: WithId<UserDBType>) : UserOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
};