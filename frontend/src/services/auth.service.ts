import axios from 'axios';
import { AuthResponse, LoginCredentials } from '../types/auth';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.baseUrl;

const decodeToken = (token: string) => {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

interface CurrentUser {
    id: string;
    email: string;
    role: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/auth/login`,
            credentials
        );
        return response.data;
    },

    resetPassword: async (
        email: string,
        confirmEmail: string,
        newPassword: string,
        confirmPassword: string
    ): Promise<void> => {
        await axios.patch(`${API_URL}/users/reset-password`, {
            email,
            confirmEmail,
            password: newPassword,
            confirmPassword
        });
    },

    updatePassword: async (
        userId: string,
        passwordData: {
            currentPassword: string;
            password: string;
            confirmPassword: string;
        }
    ): Promise<void> => {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Not authenticated');
        }

        await axios.patch(
            `${API_URL}/users/${userId}`,
            passwordData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    },

    getCurrentUser: async (): Promise<CurrentUser | null> => {
        const token = localStorage.getItem('token');

        if (!token) {
            return null;
        }

        try {
            const response = await axios.get<CurrentUser>(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    getUserFromToken: (): { id: string; email: string; role: string } | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decodedToken = decodeToken(token);
            if (!decodedToken) return null;

            return {
                id: decodedToken.sub,
                email: decodedToken.email,
                role: decodedToken.role
            };
        } catch (error) {
            console.error("Error getting user data from token:", error);
            return null;
        }
    }
};