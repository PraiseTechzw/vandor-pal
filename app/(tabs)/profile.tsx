import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: Colors[colorScheme ?? 'light'].text }]}>
              Vendor Name
            </Text>
            <Text style={[styles.profileEmail, { color: Colors[colorScheme ?? 'light'].text }]}>
              vendor@example.com
            </Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                Status:
              </Text>
              <View style={styles.statusToggle}>
                <Text style={[styles.statusText, { color: isOnline ? '#4CAF50' : '#FF5252' }]}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
                <Switch
                  value={isOnline}
                  onValueChange={setIsOnline}
                  trackColor={{ false: '#767577', true: '#4CAF50' }}
                  thumbColor={isOnline ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Business Information
        </Text>
        <View style={styles.infoItem}>
          <MaterialIcons name="store" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Business Name
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              My Street Food
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="location-on" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Current Location
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              Central Park, North Entrance
            </Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="phone" size={24} color="#2196F3" />
          <View style={styles.infoText}>
            <Text style={[styles.infoLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
              Contact
            </Text>
            <Text style={[styles.infoValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              +1 234 567 8900
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Settings
        </Text>
        
        {/* Business Settings */}
        <Text style={[styles.settingCategory, { color: Colors[colorScheme ?? 'light'].text }]}>
          Business Settings
        </Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome5 name="map-marked-alt" size={22} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Manage Locations
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="access-time" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Business Hours
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="restaurant-menu" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Menu Management
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <FontAwesome5 name="money-bill-wave" size={20} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Pricing & Discounts
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="payment" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Payment Methods
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        {/* Order Settings */}
        <Text style={[styles.settingCategory, { color: Colors[colorScheme ?? 'light'].text, marginTop: 20 }]}>
          Order Management
        </Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="receipt" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Order History
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="people" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Customer Management
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="loyalty" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loyalty Program
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        {/* App Settings */}
        <Text style={[styles.settingCategory, { color: Colors[colorScheme ?? 'light'].text, marginTop: 20 }]}>
          App Settings
        </Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="notifications" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Notifications
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="language" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Language
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="color-lens" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Appearance
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        {/* Account Settings */}
        <Text style={[styles.settingCategory, { color: Colors[colorScheme ?? 'light'].text, marginTop: 20 }]}>
          Account
        </Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="account-circle" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Profile Settings
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="security" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Security
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="attach-money" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Earnings & Payouts
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="description" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Permits & Licenses
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="help" size={24} color="#2196F3" />
          <Text style={[styles.settingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Help & Support
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#FF5252' }]}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2196F3',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});