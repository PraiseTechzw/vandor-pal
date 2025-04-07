import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';

type ProductFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (product: {
    name: string;
    category: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
  }) => void;
  initialData?: {
    name: string;
    category: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
  };
};

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Other'];

export default function ProductForm({ visible, onClose, onSubmit, initialData }: ProductFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency, convertAmount } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    lowStockThreshold: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        lowStockThreshold: initialData.lowStockThreshold.toString(),
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        lowStockThreshold: '',
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.lowStockThreshold) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);
    const lowStockThreshold = parseInt(formData.lowStockThreshold);

    if (isNaN(price) || isNaN(stock) || isNaN(lowStockThreshold)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    onSubmit({
      name: formData.name,
      category: formData.category,
      price,
      stock,
      lowStockThreshold,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme].background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme].text }]}>
              {initialData ? 'Edit Product' : 'Add New Product'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors[colorScheme].text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Product Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme].card,
                  color: Colors[colorScheme].text,
                }]}
                placeholder="Enter product name"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: formData.category === category
                          ? Colors[colorScheme].tint
                          : Colors[colorScheme].card,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color: formData.category === category
                            ? '#fff'
                            : Colors[colorScheme].text,
                        },
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Price ({currency})</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme].card,
                  color: Colors[colorScheme].text,
                }]}
                placeholder={`Enter price in ${currency}`}
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />
              <Text style={[styles.currencyPreview, { color: Colors[colorScheme].tabIconDefault }]}>
                {formData.price ? convertAmount(parseFloat(formData.price)) : ''}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Current Stock</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme].card,
                  color: Colors[colorScheme].text,
                }]}
                placeholder="Enter current stock"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Low Stock Threshold</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme].card,
                  color: Colors[colorScheme].text,
                }]}
                placeholder="Enter low stock threshold"
                placeholderTextColor={Colors[colorScheme].tabIconDefault}
                value={formData.lowStockThreshold}
                onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: text })}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: Colors[colorScheme].card }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: Colors[colorScheme].text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: Colors[colorScheme].tint }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.buttonText, { color: '#fff' }]}>
                {initialData ? 'Update' : 'Add Product'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  currencyPreview: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 