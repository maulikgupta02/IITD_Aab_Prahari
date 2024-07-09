import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, Text, SafeAreaView, Alert } from 'react-native';
import Header from './components/Navbar';
import LocationComponent from './components/Location';
import RadioButtonGroup from './components/Waterlevel';
import CameraComponent from './components/Camera';
import NetworkInfoComponent from './components/Netinfo';
import SubmitButtonComponent from './components/Submit';

export default function App() {

  const [imageData, setImageData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [depthData, setDepthData] = useState(null);
  const [networkData, setNetworkData] = useState(null);

  // Function to handle sending data to PHP API
  const handleSendData = (formData) => {
    // console.log(formData)
    fetch("https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/updatecomplaint_user.php", {
      method: 'POST',
      body: formData,
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      Alert.alert('Data sent successfully');

    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert('Error uploading data, please try again later');
    });
  };

  const handleSending = (imgdata) => {

    fetch("https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/uploadtoserver.php", {
      method: 'POST',
      body: imgdata,
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      // Handle success response
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error
    });
  };
  



  return (
    <SafeAreaView style={styles.body}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <StatusBar backgroundColor="#390080" barStyle="light-content" /> 
        <Header style={styles.navcontainer} />
        <LocationComponent style={styles.coordinates} onCapture={(data) => setLocationData(data)}/>
        <RadioButtonGroup style={styles.radioGroup} onCapture={(data) => setDepthData(data)}/>
        <CameraComponent style='auto' onCapture={(data) => setImageData(data)}/>
        <NetworkInfoComponent onCapture={(data) => setNetworkData(data)}/>
        <SubmitButtonComponent
        imageData={imageData}
        locationData={locationData}
        networkData={networkData}
        depthData={depthData}
        // onPress={handleSendData}
        onPress={(DATABHEJO) => {
          handleSendData(DATABHEJO[0]);
          handleSending(DATABHEJO[1]);
        }}
        style={styles.Submit}
      />
    </ScrollView>
    </SafeAreaView>
   );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#D3D3D3'
  },
  navcontainer: {
    flex: 0.1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinates: {
    flex: 0.2,
    paddingTop: 20, // Adjust padding to create the gap
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioGroup: {
    flex:0.1,
    marginTop: 20,
    alignSelf: 'center',
  },
  Submit: {
    alignSelf: 'center',
  }
});










// import React from 'react';
// import { StyleSheet, View, Alert } from 'react-native';
// import RegisterForm from './components/RegisterForm';
// import { registerUser } from './services/api';

// export default function App() {
//   const handleSubmit = async (values) => {
//     try {
//       const response = await registerUser(values);
//       Alert.alert('Success', 'Registration successful!');
//       console.log('API Response:', response);
//     } catch (error) {
//       Alert.alert('Error', 'Registration failed. Please try again.');
//       console.error('Registration Error:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <RegisterForm onSubmit={handleSubmit} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
// });
