import { JwtPayload } from "jsonwebtoken";

export interface jwtToken extends JwtPayload {
    id: string;
    email: string;
    username: string;
}