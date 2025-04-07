import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';
import { LinearGradient } from 'expo-linear-gradient';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
};

type InventoryReportsProps = {
  products: Product[];
  onClose: () => void;
};

export default function InventoryReports({ products, onClose }: InventoryReportsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency, convertAmount } = useCurrency();

  // Calculate statistics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // Group by category
  const categoryStats = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {
        count: 0,
        stock: 0,
        value: 0,
      };
    }
    acc[product.category].count++;
    acc[product.category].stock += product.stock;
    acc[product.category].value += product.price * product.stock;
    return acc;
  }, {} as Record<string, { count: number; stock: number; value: number }>);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <LinearGradient
        colors={['#2196F3', '#1976D2', '#0D47A1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Inventory Reports</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="inventory" size={24} color={Colors[colorScheme].tint} />
            <Text style={[styles.statValue, { color: Colors[colorScheme].text }]}>
              {totalProducts}
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Total Products
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="shopping-cart" size={24} color={Colors[colorScheme].tint} />
            <Text style={[styles.statValue, { color: Colors[colorScheme].text }]}>
              {totalStock}
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Total Stock
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="attach-money" size={24} color={Colors[colorScheme].tint} />
            <Text style={[styles.statValue, { color: Colors[colorScheme].text }]}>
              {convertAmount(totalValue)}
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Total Value
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors[colorScheme].card }]}>
            <MaterialIcons name="warning" size={24} color="#FF5252" />
            <Text style={[styles.statValue, { color: '#FF5252' }]}>
              {lowStockCount}
            </Text>
            <Text style={[styles.statLabel, { color: Colors[colorScheme].tabIconDefault }]}>
              Low Stock
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Category Breakdown
          </Text>
          {Object.entries(categoryStats).map(([category, stats]) => (
            <View key={category} style={styles.categoryRow}>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: Colors[colorScheme].text }]}>
                  {category}
                </Text>
                <Text style={[styles.categoryCount, { color: Colors[colorScheme].tabIconDefault }]}>
                  {stats.count} products
                </Text>
              </View>
              <View style={styles.categoryStats}>
                <Text style={[styles.categoryStat, { color: Colors[colorScheme].text }]}>
                  {stats.stock} in stock
                </Text>
                <Text style={[styles.categoryValue, { color: Colors[colorScheme].text }]}>
                  {convertAmount(stats.value)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: Colors[colorScheme].card }]}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Stock Alerts
          </Text>
          {products
            .filter(p => p.stock <= p.lowStockThreshold)
            .map(product => (
              <View key={product.id} style={styles.alertRow}>
                <View style={styles.alertInfo}>
                  <Text style={[styles.alertName, { color: Colors[colorScheme].text }]}>
                    {product.name}
                  </Text>
                  <Text style={[styles.alertCategory, { color: Colors[colorScheme].tabIconDefault }]}>
                    {product.category}
                  </Text>
                </View>
                <View style={styles.alertStats}>
                  <Text style={[styles.alertStock, { color: '#FF5252' }]}>
                    {product.stock} / {product.lowStockThreshold}
                  </Text>
                  <Text style={[styles.alertValue, { color: Colors[colorScheme].text }]}>
                    {convertAmount(product.price)}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 12,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryStat: {
    fontSize: 14,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  alertInfo: {
    flex: 1,
  },
  alertName: {
    fontSize: 16,
    fontWeight: '500',
  },
  alertCategory: {
    fontSize: 12,
  },
  alertStats: {
    alignItems: 'flex-end',
  },
  alertStock: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertValue: {
    fontSize: 14,
  },
}); 