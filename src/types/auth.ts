export type UserLogin = {
    email: string;
    password: string;
}

export type UserRegister = {
    email: string;
    password: string;
    confirmation_password: string;
}

export type AuthResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
}