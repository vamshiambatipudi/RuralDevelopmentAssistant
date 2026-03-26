const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = {
  async get<T>(path: string, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  async post<T>(path: string, body: unknown, token?: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
};
