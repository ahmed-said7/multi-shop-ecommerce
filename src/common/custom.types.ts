import { IAuthUser } from "./enums";

declare global {
    namespace Express {
        interface Request {
            user?:IAuthUser
        }
    }
}