import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const TIMEFRAMES = [
  { id: '1D', label: '1D', points: 6, vol: 0.02 },
  { id: '1W', label: '1V', points: 7, vol: 0.05 },
  { id: '1M', label: '1M', points: 10, vol: 0.10 },
  { id: '3M', label: '3M', points: 12, vol: 0.15 },
  { id: '1Y', label: '1Å', points: 12, vol: 0.30 },
];

export default function MarketDetailModal({ visible, asset, onClose }) {
  const [activeFrame, setActiveFrame] = useState(TIMEFRAMES[3]); // Default 3M

  // Generera fiktiv historik baserat på vald tidsram (touch knapp)
  const chartData = useMemo(() => {
    if (!asset) return [0];
    const base = asset.price;
    const volatility = base * activeFrame.vol; 
    const points = [];
    let current = base - (volatility * (Math.random() > 0.5 ? 1 : -1)); 
    
    for (let i = 0; i < activeFrame.points - 1; i++) {
        points.push(Math.max(current, 0.01)); 
        current = current + (Math.random() - 0.4) * (volatility / 2);
    }
    points.push(base); // Sista punkten = livepris
    return points;
  }, [asset?.id, activeFrame.id]);

  if (!asset) return null;

  // Låtsas räkna ut historisk procentuell ändring baserat på grafens första punkt
  const firstPoint = chartData[0] || 0;
  const simulatedChangePercent = firstPoint > 0 ? ((asset.price - firstPoint) / firstPoint) * 100 : 0;
  const isPositive = simulatedChangePercent >= 0;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleFrameSelect = (frame) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFrame(frame);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{asset.name} ({asset.symbol})</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>
            ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
          </Text>
          <View style={[styles.changeBadge, { backgroundColor: isPositive ? 'rgba(75, 181, 67, 0.2)' : 'rgba(255, 76, 76, 0.2)' }]}>
            <Ionicons name={isPositive ? "caret-up" : "caret-down"} size={16} color={isPositive ? colors.success : colors.danger} />
            <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}>
              {Math.abs(simulatedChangePercent).toFixed(2)}% ({activeFrame.label})
            </Text>
          </View>
        </View>

        {/* TIME FRAME BUTTONS (Touch knappar) */}
        <View style={styles.timeframeRow}>
          {TIMEFRAMES.map(frame => (
            <TouchableOpacity 
              key={frame.id} 
              style={[styles.frameBtn, activeFrame.id === frame.id && styles.frameBtnActive]}
              onPress={() => handleFrameSelect(frame)}
            >
              <Text style={[styles.frameText, activeFrame.id === frame.id && styles.frameTextActive]}>
                {frame.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: Array(activeFrame.points).fill(""), // Gömmer labels för en renare känsla
              datasets: [{ data: chartData }]
            }}
            width={screenWidth - 20}
            height={250}
            withDots={true}
            withInnerLines={false}
            withOuterLines={false}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.background,
              decimalPlaces: asset.price < 1 ? 4 : 0, 
              color: (opacity = 1) => isPositive ? `rgba(75, 181, 67, ${opacity})` : `rgba(255, 76, 76, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft: -10,
            }}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Följ {asset.symbol} Live</Text>
          <Text style={styles.infoText}>
            Klicka på tids-knapparna (1D, 1V, 1M, 3M, 1Å) ovanför grafen för att se exakt hur summan har gått upp och ner i värde den senaste tiden.
          </Text>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  closeBtn: { padding: 5 },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  currentPrice: {
    color: colors.primary,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  frameBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.cardDark,
  },
  frameBtnActive: {
    backgroundColor: colors.primary,
  },
  frameText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  frameTextActive: {
    color: colors.background,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  infoSection: {
    padding: 20,
    backgroundColor: colors.cardDark,
    marginHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  }
});
