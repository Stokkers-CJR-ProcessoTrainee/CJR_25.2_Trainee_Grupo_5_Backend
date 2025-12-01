import { Request } from "express";
import { User } from "src/user/entity/user.entity";

export interface AuthRequest extends Request {
    user: User;
}