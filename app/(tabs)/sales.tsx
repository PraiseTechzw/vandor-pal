"use client"

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
import { format } from 'date-fns';

// Types
type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  total: number;
  profit: number;
  date: Date;
};

type Sale = {
  id: string;
  items: SaleItem[];
  total: number;
  profit: number;
  date: Date;
};

// Mock data
const mockSales: Sale[] = [
  {
    id: '1',
    items: [
      {
        id: '1-1',
        productId: '1',
        productName: 'Tomatoes',
        quantity: 5,
        buyingPrice: 100,
        sellingPrice: 150,
        total: 750,
        profit: 250,
        date: new Date(2023, 5, 15, 10, 30),
      },
      {
        id: '1-2',
        productId: '2',
        productName: 'Onions',
        quantity: 3,
        buyingPrice: 150,
        sellingPrice: 200,
        total: 600,
        profit: 150,
        date: new Date(2023, 5, 15, 10, 30),
      },
    ],
    total: 1350,
    profit: 400,
    date: new Date(2023, 5, 15, 10, 30),
  },
  {
    id: '2',
    items: [
      {
        id: '2-1',
        productId: '3',
        productName: 'Potatoes',
        quantity: 2,
        buyingPrice: 220,
        sellingPrice: 220,
        total: 440,
        profit: 0,
        date: new Date(2023, 5, 15, 14, 45),
      },
    ],
    total: 440,
    profit: 0,
    date: new Date(2023, 5, 15, 14, 45),
  },
  {
    id: '3',
    items: [
      {
        id: '3-1',
        productId: '1',
        productName: 'Tomatoes',
        quantity: 3,
        buyingPrice: 150,
        sellingPrice: 150,
        total: 450,
        profit: 0,
        date: new Date(2023, 5, 16, 9, 15),
      },
      {
        id: '3-2',
        productId: '4',
        productName: 'Cabbage',
        quantity: 2,
        buyingPrice: 160,
        sellingPrice: 160,
        total: 320,
        profit: 0,
        date: new Date(2023, 5, 16, 9, 15),
      },
    ],
    total: 770,
    profit: 0,
    date: new Date(2023, 5, 16, 9, 15),
  },
];

export default function SalesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency, convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isNewSaleVisible, setIsNewSaleVisible] = useState(false);
  const [newSaleItems, setNewSaleItems] = useState<SaleItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    buyingPrice: number;
    sellingPrice: number;
  } | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [quickQuantities] = useState(['1', '2', '3', '5', '10']);

  // Animation
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter sales by date and search query
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesDate = !selectedDate || 
        (sale.date.getDate() === selectedDate.getDate() &&
         sale.date.getMonth() === selectedDate.getMonth() &&
         sale.date.getFullYear() === selectedDate.getFullYear());
      
      const matchesSearch = !searchQuery || 
        sale.items.some(item => 
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      return matchesDate && matchesSearch;
    });
  }, [sales, selectedDate, searchQuery]);

  // Calculate total sales
  const totalSales = useMemo(() => {
    return filteredSales.reduce((total, sale) => total + sale.total, 0);
  }, [filteredSales]);

  // Calculate total profit
  const totalProfit = useMemo(() => {
    return filteredSales.reduce((total, sale) => total + sale.profit, 0);
  }, [filteredSales]);

  // Calculate total items sold
  const totalItemsSold = useMemo(() => {
    return filteredSales.reduce((total, sale) => {
      return total + sale.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
    }, 0);
  }, [filteredSales]);

  // Get unique dates from sales
  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    sales.forEach(sale => {
      const dateStr = format(sale.date, 'yyyy-MM-dd');
      dates.add(dateStr);
    });
    return Array.from(dates).sort().reverse();
  }, [sales]);

  // Handle adding a new sale item
  const handleAddSaleItem = () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const total = selectedProduct.sellingPrice * quantityNum;
    const profit = (selectedProduct.sellingPrice - selectedProduct.buyingPrice) * quantityNum;

    const newItem: SaleItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantityNum,
      buyingPrice: selectedProduct.buyingPrice,
      sellingPrice: selectedProduct.sellingPrice,
      total,
      profit,
      date: new Date(),
    };

    setNewSaleItems([...newSaleItems, newItem]);
    setSelectedProduct(null);
    setQuantity('1');
  };

  // Handle removing a sale item
  const handleRemoveSaleItem = (itemId: string) => {
    setNewSaleItems(newSaleItems.filter(item => item.id !== itemId));
  };

  // Handle completing a sale
  const handleCompleteSale = () => {
    if (newSaleItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to the sale');
      return;
    }

    const total = newSaleItems.reduce((sum, item) => sum + item.total, 0);
    const profit = newSaleItems.reduce((sum, item) => sum + item.profit, 0);
    const newSale: Sale = {
      id: Date.now().toString(),
      items: newSaleItems,
      total,
      profit,
      date: new Date(),
    };

    setSales([newSale, ...sales]);
    setNewSaleItems([]);
    setIsNewSaleVisible(false);
    Alert.alert('Success', `Sale completed successfully!\nProfit: ${convertAmount(profit)}`);
  };

  // Render a sale item
  const renderSaleItem = ({ item }: { item: SaleItem }) => {
    return (
      <View style={[styles.saleItem, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.saleItemHeader}>
          <Text style={[styles.productName, { color: Colors[colorScheme].text }]}>
            {item.productName}
          </Text>
          <Text style={[styles.saleTime, { color: Colors[colorScheme].tabIconDefault }]}>
            {format(item.date, 'HH:mm')}
          </Text>
        </View>
        <View style={styles.saleItemDetails}>
          <Text style={[styles.saleDetail, { color: Colors[colorScheme].text }]}>
            {item.quantity} x {convertAmount(item.sellingPrice)}
          </Text>
          <View style={styles.saleItemTotals}>
            <Text style={[styles.saleTotal, { color: Colors[colorScheme].text }]}>
              {convertAmount(item.total)}
            </Text>
            <Text style={[styles.saleProfit, { color: '#4CAF50' }]}>
              Profit: {convertAmount(item.profit)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Render a sale
  const renderSale = ({ item }: { item: Sale }) => {
    return (
      <View style={[styles.saleCard, { backgroundColor: Colors[colorScheme].card }]}>
        <View style={styles.saleHeader}>
          <Text style={[styles.saleDate, { color: Colors[colorScheme].text }]}>
            {format(item.date, 'dd MMM yyyy, HH:mm')}
          </Text>
          <View style={styles.saleTotals}>
            <Text style={[styles.saleTotal, { color: Colors[colorScheme].tint }]}>
              {convertAmount(item.total)}
            </Text>
            <Text style={[styles.saleProfit, { color: '#4CAF50' }]}>
              Profit: {convertAmount(item.profit)}
            </Text>
          </View>
        </View>
        <FlatList
          data={item.items}
          keyExtractor={item => item.id}
          renderItem={renderSaleItem}
          scrollEnabled={false}
        />
      </View>
    );
  };

  // Render date filter
  const renderDateFilter = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateFilter}
      >
        <TouchableOpacity
          style={[
            styles.dateButton,
            !selectedDate && styles.selectedDateButton,
            { backgroundColor: !selectedDate ? Colors[colorScheme].tint : Colors[colorScheme].card },
          ]}
          onPress={() => setSelectedDate(null)}
        >
          <Text
            style={[
              styles.dateButtonText,
              !selectedDate && styles.selectedDateButtonText,
              { color: !selectedDate ? '#fff' : Colors[colorScheme].text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {uniqueDates.map(dateStr => {
          const date = new Date(dateStr);
          const isSelected = selectedDate && 
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
          
          return (
            <TouchableOpacity
              key={dateStr}
              style={[
                styles.dateButton,
                isSelected && styles.selectedDateButton,
                { backgroundColor: isSelected ? Colors[colorScheme].tint : Colors[colorScheme].card },
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateButtonText,
                  isSelected && styles.selectedDateButtonText,
                  { color: isSelected ? '#fff' : Colors[colorScheme].text },
                ]}
              >
                {format(date, 'dd MMM')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  // Render new sale form
  const renderNewSaleForm = () => {
    if (!isNewSaleVisible) return null;

    return (
      <View style={[styles.newSaleForm, { backgroundColor: Colors[colorScheme].background }]}>
        <View style={styles.newSaleHeader}>
          <Text style={[styles.newSaleTitle, { color: Colors[colorScheme].text }]}>
            New Sale
          </Text>
          <TouchableOpacity onPress={() => setIsNewSaleVisible(false)}>
            <MaterialIcons name="close" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        </View>

        <View style={styles.newSaleContent}>
          <View style={styles.newSaleItems}>
            {newSaleItems.map(item => (
              <View key={item.id} style={[styles.newSaleItem, { backgroundColor: Colors[colorScheme].card }]}>
                <View style={styles.newSaleItemInfo}>
                  <Text style={[styles.newSaleItemName, { color: Colors[colorScheme].text }]}>
                    {item.productName}
                  </Text>
                  <Text style={[styles.newSaleItemQuantity, { color: Colors[colorScheme].tabIconDefault }]}>
                    {item.quantity} x {convertAmount(item.sellingPrice)}
                  </Text>
                </View>
                <View style={styles.newSaleItemActions}>
                  <View style={styles.newSaleItemTotals}>
                    <Text style={[styles.newSaleItemTotal, { color: Colors[colorScheme].text }]}>
                      {convertAmount(item.total)}
                    </Text>
                    <Text style={[styles.newSaleItemProfit, { color: '#4CAF50' }]}>
                      Profit: {convertAmount(item.profit)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveSaleItem(item.id)}>
                    <MaterialIcons name="delete" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.addItemForm}>
            <View style={styles.addItemInputs}>
              <View style={styles.addItemInput}>
                <Text style={[styles.addItemLabel, { color: Colors[colorScheme].text }]}>
                  Product
                </Text>
                <TouchableOpacity
                  style={[styles.productSelector, { backgroundColor: Colors[colorScheme].card }]}
                  onPress={() => {
                    // In a real app, this would open a product selector
                    // For now, we'll just simulate selecting a product
                    setSelectedProduct({
                      id: '1',
                      name: 'Tomatoes',
                      buyingPrice: 100,
                      sellingPrice: 150,
                    });
                  }}
                >
                  <Text style={{ color: Colors[colorScheme].text }}>
                    {selectedProduct ? selectedProduct.name : 'Select Product'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.addItemInput}>
                <Text style={[styles.addItemLabel, { color: Colors[colorScheme].text }]}>
                  Quantity
                </Text>
                <View style={styles.quantityContainer}>
                  <TextInput
                    style={[styles.quantityInput, { 
                      backgroundColor: Colors[colorScheme].card,
                      color: Colors[colorScheme].text,
                    }]}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickQuantities}
                  >
                    {quickQuantities.map(q => (
                      <TouchableOpacity
                        key={q}
                        style={[
                          styles.quickQuantityButton,
                          { backgroundColor: Colors[colorScheme].card }
                        ]}
                        onPress={() => setQuantity(q)}
                      >
                        <Text style={{ color: Colors[colorScheme].text }}>{q}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.addItemButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleAddSaleItem}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addItemButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newSaleSummary}>
            <View>
              <Text style={[styles.newSaleSummaryLabel, { color: Colors[colorScheme].text }]}>
                Total:
              </Text>
              <Text style={[styles.newSaleSummaryValue, { color: Colors[colorScheme].tint }]}>
                {convertAmount(newSaleItems.reduce((total, item) => total + item.total, 0))}
              </Text>
            </View>
            <View>
              <Text style={[styles.newSaleSummaryLabel, { color: Colors[colorScheme].text }]}>
                Profit:
              </Text>
              <Text style={[styles.newSaleSummaryValue, { color: '#4CAF50' }]}>
                {convertAmount(newSaleItems.reduce((total, item) => total + item.profit, 0))}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.completeSaleButton, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleCompleteSale}
          >
            <Text style={styles.completeSaleButtonText}>Complete Sale</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#4CAF50', '#388E3C', '#1B5E20']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#fff" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search sales..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            style={styles.newSaleButton}
            onPress={() => setIsNewSaleVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {renderDateFilter()}
      </LinearGradient>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Total Sales
          </Text>
          <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
            {convertAmount(totalSales)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Total Profit
          </Text>
          <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
            {convertAmount(totalProfit)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.summaryLabel, { color: Colors[colorScheme].tabIconDefault }]}>
            Items Sold
          </Text>
          <Text style={[styles.summaryValue, { color: Colors[colorScheme].text }]}>
            {totalItemsSold}
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredSales}
        keyExtractor={item => item.id}
        renderItem={renderSale}
        contentContainerStyle={styles.listContent}
      />

      {renderNewSaleForm()}
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
  newSaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateFilter: {
    paddingHorizontal: 16,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedDateButton: {
    backgroundColor: '#fff',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedDateButtonText: {
    color: '#4CAF50',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  saleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  saleDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  saleTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saleItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  saleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  saleTime: {
    fontSize: 12,
  },
  saleItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleDetail: {
    fontSize: 14,
  },
  newSaleForm: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  newSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  newSaleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newSaleContent: {
    flex: 1,
  },
  newSaleItems: {
    marginBottom: 20,
  },
  newSaleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  newSaleItemInfo: {
    flex: 1,
  },
  newSaleItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  newSaleItemQuantity: {
    fontSize: 14,
  },
  newSaleItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  newSaleItemTotal: {
    fontSize: 16,
    fontWeight: '500',
  },
  addItemForm: {
    marginBottom: 20,
  },
  addItemInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  addItemInput: {
    flex: 1,
  },
  addItemLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  productSelector: {
    padding: 12,
    borderRadius: 8,
  },
  quantityInput: {
    padding: 12,
    borderRadius: 8,
  },
  addItemButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addItemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  newSaleSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  newSaleSummaryLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  newSaleSummaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  completeSaleButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeSaleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saleItemTotals: {
    alignItems: 'flex-end',
  },
  saleProfit: {
    fontSize: 12,
    marginTop: 2,
  },
  saleTotals: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flex: 1,
  },
  quickQuantities: {
    flexDirection: 'row',
    marginTop: 8,
  },
  quickQuantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  newSaleItemTotals: {
    alignItems: 'flex-end',
  },
  newSaleItemProfit: {
    fontSize: 12,
    marginTop: 2,
  },
});

