const BASE_URL = "http://localhost:8080/Global-Trade-Scms/v1";

const headers = {
    'Content-Type': 'application/json',
};

export const loginUser = async (credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
}) => {

    try {

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                email: credentials.email.trim(),
                password: credentials.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Invalid email or password.'
            };
        }

        return data;

    } catch (error) {

        console.error('Login request failed:', error);

        return {
            success: false,
            error: 'Unable to connect to the backend server.'
        };
    }
};

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
};

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
};

export const getAllInvetory = async () => {
    const res = await fetch(`${BASE_URL}/inventory`, {
        method: 'GET',
        headers
    });

    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
};

export const getAllCustomsDocs = async () => {
    const res = await fetch(`${BASE_URL}/customs`, {
        method: 'GET',
        headers
    });

    if (!res.ok) throw new Error('Failed to fetch customs docs');
    return await res.json();
};

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
};

export const updateShipmentStatus = async (id: any, status: any) => {
    const res = await fetch(`${BASE_URL}/shipments/${id}/status?status=${status}`, {
        method: 'PUT',
        headers
    });

    if (!res.ok) throw new Error('Failed to update shipment status');
    return await res.json();
};

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
};

export const createVendor = async (data: any) => {
    const res = await fetch(`${BASE_URL}/vendors`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error('Failed to create vendor')
    return await res.json();

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
};

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
};

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
};

export const userLogOut = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to logout');
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const updateProfileToBackend = async (profileData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(profileData)
        });
        if (!response.ok) throw new Error('Failed to update profile in DB');
        return await response.json();
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export const getDashboardData = async () => {
    try {

        const response = await fetch(`${BASE_URL}/dashboard`, {
            method: 'GET',
            headers,
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch dashboard: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Dashboard API error:', error);
        return null;
    }
}