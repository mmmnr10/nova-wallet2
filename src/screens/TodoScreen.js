import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../theme/colors';

export default function TodoScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'köpa godis i ica maxi nuuu', completed: false },
    { id: '2', text: 'Köpa godis i ica maxi', completed: true },
    { id: '3', text: 'Köpa godis', completed: false },
  ]);
  const [inputText, setInputText] = useState('');

  const addTask = () => {
    if (inputText.trim().length === 0) return;

    const newTask = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
    Keyboard.dismiss();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleTask = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={28}
          color={item.completed ? colors.success : colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.taskTextContainer}>
        <Text style={[
          styles.taskText,
          item.completed && styles.taskTextCompleted
        ]}>
          {item.text}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Att göra</Text>
      
      <View style={styles.innerContainer}>
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} style={{ opacity: 0.5 }} />
            <Text style={styles.emptyText}>Du har inga uppgifter inlagda.</Text>
            <Text style={styles.emptySubText}>Lägg till en uppgift nedan!</Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Lägg till en ny uppgift..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Ionicons name="add" size={28} color={colors.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  innerContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkbox: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    color: colors.text,
    fontSize: 16,
  },
  taskTextCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20, // Tab bar padding usually handles bottom space
    backgroundColor: colors.background, // Match background to prevent clipping
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardDark,
    borderRadius: 15,
    padding: 15,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  }
});
