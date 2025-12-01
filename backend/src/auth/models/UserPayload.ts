export interface UserPayload {
    sub: number;
    email: string;
    name: string;
    username: string;
    iat?: number;
    exp?: number;
}