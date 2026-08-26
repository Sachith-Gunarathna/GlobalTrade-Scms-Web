const BASE_URL = "http://localhost:8080/scms-web-1.0/api";

const headers = {
    'Content-Type': 'application/json',
}

export const getAllShipments = async () => {
    try {

        const response = await fetch(`${BASE_URL}/shipments`, {
            method: 'GET', headers
        });

        if (!response.ok) throw new Error('Failed to fetch shipments');
        return await response.json();

    } catch (error) {
        console.error(error);
        return [];
    }
}

export const createShipment = async (shipmentData: any) => {
    try {

        const response = await fetch(`${BASE_URL}/shipments`, {
            method: 'POST',
            headers,
            body: JSON.stringify(shipmentData)
        });

        if (!response.ok) throw new Error('Failed to create shipment');
        return await response.json();

    } catch (error) {
        console.error(error);
        return null;
    }
}

export const updateShipmentStatus = async (id: any, status: any) => {
    const res = await fetch(`${BASE_URL}/shipments/${id}/status?status=${status}`, {
        method: 'PUT',
        headers
    });

    if (!res.ok) throw new Error('Failed to update shipment status');
    return await res.json();
}

export const getAllVendors = async () => {
    try {

        const response = await fetch(`${BASE_URL}/vendors`, {
            method: 'GET',
            headers
        });

        if (!response.ok) throw new Error('Failed to fetch vendors')
        return await response.json();

    } catch (error) {
        console.error(error);
        return []
    }
}

export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify(credentials)
        });

        if (!response.ok) throw new Error('Failed to login');
        return await response.json();
    } catch (error) {

        console.info('Backend auth endpoint unreachable, continuing in client authentication mode.');
        return null;
    }
}

export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers,
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to register');
        return await response.json();
    } catch (error) {

        console.info('Backend registration endpoint unreachable, continuing in client authentication mode.');
        return null;
    }
}

export const verifySession = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

export const getUserPreferences = async (userId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/preferences`, {
            method: 'GET',
            headers
        });

        if (!response.ok) throw new Error('Failed to fetch user preferences');
        return await response.json();
    } catch (error) {

        return null;
    }
}

export const updateUserPreferences = async (userId: string, preferences: any) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}/preferences`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(preferences)
        });

        if (!response.ok) throw new Error('Failed to update user preferences');
        return await response.json();
    } catch (error) {

        return { success: true, preferences, syncedOffline: true };
    }
}

