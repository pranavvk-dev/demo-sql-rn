import React, { createContext, useState, useContext, useCallback } from 'react';
import { Alert } from 'react-native';
import { getProducts, saveProducts} from '../database/database';
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
      // Check if database has data to avoid unnecessary API call
      const startReadTime = performance.now();
      const localProducts = await getProducts();
      const endReadTime = performance.now();
      
      console.log(`Data read time from database: ${(endReadTime - startReadTime).toFixed(2)} ms`);
      
      if (localProducts && localProducts.length > 0) {
        console.log('Loaded from local database:', localProducts.length, 'products');
        setProducts(localProducts);
      } else {
        // No data in the database, fetch from API
        console.log('Fetching from API...');
        const apiProducts = await fetchProducts();

        if (apiProducts && Array.isArray(apiProducts)) {
          console.log('API data received:', apiProducts.length, 'products');
          setProducts(apiProducts);

          // Save to SQLite and measure performance
          const startWriteTime = performance.now();
          await saveProducts(apiProducts);
          const endWriteTime = performance.now();
          
          console.log(`Data write time to database: ${(endWriteTime - startWriteTime).toFixed(2)} ms`);
          
          // const dataSize = await getDataSize();
          // console.log(`Total data size in database: ${dataSize} bytes`);
        } else {
          throw new Error('Invalid API response format');
        }
      }
    } catch (error) {
      console.error('Data load error:', error);
      setError('Failed to load data');
      Alert.alert('Error', 'Failed to load data');
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

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
