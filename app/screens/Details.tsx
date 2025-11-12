import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Details = ({ navigation }: RouterProps) => {
  const user = FIREBASE_AUTH.currentUser;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Details</Text>
          <Text style={styles.headerSubtitle}>Your profile information</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.labelIcon}>📧</Text>
              <Text style={styles.labelText}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || 'Not available'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.labelIcon}>🆔</Text>
              <Text style={styles.labelText}>User ID</Text>
            </View>
            <Text style={styles.infoValueSmall} numberOfLines={1}>
              {user?.uid || 'Not available'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.labelIcon}>✅</Text>
              <Text style={styles.labelText}>Email Verified</Text>
            </View>
            <View style={[
              styles.badge,
              user?.emailVerified ? styles.badgeSuccess : styles.badgeWarning
            ]}>
              <Text style={styles.badgeText}>
                {user?.emailVerified ? 'Verified' : 'Not Verified'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.labelIcon}>📅</Text>
              <Text style={styles.labelText}>Created At</Text>
            </View>
            <Text style={styles.infoValue}>
              {user?.metadata.creationTime 
                ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'Not available'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
              <Text style={styles.labelIcon}>🕐</Text>
              <Text style={styles.labelText}>Last Sign In</Text>
            </View>
            <Text style={styles.infoValue}>
              {user?.metadata.lastSignInTime 
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'Not available'}
            </Text>
          </View>
        </View>

        {/* Additional Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Status</Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{user?.providerData.length || 0}</Text>
              <Text style={styles.statusLabel}>Provider</Text>
            </View>
            
            <View style={styles.statusDivider} />
            
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>{user?.emailVerified ? '✓' : '✗'}</Text>
              <Text style={styles.statusLabel}>Verified</Text>
            </View>
            
            <View style={styles.statusDivider} />
            
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>🔒</Text>
              <Text style={styles.statusLabel}>Secured</Text>
            </View>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  innerContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  labelText: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  infoValueSmall: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
    maxWidth: 150,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#D4EDDA',
  },
  badgeWarning: {
    backgroundColor: '#FFF3CD',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8E8E8',
  },
  backButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});