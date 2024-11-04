
// src/api/api.js
const API_URL = 'https://fakestoreapi.com/products'; // Using a real test API

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const duplicatedData = duplicateData(data, 3000);

    // Convert to JSON string and calculate byte size
    const dataSizeBytes = new Blob([JSON.stringify(duplicatedData)]).size;
    console.log(`Size of the data: ${dataSizeBytes} bytes`);
    const dataSizeKB = (dataSizeBytes / 1024).toFixed(2);
    const dataSizeMB = (dataSizeBytes / (1024 * 1024)).toFixed(2);
    console.log(`Size of the data: ${dataSizeKB} KB (${dataSizeMB} MB)`);
    
    return duplicatedData;
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



