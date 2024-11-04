import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DataProvider } from './DataContext';
import HomeScreen from './HomeScreen';
import { initDatabase } from './database';
import { Alert } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
        Alert.alert('Error', 'Failed to initialize database');
      }
    };

    setupDatabase();
  }, []);

  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Products" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
};

export default App;
