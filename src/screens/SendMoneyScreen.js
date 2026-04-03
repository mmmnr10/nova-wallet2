import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors';

export default function SendMoneyScreen({ visible, onClose }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSend = () => {
    if (!amount || !recipient) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Fel', 'Vänligen fyll i belopp och mottagare.');
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Klart', `Skickade ${amount} kr till ${recipient}!`, [
      { text: 'OK', onPress: () => {
        setAmount('');
        setRecipient('');
        onClose();
      } }
    ]);
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
          
          <Text style={styles.modalTitle}>Skicka Pengar</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mottagare (E-post eller @användarnamn)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="@användarnamn" 
              placeholderTextColor={colors.textSecondary}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Belopp (kr)</Text>
            <TextInput 
              style={styles.amountInput} 
              placeholder="0" 
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Skicka Nu</Text>
          </TouchableOpacity>
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
    borderLeftWidth: 1,
    borderRightWidth: 1,
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
  },
  input: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    color: colors.text,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountInput: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    color: colors.primary,
    padding: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  sendButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
