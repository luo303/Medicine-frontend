export function getToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return localStorage.getItem('auth_token');
}

export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
}
