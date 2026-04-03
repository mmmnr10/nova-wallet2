import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Coordinates for real weather data
const CITIES = [
  { id: '1', name: 'New York', tz: 'America/New_York', offset: 'EST', lat: 40.7143, lon: -74.006 },
  { id: '2', name: 'London', tz: 'Europe/London', offset: 'GMT', lat: 51.5085, lon: -0.1257 },
  { id: '3', name: 'Tokyo', tz: 'Asia/Tokyo', offset: 'JST', lat: 35.6895, lon: 139.6917 },
  { id: '4', name: 'Stockholm', tz: 'Europe/Stockholm', offset: 'CET', lat: 59.3293, lon: 18.0686 },
  { id: '5', name: 'Sydney', tz: 'Australia/Sydney', offset: 'AEST', lat: -33.8678, lon: 151.2073 },
];

const getWeatherDetails = (code) => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0) return { icon: 'sunny', description: 'Klarhimmel', color: '#FFD700' };
  if (code === 1) return { icon: 'partly-sunny', description: 'Mestadels klart', color: '#F3E5AB' };
  if (code === 2) return { icon: 'partly-sunny', description: 'Halvklart', color: '#C5C6C7' };
  if (code === 3) return { icon: 'cloudy', description: 'Mulet', color: '#9E9E9E' };
  if (code === 45 || code === 48) return { icon: 'cloud', description: 'Dimma', color: '#9E9E9E' };
  if (code >= 51 && code <= 55) return { icon: 'rainy-outline', description: 'Duggregn', color: '#66FCF1' };
  if (code >= 61 && code <= 65) return { icon: 'rainy', description: 'Regn', color: '#45A29E' };
  if (code >= 71 && code <= 75) return { icon: 'snow', description: 'Snö', color: '#FFFFFF' };
  if (code >= 95) return { icon: 'thunderstorm', description: 'Åska', color: '#FF4C4C' };
  return { icon: 'cloud-outline', description: 'Okänt', color: colors.textSecondary };
};

export default function WorldTimeScreen() {
  const [time, setTime] = useState(new Date());
  const [weathers, setWeathers] = useState({});

  useEffect(() => {
    // 1. Timer for live ticking clock
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 2. Fetch REAL weather data using Open-Meteo (No API key needed)
    const fetchWeather = async () => {
      try {
        const fetchPromises = CITIES.map(async (city) => {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
          const data = await res.json();
          return { id: city.id, weather: data.current_weather };
        });
        
        const results = await Promise.all(fetchPromises);
        const newWeathers = {};
        results.forEach(res => {
          if (res.weather) {
            newWeathers[res.id] = res.weather;
          }
        });
        setWeathers(newWeathers);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    };

    fetchWeather();
    
    // Refresh real weather every 10 minutes
    const weatherTimer = setInterval(fetchWeather, 600000);

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  const formatTime = (date, timezone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const formatDate = (date, timezone) => {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Global Klocka & Väder</Text>
        
        {CITIES.map((city) => {
          const weather = weathers[city.id];
          const weatherUI = weather ? getWeatherDetails(weather.weathercode) : null;

          return (
            <View key={city.id} style={styles.clockCard}>
              <View style={styles.locationInfo}>
                <Text style={styles.cityName}>{city.name}</Text>
                
                {/* Weather Data */}
                <View style={styles.weatherRow}>
                  {weather ? (
                    <>
                      <Ionicons name={weatherUI.icon} size={18} color={weatherUI.color} />
                      <Text style={styles.tempText}>{Math.round(weather.temperature)}°C</Text>
                      <Text style={[styles.weatherDesc, { color: weatherUI.color }]}>{weatherUI.description}</Text>
                    </>
                  ) : (
                    <ActivityIndicator size="small" color={colors.primaryLight} style={styles.loader} />
                  )}
                </View>

                {/* Date */}
                <Text style={styles.dateText}>
                  {formatDate(time, city.tz).charAt(0).toUpperCase() + formatDate(time, city.tz).slice(1)}
                </Text>
              </View>
              
              <View style={styles.timeInfo}>
                <Text style={styles.timeText}>{formatTime(time, city.tz)}</Text>
                <Text style={styles.offsetText}>{city.offset}</Text>
              </View>
            </View>
          );
        })}
        
      </ScrollView>
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
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  clockCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tempText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    marginRight: 6,
  },
  weatherDesc: {
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    marginLeft: 10,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  timeInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'], // keep numbers mono-spaced so it doesn't jump
  },
  offsetText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  }
});
