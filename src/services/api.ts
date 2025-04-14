
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

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

export const createProduct = async (product: any) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export const createTransfer = async (transfer: any) => {
  try {
    const response = await fetch(`${API_URL}/transfers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export const createAlert = async (alert: any) => {
  try {
    const response = await fetch(`${API_URL}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
