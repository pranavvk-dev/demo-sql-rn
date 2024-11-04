import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useData } from './DataContext';

const PerformanceMetricsView = ({ metrics }) => {
  if (!metrics?.length) return null;

  return (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Performance Metrics</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricOperation}>{metric.operation}</Text>
            <Text>Duration: {metric.duration}ms</Text>
            <Text>Size: {metric.dataSize}MB</Text>
            <Text>Rate: {metric.rate}KB/ms</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const HomeScreen = () => {
  const { products, loading, error, loadProducts, performanceMetrics } = useData();

  useEffect(() => {
    loadProducts(false);
  }, [loadProducts]);

  const handleRefresh = () => {
    loadProducts(true);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
      {item.category && (
        <Text style={styles.category}>Category: {item.category}</Text>
      )}
    </View>
  );

  if (loading && !products.length) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error && !products.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => loadProducts(true)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PerformanceMetricsView metrics={performanceMetrics} />
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id?.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricCard: {
    padding: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 150,
  },
  metricOperation: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default HomeScreen;