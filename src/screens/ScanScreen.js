import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Vi behöver din tillåtelse för att använda kameran och skanna QR-koder.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Ge Tillåtelse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert(
      "QR-kod Skannad",
      `Data: ${data}`,
      [{ text: "OK", onPress: () => setScanned(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Skanna QR-kod</Text>
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.scanFrame} />
        </View>
      </View>
      <View style={styles.instructionsContainer}>
        <Ionicons name="qr-code-outline" size={32} color={colors.primary} style={styles.instructionIcon} />
        <Text style={styles.instructionText}>Placera QR-koden inuti ramen för att skanna.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: colors.text,
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 50,
  },
  button: {
    backgroundColor: colors.primary,
    marginHorizontal: 40,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  instructionsContainer: {
    padding: 30,
    alignItems: 'center',
  },
  instructionIcon: {
    marginBottom: 10,
  },
  instructionText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  }
});
