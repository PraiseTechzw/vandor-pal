import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { LinearGradient } from 'expo-linear-gradient';
import ProductForm from '@/components/ProductForm';
import StockUpdateForm from '@/components/StockUpdateForm';
import BulkActions from '@/components/BulkActions';
import InventoryReports from '@/components/InventoryReports';
import InventoryForm from '@/components/InventoryForm';

type Product = {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
};

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomatoes',
    category: 'Vegetables',
    buyingPrice: 100,
    sellingPrice: 150,
    stock: 50,
    lowStockThreshold: 10,
  },
  {
    id: '2',
    name: 'Onions',
    category: 'Vegetables',
    buyingPrice: 150,
    sellingPrice: 200,
    stock: 30,
    lowStockThreshold: 5,
  },
  {
    id: '3',
    name: 'Potatoes',
    category: 'Vegetables',
    buyingPrice: 180,
    sellingPrice: 220,
    stock: 40,
    lowStockThreshold: 8,
  },
  {
    id: '4',
    name: 'Cabbage',
    category: 'Vegetables',
    buyingPrice: 120,
    sellingPrice: 160,
    stock: 25,
    lowStockThreshold: 5,
  },
  {
    id: '5',
    name: 'Carrots',
    category: 'Vegetables',
    buyingPrice: 160,
    sellingPrice: 200,
    stock: 35,
    lowStockThreshold: 7,
  },
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency, convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProductFormVisible, setIsProductFormVisible] = useState(false);
  const [isStockUpdateFormVisible, setIsStockUpdateFormVisible] = useState(false);
  const [isBulkActionsVisible, setIsBulkActionsVisible] = useState(false);
  const [isReportsVisible, setIsReportsVisible] = useState(false);
  const [isInventoryFormVisible, setIsInventoryFormVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [fadeAnim] = useState(new Animated.Value(0));

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const lowStockProducts = useMemo(() => {
    return products.filter(product => product.stock <= product.lowStockThreshold);
  }, [products]);

  const handleAddProduct = (data: {
    name: string;
    category: string;
    buyingPrice: number;
    sellingPrice: number;
    stock: number;
    lowStockThreshold: number;
  }) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...data,
    };
    setProducts([...products, newProduct]);
    setIsInventoryFormVisible(false);
    Alert.alert('Success', 'Product added successfully');
  };

  const handleEditProduct = (data: {
    name: string;
    category: string;
    buyingPrice: number;
    sellingPrice: number;
    stock: number;
    lowStockThreshold: number;
  }) => {
    if (!selectedProduct) return;
    setProducts(products.map(p => 
      p.id === selectedProduct.id ? { ...p, ...data } : p
    ));
    setIsInventoryFormVisible(false);
    setSelectedProduct(null);
    Alert.alert('Success', 'Product updated successfully');
  };

  const handleUpdateStock = (update: { type: 'add' | 'remove'; amount: number }) => {
    if (!selectedProduct) return;
    setProducts(products.map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          stock: update.type === 'add' 
            ? p.stock + update.amount 
            : p.stock - update.amount,
        };
      }
      return p;
    }));
    setIsStockUpdateFormVisible(false);
    setSelectedProduct(null);
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('Error', 'Please select products to delete');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedProducts.length} products?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
          },
        },
      ]
    );
  };

  const handleBulkUpdate = (action: 'buyingPrice' | 'sellingPrice' | 'stock', value: any) => {
    const updatedProducts = products.map(product => {
      if (selectedProducts.includes(product.id)) {
        switch (action) {
          case 'buyingPrice':
            return { ...product, buyingPrice: value };
          case 'sellingPrice':
            return { ...product, sellingPrice: value };
          case 'stock':
            return { ...product, stock: value };
          default:
            return product;
        }
      }
      return product;
    });

    setProducts(updatedProducts);
    setSelectedProducts([]);
    Alert.alert('Success', 'Bulk update completed successfully');
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = selectedProducts.includes(item.id);
    const isLowStock = item.stock <= item.lowStockThreshold;
    const expectedRevenue = item.stock * item.sellingPrice;
    const potentialProfit = item.stock * (item.sellingPrice - item.buyingPrice);

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          {
            backgroundColor: Colors[colorScheme].card,
            borderColor: isSelected ? Colors[colorScheme].tint : 'transparent',
          },
        ]}
        onLongPress={() => {
          setSelectedProduct(item);
          setIsStockUpdateFormVisible(true);
        }}
        onPress={() => toggleProductSelection(item.id)}
      >
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: Colors[colorScheme].text }]}>
            {item.name}
          </Text>
          <View style={styles.productActions}>
            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(item);
                setIsInventoryFormVisible(true);
              }}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedProduct(item);
                setIsStockUpdateFormVisible(true);
              }}
            >
              <MaterialIcons
                name="inventory"
                size={20}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.productDetails}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Category
            </Text>
            <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
              {item.category}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Buy Price
            </Text>
            <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
              {convertAmount(item.buyingPrice)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Sell Price
            </Text>
            <Text style={[styles.detailValue, { color: Colors[colorScheme].text }]}>
              {convertAmount(item.sellingPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.revenueInfo}>
          <View style={styles.revenueItem}>
            <Text style={[styles.revenueLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Expected Revenue
            </Text>
            <Text style={[styles.revenueValue, { color: Colors[colorScheme].text }]}>
              {convertAmount(expectedRevenue)}
            </Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={[styles.revenueLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Potential Profit
            </Text>
            <Text style={[styles.revenueValue, { color: '#4CAF50' }]}>
              {convertAmount(potentialProfit)}
            </Text>
          </View>
        </View>

        <View style={styles.stockInfo}>
          <Text
            style={[
              styles.stockText,
              {
                color: isLowStock
                  ? '#FF5252'
                  : Colors[colorScheme].text,
              },
            ]}
          >
            Stock: {item.stock}
          </Text>
          {isLowStock && (
            <Text style={[styles.lowStockWarning, { color: '#FF5252' }]}>
              Low Stock!
            </Text>
          )}
        </View>

        {isSelected && (
          <View style={styles.selectionIndicator}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#2196F3', '#1976D2', '#0D47A1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => setIsReportsVisible(true)}
            >
              <MaterialIcons name="assessment" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => {
                setSelectedProduct(null);
                setIsInventoryFormVisible(true);
              }}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.selectedCategoryText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {selectedProducts.length > 0 && (
        <View style={styles.bulkActionsBar}>
          <Text style={styles.bulkActionsText}>
            {selectedProducts.length} selected
          </Text>
          <TouchableOpacity
            style={styles.bulkActionButton}
            onPress={() => setIsBulkActionsVisible(true)}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.bulkActionText}>Bulk Actions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bulkActionButton}
            onPress={handleBulkDelete}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.bulkActionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {lowStockProducts.length > 0 && (
        <View style={[styles.lowStockAlert, { backgroundColor: '#FFF3F3' }]}>
          <MaterialIcons name="warning" size={20} color="#FF5252" />
          <Text style={[styles.lowStockAlertText, { color: '#FF5252' }]}>
            {lowStockProducts.length} products are low on stock
          </Text>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
      />

      <InventoryForm
        visible={isInventoryFormVisible}
        onClose={() => {
          setIsInventoryFormVisible(false);
          setSelectedProduct(null);
        }}
        onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
        initialData={selectedProduct ? {
          name: selectedProduct.name,
          category: selectedProduct.category,
          buyingPrice: selectedProduct.buyingPrice,
          sellingPrice: selectedProduct.sellingPrice,
          stock: selectedProduct.stock,
          lowStockThreshold: selectedProduct.lowStockThreshold,
        } : undefined}
      />

      <StockUpdateForm
        visible={isStockUpdateFormVisible}
        onClose={() => {
          setIsStockUpdateFormVisible(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleUpdateStock}
        productName={selectedProduct?.name || ''}
        currentStock={selectedProduct?.stock || 0}
      />

      <BulkActions
        visible={isBulkActionsVisible}
        onClose={() => setIsBulkActionsVisible(false)}
        selectedProducts={selectedProducts}
        onBulkUpdate={handleBulkUpdate}
      />
      <InventoryReports
        products={products as any}
        onClose={() => setIsReportsVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 8,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCategory: {
    backgroundColor: '#fff',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#1976D2',
  },
  bulkActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1976D2',
  },
  bulkActionsText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 'auto',
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  bulkActionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  productCard: {
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  productActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
  },
  lowStockWarning: {
    fontSize: 12,
    fontWeight: '500',
  },
  lowStockAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 8,
  },
  lowStockAlertText: {
    fontSize: 14,
    fontWeight: '500',
  },
  revenueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  revenueItem: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 