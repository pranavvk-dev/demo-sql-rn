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

// export const getDataSize = async () => {
//   try {
//     const [result] = await database.executeSql('SELECT * FROM products;');
//     const jsonData = JSON.stringify(result.rows.raw());
//     return Buffer.byteLength(jsonData, 'utf8');
//   } catch (error) {
//     console.error('Error calculating data size:', error);
//     throw error;
//   }
// };
