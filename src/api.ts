
const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Define explicit types for arguments
export const api = {
    login: async (email: any, password: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }
        return response.json();
    },

    register: async (email: any, password: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }
        return response.json();
    },

    getTransactions: async (month?: number, year?: number) => {
        let url = `${API_URL}/transactions`;
        if (month && year) {
            url += `?month=${month}&year=${year}`;
        }
        const response = await fetch(url, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },

    addTransaction: async (transaction: any) => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(transaction)
        });
        if (!response.ok) throw new Error('Failed to add transaction');
        return response.json();
    },

    deleteTransaction: async (id: any) => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete transaction');
        return response.json();
    },

    updateProfile: async (avatar: string | File) => {
        let options: RequestInit = {};

        if (avatar instanceof File) {
            const formData = new FormData();
            formData.append('avatar', avatar);
            const headers = getHeaders();
            delete (headers as any)['Content-Type']; // Let browser set Content-Type for FormData

            options = {
                method: 'PUT',
                headers: headers,
                body: formData
            };
        } else {
            options = {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ avatarUrl: avatar })
            };
        }

        const response = await fetch(`${API_URL}/users/profile`, options);
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    }
};
