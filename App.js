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
import { ScrollView, StyleSheet, View, SafeAreaView, Alert, Text, Button, Linking, Pressable } from 'react-native';
import Header from './components/Navbar';
import LocationComponent from './components/Location';
import RadioButtonGroup from './components/Waterlevel';
import CameraComponent from './components/Camera';
// import NetworkInfoComponent from './components/Netinfo';
import SubmitButtonComponent from './components/Submit';
import RegisterForm from './components/RegisterForm'; // Assuming you have a RegisterForm component
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { formToJSON } from 'axios';
import * as Updates from 'expo-updates';
import Modal from 'react-native-modal';



const API_URL = 'https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari'; // Adjust as needed

export default function App() {
  const [imageData, setImageData] = useState();
  const [locationData, setLocationData] = useState('');
  const [depthData, setDepthData] = useState(null);
  // const [networkData, setNetworkData] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [user_id, setuser_id] = useState(null);
  const [user, setUser] = useState();
  const [submission, setsubmission] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkCachedUser();
  }, []);


  const handleCloseModal = () => {
    setModalVisible(false);
  };

  
  const checkCachedUser = async () => {
    try {
      const cachedResponse = await AsyncStorage.getItem('aab_prahari_register_cache');
      console.log(cachedResponse)
      if (cachedResponse && JSON.parse(cachedResponse).email) {
        // console.log("check passed")
        const parsedCachedResponse = JSON.parse(cachedResponse);
        if (parsedCachedResponse['active']=="TRUE"){
          setuser_id(parsedCachedResponse['userid']);
          setUser(parsedCachedResponse["name"]);
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
          setUser(parsedCachedResponse["name"]);
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
      setsubmission(true);
      // Alert.alert('Thankyou for your contribution.');
      setModalVisible(true);
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

  const SignOut = async () => {
    try {
      const cachedResponse = await AsyncStorage.getItem('aab_prahari_register_cache');
      const parsedCachedResponse = JSON.parse(cachedResponse);
      parsedCachedResponse['active']="FALSE";
      await AsyncStorage.setItem('aab_prahari_register_cache', JSON.stringify(parsedCachedResponse)) 
      await Updates.reloadAsync();
      console.log('Success:', "Signed-out Successfully");
      }
    catch (error) {
      console.error('Error:', error);
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

  const handlePress = (DATABHEJO) => {
    if (!locationData) {
      Alert.alert("Please enable location services to get the reporting area location");
    } else if (!depthData) {
      Alert.alert("Please provide water depth details");
    } else {
      handleSendData(DATABHEJO[0]);
      handleSending(DATABHEJO[1]);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar backgroundColor="#390080" barStyle="light-content" />
        <Header style={styles.navcontainer} />
        <View style={styles.userspecs}>
          <Text style={styles.text}>Welcome {user}</Text>
          <Button title="Sign Out" onPress={SignOut} color="red" />
        </View>
        <View style={styles.horizontalLine} />
        <LocationComponent style={styles.coordinates} onCapture={(data) => setLocationData(data)} />
        <RadioButtonGroup style={styles.radioGroup} onCapture={(data) => setDepthData(data)} />
        <CameraComponent style={styles.cam} onCapture={(data) => setImageData(data)} />
        {/* <NetworkInfoComponent onCapture={(data) => setNetworkData(data)} /> */}
        <SubmitButtonComponent
          imageData={imageData}
          locationData={locationData}
          // networkData={networkData}
          depthData={depthData}
          user_id={user_id}
          // onPress={(DATABHEJO) => {
          //   handleSendData(DATABHEJO[0]);
          //   handleSending(DATABHEJO[1]);
          // }}
          onPress={(DATABHEJO) => {
            handlePress(DATABHEJO)
          }}
          style={styles.Submit}
        />

      <Modal isVisible={isModalVisible} onBackdropPress={handleCloseModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modaltext}>Thankyou for your contribution.{"\n"}For more information{" "} 
          <Text
            onPress={() => Linking.openURL('https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/showwaterlogging.html')}
            style={styles.link2}
          >
            click here.
          </Text></Text>
          <Pressable onPress={handleCloseModal} style={styles.modalbutton}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
          {/* <Button title="Close" onPress={handleCloseModal} /> */}
        </View>
      </Modal>


        {submission ? (
        <View style={styles.success}>
          <Text>Submitted successfully</Text>
          <Text onPress={() => Linking.openURL('https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/showwaterlogging.html')} style={styles.link}>
            Click here to view
          </Text>
        </View> ) : null}
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
    marginTop: 0
  },
  register: {
    alignSelf: 'center',
    alignContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  userspecs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  text:{
    fontSize: 17,
    fontWeight: "bold",
    color: "blue"
  },
  // textContainer: {
  //   flexDirection: 'row',
  //   alignItems: "centre"
  // },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1.3,
    width: '95%',
    alignSelf: "center"
  },
  success:{
    marginTop: 10,
    alignContent: 'center',
    alignItems: "center"
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  link2: {
    color: 'yellow',
    textDecorationLine: 'underline',
  },
  modaltext:{
    fontWeight: "bold",
    color: "white"
  },
  cam: {
    marginVertical: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalbutton: {
    backgroundColor: 'black', // Optional: Add a background color
    padding: 5,
    marginTop: 15,
    borderRadius: 5,
    shadowColor: 'white', // Shadow color (black)
    shadowOffset: { width: 0, height: 1 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity (a number between 0 and 1)
    shadowRadius: 3, // Shadow radius (blur radius)
  }
});
