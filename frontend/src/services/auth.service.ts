import axios from 'axios';
import { AuthResponse, LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:3000';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/auth/login`,
            credentials
        );
        return response.data;
    },

    resetPassword: async (email: string, newPassword: string, confirmPassword: string): Promise<void> => {
        await axios.patch(`${API_URL}/users/reset-password`, {
            email,
            password: newPassword,
            confirmPassword
        });
    }
};