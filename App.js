// import React, { useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { ScrollView, StyleSheet, View, Text, SafeAreaView, Alert } from 'react-native';
// import Header from './components/Navbar';
// import LocationComponent from './components/Location';
// import RadioButtonGroup from './components/Waterlevel';
// import CameraComponent from './components/Camera';
// import NetworkInfoComponent from './components/Netinfo';
// import SubmitButtonComponent from './components/Submit';

// export default function App() {

//   const [imageData, setImageData] = useState(null);
//   const [locationData, setLocationData] = useState(null);
//   const [depthData, setDepthData] = useState(null);
//   const [networkData, setNetworkData] = useState(null);

//   // Function to handle sending data to PHP API
//   const handleSendData = (formData) => {
//     // console.log(formData)
//     fetch("https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/updatecomplaint_user.php", {
//       method: 'POST',
//       body: formData,
//     })
//     .then(response => response.text())
//     .then(data => {
//       console.log('Success:', data);
//       Alert.alert('Data sent successfully');

//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       Alert.alert('Error uploading data, please try again later');
//     });
//   };

//   const handleSending = (imgdata) => {

//     fetch("https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/uploadtoserver.php", {
//       method: 'POST',
//       body: imgdata,
//       headers: {
//         'Content-Type': 'multipart/form-data', 
//       },
//     })
//     .then(response => response.text())
//     .then(data => {
//       console.log('Success:', data);
//       // Handle success response
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//       // Handle error
//     });
//   };
  



//   return (
//     <SafeAreaView style={styles.body}>
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//     <StatusBar backgroundColor="#390080" barStyle="light-content" /> 
//         <Header style={styles.navcontainer} />
//         <LocationComponent style={styles.coordinates} onCapture={(data) => setLocationData(data)}/>
//         <RadioButtonGroup style={styles.radioGroup} onCapture={(data) => setDepthData(data)}/>
//         <CameraComponent style='auto' onCapture={(data) => setImageData(data)}/>
//         <NetworkInfoComponent onCapture={(data) => setNetworkData(data)}/>
//         <SubmitButtonComponent
//         imageData={imageData}
//         locationData={locationData}
//         networkData={networkData}
//         depthData={depthData}
//         // onPress={handleSendData}
//         onPress={(DATABHEJO) => {
//           handleSendData(DATABHEJO[0]);
//           handleSending(DATABHEJO[1]);
//         }}
//         style={styles.Submit}
//       />
//     </ScrollView>
//     </SafeAreaView>
//    );
// }

// const styles = StyleSheet.create({
//   body: {
//     flex: 1,
//     backgroundColor: '#D3D3D3'
//   },
//   navcontainer: {
//     flex: 0.1,
//     backgroundColor: '#f8f8f8',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   coordinates: {
//     flex: 0.2,
//     paddingTop: 20, // Adjust padding to create the gap
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioGroup: {
//     flex:0.1,
//     marginTop: 20,
//     alignSelf: 'center',
//   },
//   Submit: {
//     alignSelf: 'center',
//   }
// });

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import Header from './components/Navbar';
import LocationComponent from './components/Location';
import RadioButtonGroup from './components/Waterlevel';
import CameraComponent from './components/Camera';
// import NetworkInfoComponent from './components/Netinfo';
import SubmitButtonComponent from './components/Submit';
// import { registerUser } from './services/api';
import RegisterForm from './components/RegisterForm'; // Assuming you have a RegisterForm component
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { formToJSON } from 'axios';

const API_URL = 'https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari'; // Adjust as needed

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [depthData, setDepthData] = useState(null);
  // const [networkData, setNetworkData] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [user_id, setuser_id] = useState(null);

  useEffect(() => {
    checkCachedUser();
  }, []);

  const checkCachedUser = async () => {
    try {
      const cachedResponse = await AsyncStorage.getItem('aab_prahari_register_cache');
      console.log(cachedResponse)
      if (cachedResponse && JSON.parse(cachedResponse).email) {
        console.log("check passed")
        const parsedCachedResponse = JSON.parse(cachedResponse);
        if (parsedCachedResponse['active']=="TRUE"){
          setuser_id(parsedCachedResponse['userid']);
          setShowRegisterForm(false);
        }
        else{
        const activeUser = parsedCachedResponse.email;
        console.log(activeUser)
        const checkemail = new FormData();
          checkemail.append('email', activeUser);
        const response = await axios.post(`${API_URL}/addappuser.php`, checkemail,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data[0])
        if (response.data[0].active=="TRUE") {
          parsedCachedResponse['active']="TRUE";
          parsedCachedResponse['user']=response.data[0].userid;
          setuser_id(response.data[0].userid);
          await AsyncStorage.setItem('aab_prahari_register_cache', JSON.stringify(parsedCachedResponse))         
          setShowRegisterForm(false); // Active user found, show main page
        } else {
          setShowRegisterForm(true); // No active user found, show register page
        }

      }
      } else {
        setShowRegisterForm(true); // No cached data found, show register page
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
      // Handle error as needed
    }
  };

  const handleSendData = async (formData) => {
    try {
      // Make the API request to update on the server
      const response = await axios.post(`${API_URL}/updatecomplaint_user.php`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Success:', response.data);
      Alert.alert('Data sent successfully');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error uploading data, please try again later');
    }
  };

  const handleSending = async (imgdata) => {
    try {
      // Make the API request to upload image to the server
      const response = await axios.post(`${API_URL}/uploadtoserver.php`, imgdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Success:', response.data);
      // Handle success response
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  // const handleSubmit = async (values) => {
  //   try {
  //     const response = await registerUser(values);
  //     Alert.alert('Success', 'Registration successful!');
  //     console.log('API Response:', response);
  //     // setShowRegisterForm(false); // Hide register form after successful registration
  //   } catch (error) {
  //     Alert.alert('Error', 'Registration failed. Please try again.');
  //     console.error('Registration Error:', error);
  //   }
  // };

  if (showRegisterForm) {
    // return <RegisterForm onSubmit={handleSubmit} style={styles.register}/>;
    return <RegisterForm style={styles.register}/>;

  }

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar backgroundColor="#390080" barStyle="light-content" />
        <Header style={styles.navcontainer} />
        <LocationComponent style={styles.coordinates} onCapture={(data) => setLocationData(data)} />
        <RadioButtonGroup style={styles.radioGroup} onCapture={(data) => setDepthData(data)} />
        <CameraComponent style='auto' onCapture={(data) => setImageData(data)} />
        {/* <NetworkInfoComponent onCapture={(data) => setNetworkData(data)} /> */}
        <SubmitButtonComponent
          imageData={imageData}
          locationData={locationData}
          // networkData={networkData}
          depthData={depthData}
          user_id={user_id}
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
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioGroup: {
    flex: 0.1,
    marginTop: 20,
    alignSelf: 'center',
  },
  Submit: {
    alignSelf: 'center',
  },
  register: {
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }
});
