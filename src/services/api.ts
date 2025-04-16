
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

// Auth API functions
export const registerUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Products API
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (product: any) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Transfers API
export const fetchTransfers = async () => {
  try {
    const response = await fetch(`${API_URL}/transfers`);
    if (!response.ok) {
      throw new Error('Failed to fetch transfers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transfers:', error);
    throw error;
  }
};

export const createTransfer = async (transfer: any) => {
  try {
    const response = await fetch(`${API_URL}/transfers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(transfer),
    });
    if (!response.ok) {
      throw new Error('Failed to create transfer');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating transfer:', error);
    throw error;
  }
};

// Alerts API
export const fetchAlerts = async () => {
  try {
    const response = await fetch(`${API_URL}/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const createAlert = async (alert: any) => {
  try {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(alert),
    });
    if (!response.ok) {
      throw new Error('Failed to create alert');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

// Locations API
export const fetchLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/locations`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const createLocation = async (location: any) => {
  try {
    const response = await fetch(`${API_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(location),
    });
    if (!response.ok) {
      throw new Error('Failed to create location');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

// Suppliers API
export const fetchSuppliers = async () => {
  try {
    const response = await fetch(`${API_URL}/suppliers`);
    if (!response.ok) {
      throw new Error('Failed to fetch suppliers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const createSupplier = async (supplier: any) => {
  try {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(supplier),
    });
    if (!response.ok) {
      throw new Error('Failed to create supplier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

// Purchase Orders API
export const fetchPurchaseOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/purchase-orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchase orders');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

export const createPurchaseOrder = async (order: any) => {
  try {
    const response = await fetch(`${API_URL}/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error('Failed to create purchase order');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
};

// Users API
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
