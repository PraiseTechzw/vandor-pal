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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';

type InventoryFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    buyingPrice: number;
    sellingPrice: number;
    stock: number;
    lowStockThreshold: number;
  }) => void;
  initialData?: {
    name: string;
    category: string;
    buyingPrice: number;
    sellingPrice: number;
    stock: number;
    lowStockThreshold: number;
  };
};

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Other'];

export default function InventoryForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: InventoryFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency } = useCurrency();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');

  // Reset form when visibility changes
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
        setBuyingPrice(initialData.buyingPrice.toString());
        setSellingPrice(initialData.sellingPrice.toString());
        setStock(initialData.stock.toString());
        setLowStockThreshold(initialData.lowStockThreshold.toString());
      } else {
        // Reset to default values for new product
        setName('');
        setCategory('');
        setBuyingPrice('');
        setSellingPrice('');
        setStock('');
        setLowStockThreshold('5');
      }
    }
  }, [visible, initialData]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push('Product name is required');
    }

    if (!category) {
      errors.push('Please select a category');
    }

    if (!buyingPrice) {
      errors.push('Buying price is required');
    } else if (isNaN(parseFloat(buyingPrice)) || parseFloat(buyingPrice) <= 0) {
      errors.push('Please enter a valid buying price');
    }

    if (!sellingPrice) {
      errors.push('Selling price is required');
    } else if (isNaN(parseFloat(sellingPrice)) || parseFloat(sellingPrice) <= 0) {
      errors.push('Please enter a valid selling price');
    }

    if (buyingPrice && sellingPrice && parseFloat(sellingPrice) <= parseFloat(buyingPrice)) {
      errors.push('Selling price must be higher than buying price');
    }

    if (!stock) {
      errors.push('Stock level is required');
    } else if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      errors.push('Please enter a valid stock amount');
    }

    if (!lowStockThreshold) {
      errors.push('Low stock threshold is required');
    } else if (isNaN(parseInt(lowStockThreshold)) || parseInt(lowStockThreshold) < 0) {
      errors.push('Please enter a valid low stock threshold');
    }

    if (stock && lowStockThreshold && parseInt(lowStockThreshold) >= parseInt(stock)) {
      errors.push('Low stock threshold must be less than current stock');
    }

    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return;
    }

    onSubmit({
      name: name.trim(),
      category,
      buyingPrice: parseFloat(buyingPrice),
      sellingPrice: parseFloat(sellingPrice),
      stock: parseInt(stock),
      lowStockThreshold: parseInt(lowStockThreshold),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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

            <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Product Name *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder="Enter product name"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Category *
                </Text>
                <View style={styles.categoryGrid}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: category === cat
                            ? Colors[colorScheme].tint
                            : Colors[colorScheme].card,
                        },
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: category === cat
                              ? '#fff'
                              : Colors[colorScheme].text,
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Buying Price ({currency}) *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder={`Enter buying price in ${currency}`}
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={buyingPrice}
                  onChangeText={setBuyingPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Selling Price ({currency}) *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder={`Enter selling price in ${currency}`}
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Stock Level *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder="Enter stock amount"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  Low Stock Threshold *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder="Enter low stock threshold"
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={lowStockThreshold}
                  onChangeText={setLowStockThreshold}
                  keyboardType="numeric"
                />
              </View>

              <Text style={[styles.requiredNote, { color: Colors[colorScheme].tabIconDefault }]}>
                * Required fields
              </Text>
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
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
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
  content: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  requiredNote: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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