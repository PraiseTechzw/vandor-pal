import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for inventory items
const inventoryItems = [
  { id: '1', name: 'Product A', stock: 45, price: 29.99, lowStock: false },
  { id: '2', name: 'Product B', stock: 12, price: 49.99, lowStock: true },
  { id: '3', name: 'Product C', stock: 78, price: 19.99, lowStock: false },
  { id: '4', name: 'Product D', stock: 5, price: 99.99, lowStock: true },
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme();

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]}>
          {item.name}
        </Text>
        {item.lowStock && (
          <MaterialIcons name="warning" size={20} color="#FF9800" />
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemDetail, { color: Colors[colorScheme ?? 'light'].text }]}>
          Stock: {item.stock}
        </Text>
        <Text style={[styles.itemDetail, { color: Colors[colorScheme ?? 'light'].text }]}>
          Price: ${item.price}
        </Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Inventory
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={inventoryItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemDetail: {
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 