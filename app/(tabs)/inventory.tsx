import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useCurrency } from '@/contexts/CurrencyContext';

const { width } = Dimensions.get('window');

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: string;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Vegetables',
    price: 100,
    stock: 45,
    lowStockThreshold: 20,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Onions',
    category: 'Vegetables',
    price: 80,
    stock: 15,
    lowStockThreshold: 20,
    lastUpdated: '1 day ago',
  },
  {
    id: '3',
    name: 'Potatoes',
    category: 'Vegetables',
    price: 120,
    stock: 30,
    lowStockThreshold: 15,
    lastUpdated: '3 hours ago',
  },
  {
    id: '4',
    name: 'Cabbage',
    category: 'Vegetables',
    price: 150,
    stock: 25,
    lowStockThreshold: 10,
    lastUpdated: '5 hours ago',
  },
  {
    id: '5',
    name: 'Carrots',
    category: 'Vegetables',
    price: 90,
    stock: 40,
    lowStockThreshold: 15,
    lastUpdated: '1 hour ago',
  },
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'Add a new product to inventory');
  };

  const handleEditProduct = (product: Product) => {
    Alert.alert('Edit Product', `Edit ${product.name}`);
  };

  const handleUpdateStock = (product: Product) => {
    Alert.alert('Update Stock', `Update stock for ${product.name}`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: Colors[colorScheme].card }]}
      activeOpacity={0.8}
    >
      <View style={styles.productHeader}>
        <Text style={[styles.productName, { color: Colors[colorScheme].text }]}>
          {item.name}
        </Text>
        <View style={[
          styles.stockIndicator,
          { backgroundColor: item.stock <= item.lowStockThreshold ? '#FF5722' : '#4CAF50' }
        ]}>
          <Text style={styles.stockText}>{item.stock}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <Text style={[styles.productCategory, { color: Colors[colorScheme].tabIconDefault }]}>
          {item.category}
        </Text>
        <Text style={[styles.productPrice, { color: Colors[colorScheme].text }]}>
          {convertAmount(item.price)}
        </Text>
      </View>

      <View style={styles.productFooter}>
        <Text style={[styles.lastUpdated, { color: Colors[colorScheme].tabIconDefault }]}>
          Updated {item.lastUpdated}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUpdateStock(item)}
          >
            <MaterialIcons name="inventory" size={20} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditProduct(item)}
          >
            <MaterialIcons name="edit" size={20} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={[
          '#2196F3',
          '#1976D2',
          '#0D47A1'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: '#fff' }]}>Inventory</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddProduct}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: Colors[colorScheme].card }]}>
          <MaterialIcons name="search" size={20} color={Colors[colorScheme].tabIconDefault} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme].text }]}
            placeholder="Search products..."
            placeholderTextColor={Colors[colorScheme].tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            { backgroundColor: !selectedCategory ? Colors[colorScheme].tint : Colors[colorScheme].card }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[
            styles.categoryText,
            { color: !selectedCategory ? '#fff' : Colors[colorScheme].text }
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: selectedCategory === category ? Colors[colorScheme].tint : Colors[colorScheme].card }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === category ? '#fff' : Colors[colorScheme].text }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    marginTop: -20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  stockIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productCategory: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  lastUpdated: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
}); 