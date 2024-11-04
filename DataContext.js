
// src/context/DataContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { getProducts, saveProducts } from './database';
import { fetchProducts } from './api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API
      console.log('Fetching from API...');
      const apiProducts = await fetchProducts();
      
      if (apiProducts && Array.isArray(apiProducts)) {
        console.log('API data received:', apiProducts.length, 'products');
        setProducts(apiProducts);
        
        // Save to SQLite
        try {
          await saveProducts(apiProducts);
          console.log('Products saved to database');
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          Alert.alert('Warning', 'Failed to save data locally');
        }
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error('API Error:', apiError);
      Alert.alert('Network Error', 'Loading data from local storage...');
      
      // If API fails, load from SQLite
      try {
        const localProducts = await getProducts();
        if (localProducts && localProducts.length > 0) {
          console.log('Loaded', localProducts.length, 'products from database');
          setProducts(localProducts);
        } else {
          setError('No local data available');
        }
      } catch (dbError) {
        console.error('Database Error:', dbError);
        setError('Failed to load data from both API and local storage');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    error,
    loadProducts,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};