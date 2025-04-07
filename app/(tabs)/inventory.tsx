import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';

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
    name: 'Premium Coffee Beans',
    category: 'Beverages',
    price: 24.99,
    stock: 45,
    lowStockThreshold: 20,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Organic Tea Leaves',
    category: 'Beverages',
    price: 18.99,
    stock: 15,
    lowStockThreshold: 20,
    lastUpdated: '1 day ago',
  },
  {
    id: '3',
    name: 'Artisan Bread',
    category: 'Bakery',
    price: 5.99,
    stock: 30,
    lowStockThreshold: 15,
    lastUpdated: '3 hours ago',
  },
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          ${item.price.toFixed(2)}
        </Text>
      </View>

      <View style={styles.productFooter}>
        <Text style={[styles.lastUpdated, { color: Colors[colorScheme].tabIconDefault }]}>
          Updated {item.lastUpdated}
        </Text>
        <TouchableOpacity style={styles.editButton}>
          <MaterialIcons name="edit" size={20} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Inventory
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
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
  editButton: {
    padding: 4,
  },
}); 