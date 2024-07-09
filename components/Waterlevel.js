import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioButtonGroup = ({ onCapture }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['Ankle', 'Knee', 'Thigh', 'Waist', 'Above Head'];

  const RadioButton = ({ label, selected, onPress }) => {
    return (
      <TouchableOpacity style={styles.radioButton} onPress={onPress}>
        <View style={[styles.circle, selected && styles.selectedCircle]} />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    // Log selected option
    // console.log('Selected Option:', option);
    // Pass selected option back to parent component via onCapture callback
    onCapture(option);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {options.map((option, index) => (
            <RadioButton
              key={index}
              label={option}
              selected={selectedOption === option}
              onPress={() => handleSelectOption(option)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  selectedCircle: {
    backgroundColor: '#000',
  },
  label: {
    fontSize: 16,
  },
});

export default RadioButtonGroup;
