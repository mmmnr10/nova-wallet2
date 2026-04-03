import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors';
import MarketDetailModal from './MarketDetailModal';

const INITIAL_DATA = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 2.3 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.20, change: -1.2 },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 145.80, change: 5.4 },
  { id: '4', symbol: 'BNB', name: 'Binance Coin', price: 590.10, change: 0.8 },
  { id: '5', symbol: 'ADA', name: 'Cardano', price: 0.45, change: -0.5 },
  { id: '6', symbol: 'XRP', name: 'Ripple', price: 0.62, change: 1.1 },
];

export default function MarketScreen() {
  const [marketData, setMarketData] = useState(INITIAL_DATA);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    // Simulate live market data updates every 2 seconds
    const interval = setInterval(() => {
      setMarketData(currentData => 
        currentData.map(item => {
          // Random fluctuation between -0.5% to +0.5%
          const changePercent = (Math.random() - 0.5) * 0.01;
          const newPrice = item.price * (1 + changePercent);
          // Keep the change within reasonable bounds just for show
          const newChange = item.change + (changePercent * 100);
          
          return {
            ...item,
            price: newPrice,
            change: newChange
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleItemPress = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAsset(item);
  };

  const renderItem = ({ item }) => {
    const isPositive = item.change >= 0;
    const priceFormatted = item.price < 1 ? item.price.toFixed(4) : item.price.toFixed(2);
    
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)} activeOpacity={0.7}>
        <View style={styles.coinInfo}>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-bitcoin" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
        
        <View style={styles.priceInfo}>
          <Text style={styles.price}>${priceFormatted}</Text>
          <View style={[styles.changeBadge, { backgroundColor: isPositive ? 'rgba(75, 181, 67, 0.2)' : 'rgba(255, 76, 76, 0.2)' }]}>
            <Ionicons name={isPositive ? "caret-up" : "caret-down"} size={12} color={isPositive ? colors.success : colors.danger} />
            <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}>
              {Math.abs(item.change).toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Live Marknad</Text>
      <FlatList 
        data={marketData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <MarketDetailModal 
        visible={!!selectedAsset} 
        asset={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbol: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  }
});
