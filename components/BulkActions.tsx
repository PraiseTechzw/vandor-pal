import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/contexts/CurrencyContext';

type BulkActionsProps = {
  visible: boolean;
  onClose: () => void;
  selectedProducts: string[];
  onBulkUpdate: (action: 'buyingPrice' | 'sellingPrice' | 'stock', value: any) => void;
};

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Other'];

export default function BulkActions({
  visible,
  onClose,
  selectedProducts,
  onBulkUpdate,
}: BulkActionsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { currency } = useCurrency();
  const [selectedAction, setSelectedAction] = useState<'buyingPrice' | 'sellingPrice' | 'stock' | null>(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSubmit = () => {
    if (!selectedAction) {
      Alert.alert('Error', 'Please select an action');
      return;
    }

    if (selectedAction === 'stock') {
      if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
        Alert.alert('Error', 'Please enter a valid stock amount');
        return;
      }
      onBulkUpdate(selectedAction, parseInt(stock));
    } else {
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        Alert.alert('Error', 'Please enter a valid price');
        return;
      }
      onBulkUpdate(selectedAction, parseFloat(price));
    }

    setSelectedAction(null);
    setPrice('');
    setStock('');
    onClose();
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
              Bulk Actions ({selectedProducts.length} selected)
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors[colorScheme].text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      selectedAction === 'buyingPrice'
                        ? Colors[colorScheme].tint
                        : Colors[colorScheme].card,
                  },
                ]}
                onPress={() => setSelectedAction('buyingPrice')}
              >
                <MaterialIcons
                  name="shopping-cart"
                  size={24}
                  color={
                    selectedAction === 'buyingPrice'
                      ? '#fff'
                      : Colors[colorScheme].text
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    {
                      color:
                        selectedAction === 'buyingPrice'
                          ? '#fff'
                          : Colors[colorScheme].text,
                    },
                  ]}
                >
                  Update Buying Price
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      selectedAction === 'sellingPrice'
                        ? Colors[colorScheme].tint
                        : Colors[colorScheme].card,
                  },
                ]}
                onPress={() => setSelectedAction('sellingPrice')}
              >
                <MaterialIcons
                  name="attach-money"
                  size={24}
                  color={
                    selectedAction === 'sellingPrice'
                      ? '#fff'
                      : Colors[colorScheme].text
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    {
                      color:
                        selectedAction === 'sellingPrice'
                          ? '#fff'
                          : Colors[colorScheme].text,
                    },
                  ]}
                >
                  Update Selling Price
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor:
                      selectedAction === 'stock'
                        ? Colors[colorScheme].tint
                        : Colors[colorScheme].card,
                  },
                ]}
                onPress={() => setSelectedAction('stock')}
              >
                <MaterialIcons
                  name="inventory"
                  size={24}
                  color={
                    selectedAction === 'stock'
                      ? '#fff'
                      : Colors[colorScheme].text
                  }
                />
                <Text
                  style={[
                    styles.actionText,
                    {
                      color:
                        selectedAction === 'stock'
                          ? '#fff'
                          : Colors[colorScheme].text,
                    },
                  ]}
                >
                  Update Stock
                </Text>
              </TouchableOpacity>
            </View>

            {selectedAction === 'buyingPrice' && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  New Buying Price ({currency})
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder={`Enter buying price in ${currency}`}
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            )}

            {selectedAction === 'sellingPrice' && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  New Selling Price ({currency})
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: Colors[colorScheme].card,
                    color: Colors[colorScheme].text,
                  }]}
                  placeholder={`Enter selling price in ${currency}`}
                  placeholderTextColor={Colors[colorScheme].tabIconDefault}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            )}

            {selectedAction === 'stock' && (
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
                  New Stock Level
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
            )}
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
              <Text style={[styles.buttonText, { color: '#fff' }]}>Update</Text>
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
  content: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
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