export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export type AuthPayload =
    | { mode: 'login'; data: LoginPayload}
    | { mode: 'register'; data: RegisterPayload};