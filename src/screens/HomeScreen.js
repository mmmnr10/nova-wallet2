import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import colors from '../theme/colors';
import SendMoneyScreen from './SendMoneyScreen';
import CurrencyConverterScreen from './CurrencyConverterScreen';

// Set up Notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const [sendMoneyVisible, setSendMoneyVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);

  useEffect(() => {
    // Request permission for push notifications
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions denied.');
      }
    };
    requestPermissions();
  }, []);

  const handleReceive = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Schedule a fake notification after 3 seconds
    setTimeout(() => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Transaktion mottagen! 💸",
          body: "Du har precis tagit emot 5 000 kr från Skatteverket.",
          sound: true,
        },
        trigger: null, // Send immediately after the timeout
      });
    }, 3000);
    
    Alert.alert("Väntar...", "Appen lyssnar efter inkommande transaktioner. (Vänta 3 sekunder i bakgrunden eller ha appen öppen)");
  };

  const handleSendPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSendMoneyVisible(true);
  };

  const handleConvertPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConverterVisible(true);
  };

  const transactions = [
    { id: '1', title: 'Pressbyrån', amount: '-54 kr', type: 'expense', date: 'Idag, 08:30' },
    { id: '2', title: 'Lön', amount: '+32 000 kr', type: 'income', date: 'Igår' },
    { id: '3', title: 'Netflix', amount: '-159 kr', type: 'expense', date: '15 Okt' },
    { id: '4', title: 'Västtrafik', amount: '-35 kr', type: 'expense', date: '12 Okt' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Totalt Saldo</Text>
          <Text style={styles.balanceAmount}>142 305 kr</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleSendPress}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-up" size={20} color={colors.background} />
              </View>
              <Text style={styles.actionText}>Skicka</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={handleReceive}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-down" size={20} color={colors.background} />
              </View>
              <Text style={styles.actionText}>Ta emot</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleConvertPress}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="cash" size={20} color={colors.background} />
              </View>
              <Text style={styles.actionText}>Valuta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Senaste Transaktioner</Text>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={styles.txIcon}>
                <Ionicons 
                  name={tx.type === 'income' ? "arrow-down-circle" : "arrow-up-circle"} 
                  size={32} 
                  color={tx.type === 'income' ? colors.success : colors.danger} 
                />
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'income' ? colors.success : colors.text }]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modals */}
      <SendMoneyScreen visible={sendMoneyVisible} onClose={() => setSendMoneyVisible(false)} />
      <CurrencyConverterScreen visible={converterVisible} onClose={() => setConverterVisible(false)} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    alignItems: 'center',
    width: 60,
  },
  actionIconContainer: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionsSection: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txIcon: {
    marginRight: 15,
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  txDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
