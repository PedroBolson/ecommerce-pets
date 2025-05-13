export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ResetPasswordData {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}