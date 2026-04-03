import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors';

const RATES = {
  SEK: 1,
  USD: 0.095,
  EUR: 0.088,
  BTC: 0.0000015,
};

export default function CurrencyConverterScreen({ visible, onClose }) {
  const [amount, setAmount] = useState('1000');
  const [currency, setCurrency] = useState('USD');

  const handleConvert = (targetCurrency) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrency(targetCurrency);
  };

  const getConvertedValue = () => {
    const value = parseFloat(amount) || 0;
    const converted = value * RATES[currency];
    if (currency === 'BTC') return converted.toFixed(6);
    return converted.toFixed(2);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.modalBg} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Valutaräknare</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Belopp i SEK</Text>
            <TextInput 
              style={styles.amountInput} 
              placeholder="0" 
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
            />
          </View>

          <View style={styles.currencyRow}>
            {['USD', 'EUR', 'BTC'].map((cur) => (
              <TouchableOpacity 
                key={cur}
                style={[styles.currencyBtn, currency === cur && styles.currencyBtnActive]}
                onPress={() => handleConvert(cur)}
              >
                <Text style={[styles.currencyBtnText, currency === cur && styles.currencyBtnTextActive]}>
                  {cur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Motsvarar ungefär</Text>
            <Text style={styles.resultAmount}>
              {getConvertedValue()} {currency}
            </Text>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  amountInput: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    color: colors.text,
    padding: 15,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  currencyBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currencyBtnText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  currencyBtnTextActive: {
    color: colors.background,
  },
  resultBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.cardDark,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  resultAmount: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: 'bold',
  }
});
