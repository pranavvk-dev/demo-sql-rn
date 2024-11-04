
// src/api/api.js
const API_URL = 'https://fakestoreapi.com/products333'; // Using a real test API

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return duplicateData(data,700);
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};
const duplicateData = (data, times = 500) => {
  // Create array of specified length and fill with numbers 0 to times-1
  return Array(times)
    .fill()
    .flatMap((_, index) =>
      data.map(item => ({
        ...item,
        id: `${item.id}_${index}`,
        title: `${item.title} (${index + 1})`
      }))
    );
};
// src/database/database.js
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
SQLite.DEBUG(true);

let database = null;

export const initDatabase = async () => {
  try {
    database = await SQLite.openDatabase({
      name: 'ProductsDB',
      location: 'default',
    });

    await database.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        category TEXT
      );`
    );

    console.log('Database initialized');
    return database;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const saveProducts = async (products) => {
  if (!database) {
    throw new Error('Database not initialized');
  }

  try {
    await database.transaction(async (tx) => {
      // Clear existing data
      await tx.executeSql('DELETE FROM products;');

      // Insert new data
      for (const product of products) {
        await tx.executeSql(
          `INSERT INTO products (title, description, price, image, category) 
           VALUES (?, ?, ?, ?, ?);`,
          [
            product.title || '',
            product.description || '',
            product.price || 0,
            product.image || '',
            product.category || '',
          ]
        );
      }
    });

    console.log('Products saved successfully');
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
};

export const getProducts = async () => {
  if (!database) {
    throw new Error('Database not initialized');
  }

  try {
    const [results] = await database.executeSql('SELECT * FROM products;');
    const products = [];
    
    for (let i = 0; i < results.rows.length; i++) {
      products.push(results.rows.item(i));
    }
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};