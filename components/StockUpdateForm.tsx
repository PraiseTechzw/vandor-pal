import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type StockUpdateFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (update: { type: 'add' | 'remove'; amount: number }) => void;
  productName: string;
  currentStock: number;
};

export default function StockUpdateForm({
  visible,
  onClose,
  onSubmit,
  productName,
  currentStock,
}: StockUpdateFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const [amount, setAmount] = useState('');
  const [updateType, setUpdateType] = useState<'add' | 'remove'>('add');

  const handleSubmit = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (updateType === 'remove' && numAmount > currentStock) {
      Alert.alert('Error', 'Cannot remove more than current stock');
      return;
    }

    onSubmit({ type: updateType, amount: numAmount });
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
              Update Stock
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors[colorScheme].text} />
            </TouchableOpacity>
          </View>

          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: Colors[colorScheme].text }]}>
              {productName}
            </Text>
            <Text style={[styles.currentStock, { color: Colors[colorScheme].tabIconDefault }]}>
              Current Stock: {currentStock}
            </Text>
          </View>

          <View style={styles.updateTypeContainer}>
            <TouchableOpacity
              style={[
                styles.updateTypeButton,
                {
                  backgroundColor: updateType === 'add'
                    ? Colors[colorScheme].tint
                    : Colors[colorScheme].card,
                },
              ]}
              onPress={() => setUpdateType('add')}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={updateType === 'add' ? '#fff' : Colors[colorScheme].text}
              />
              <Text
                style={[
                  styles.updateTypeText,
                  { color: updateType === 'add' ? '#fff' : Colors[colorScheme].text },
                ]}
              >
                Add Stock
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.updateTypeButton,
                {
                  backgroundColor: updateType === 'remove'
                    ? Colors[colorScheme].tint
                    : Colors[colorScheme].card,
                },
              ]}
              onPress={() => setUpdateType('remove')}
            >
              <MaterialIcons
                name="remove"
                size={20}
                color={updateType === 'remove' ? '#fff' : Colors[colorScheme].text}
              />
              <Text
                style={[
                  styles.updateTypeText,
                  { color: updateType === 'remove' ? '#fff' : Colors[colorScheme].text },
                ]}
              >
                Remove Stock
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountInput}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              Amount to {updateType}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme].card,
                color: Colors[colorScheme].text,
              }]}
              placeholder="Enter amount"
              placeholderTextColor={Colors[colorScheme].tabIconDefault}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

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
  productInfo: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentStock: {
    fontSize: 14,
  },
  updateTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  updateTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  updateTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountInput: {
    marginBottom: 20,
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