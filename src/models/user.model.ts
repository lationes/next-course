export interface UserModel {
    id: number;
    email: string;
    avatar: string;
    banned: boolean;
    banReason: string;
}