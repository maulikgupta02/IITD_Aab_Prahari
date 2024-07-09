import React, { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample({onCapture}) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, 
    });

    handleImageResult(result);
  };

  const handleImageResult = (result) => {
    // console.log(result);
    // console.log(result.assets[0].uri)
    
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      // Call onCapture with the captured image URI
      onCapture(result.assets[0].uri);
    }

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      

      {/* Displaying the selected image within a bordered box */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ) : (
          <Image source={require('../assets/depth_reference.jpeg')} style={styles.image} resizeMode="cover" />
        )}
      </View>
      <View style={styles.buttons}>
      <View style={styles.buttonContainer}>
        <Button title="Take Sample" onPress={takePhoto} />
      </View>
      {image && (
      <View style={styles.clearButton}>
        <Button title='Clear Image' onPress={clearImage} style={styles.clearButton} />
      </View>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
    color: 'red'
  },
  clearText: {
    color: 'white',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  }
});

