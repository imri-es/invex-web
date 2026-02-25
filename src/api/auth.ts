import api from './axios';

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthSocialDto {
    provider: 'google' | 'facebook' | 'apple';
    token: string;
}

export interface AuthResponseDto {
    token: string;
    email: string;
    fullName: string;
    accessRole: string;
}

export const authService = {
    login: async (data: LoginDto) => {
        const response = await api.post<AuthResponseDto>('/auth/login', data);
        return response.data;
    },
    register: async (data: RegisterDto) => {
        const response = await api.post<AuthResponseDto>('/auth/register', data);
        return response.data;
    },
    authSocial: async (data: AuthSocialDto) => {
        const response = await api.post<AuthResponseDto>('/auth/auth-social', data);
        return response.data;
    },
};
