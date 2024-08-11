import React from 'react';
import { View, Button, Pressable, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const SubmitButtonComponent = ({ imageData, locationData, depthData, onPress, user_id }) => {
  // Function to handle the submit button press
  const handleSubmit =  async () => {

    // const base64Image = await FileSystem.readAsStringAsync(imageData, { encoding: 'base64' });
    // Prepare data to send to the Flask API
    // const dataToSend = {
    //   image: base64Image, // Base64 or URI of the captured image
    //   location: locationData, // Object containing latitude and longitude
    //   depth: depthData,
    //   network: networkData // Object containing network provider and strength
    // };

    const currentDate = new Date();

    currentDate.setHours(currentDate.getHours() + 5); // Adding 5 hours for IST
    currentDate.setMinutes(currentDate.getMinutes() + 30); // Adding additional 30 minutes for IST

    // Format the date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    const generateRandomString = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };
    
    // Usage example:
    const randomString = generateRandomString(10); // Generates a random string of length 10
    const imgfilename = `${randomString}.jpg`; // Example filename: abcdef1234.jpg
    

    const formData= new FormData();
    // console.log(locationData)
    try{
      formData.append('location', locationData[1]);
      formData.append('latlon', (locationData[0].coords.latitude.toString()+','+locationData[0].coords.longitude.toString()).toString());
      formData.append('depth', depthData);
      formData.append('imgfilename', imgfilename);
      formData.append('curdate', formattedDate);
      formData.append('lat', locationData[0].coords.latitude.toString());
      formData.append('lon', locationData[0].coords.longitude.toString());
      formData.append('serviceprovider', 'no info');
      formData.append('strength', 0);
      formData.append('ctid', 0);
      formData.append('lac', 0);
      formData.append('mnc', 0);
      formData.append('mcc', 0);
      formData.append("userid", user_id)}
      catch{
        console.log("error preparing formdata")
      }
      console.log(formData)
      const formDataimg = new FormData();
      try{
      formDataimg.append('uploaded_file', {
        uri: imageData,
        type: 'image/jpeg', 
        name: imgfilename   
      })}
      catch (error) {
        console.log(error)
      };

    // Call the onPress callback to send data to the API
    onPress([formData,formDataimg]);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the contents vertically
    alignItems: 'center', // Center the contents horizontally
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '80%',
    backgroundColor: 'green', // Green background color
    borderRadius: 5, // Rounded corners
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubmitButtonComponent;
