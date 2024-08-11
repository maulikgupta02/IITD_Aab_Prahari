// // RegisterForm.js
// import React from 'react';
// import { View, TextInput, Button, StyleSheet } from 'react-native';
// import { Formik } from 'formik';

// const RegisterForm = ({ onSubmit }) => {
//   return (
//     <Formik
//       initialValues={{ name: '', email: '', mobile: '' }}
//       onSubmit={onSubmit}
//     >
//       {({ handleChange, handleBlur, handleSubmit, values }) => (
//         <View style={styles.formContainer}>
//           <TextInput
//             placeholder="Name"
//             onChangeText={handleChange('name')}
//             onBlur={handleBlur('name')}
//             value={values.name}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Email"
//             onChangeText={handleChange('email')}
//             onBlur={handleBlur('email')}
//             value={values.email}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Mobile"
//             onChangeText={handleChange('mobile')}
//             onBlur={handleBlur('mobile')}
//             value={values.mobile}
//             style={styles.input}
//           />
//           <Button title="Register" onPress={handleSubmit} />
//         </View>
//       )}
//     </Formik>
//   );
// };

// const styles = StyleSheet.create({
//   formContainer: {
//     padding: 20,
//     width: '70%',
//   },
//   input: {
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//   },
// });

// export default RegisterForm;


import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {ScrollView, SafeAreaView, View, TextInput, Button, StyleSheet, Alert, Linking, Text, TouchableOpacity } from 'react-native';
import Header from './Navbar';
import { Formik } from 'formik';
import axios from 'axios'; // Import axios for HTTP requests
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';
import Icon from 'react-native-vector-icons/MaterialIcons';

FormData.prototype[Symbol.toStringTag] = 'FormData';


const API_URL = 'https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/addappuser.php'; // Replace with your actual API endpoint

const RegisterForm = () => {
  const handleSubmit = async (values) => {
    try {
      // Construct FormData object
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      // formData.append('mobile', values.mobile);

      // Send HTTP POST request using axios
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Registration Response:', response.data);
      await AsyncStorage.setItem('aab_prahari_register_cache', JSON.stringify({"name":values.name,"email":values.email,"mobile":values.mobile,"active":"FALSE","user":""}))
      // Handle success
      Alert.alert('Success', 'Registration link sent to your email');
    } catch (error) {
      // Handle error
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Failure: Please try again');
    }
  };

  const checkStatus = async () => {
    try {
      const cachedResponse = await AsyncStorage.getItem('aab_prahari_register_cache');
      const parsedCachedResponse = JSON.parse(cachedResponse);
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
        await AsyncStorage.setItem('aab_prahari_register_cache', JSON.stringify(parsedCachedResponse)) 
        await Updates.reloadAsync();
      }
      else{
        Alert.alert('Account not activated', 'Click the activation link on '+activeUser)
      }
    }
      catch (error) {
        // Handle error
        console.error('No credentials entered:', error);
        Alert.alert('Error', 'Please enter your credentials')
      }
    };

    const handleEmailPress = () => {
      const email = 'swmmiitd@gmail.com';
      const subject = '';
      const body = '';
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
      Linking.openURL(mailtoUrl).catch(err => console.error('Error opening email:', err));
    };

  return (
    <SafeAreaView style={styles.body}>
      <StatusBar backgroundColor="#390080" barStyle="light-content" />
      <Header style={styles.navcontainer} />
      <View style={styles.container}>
      <View style ={styles.form}>
    <Formik
      initialValues={{ name: '', email: '', mobile: '' }}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (


        <View style={styles.formContainer}>
          <TextInput
            placeholder="Username"
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            style={styles.input}
          />
          <View style={styles.buttonContainer1}>
          <Button title="Register" onPress={handleSubmit} color="blue"/>
          </View>
          <View style={styles.buttonContainer2}>
          <Button title="Check Account Status" onPress={checkStatus} color="#006400"/>
          </View>
        </View>
      )}
    </Formik>
    </View>
    {/* <View style={styles.contact}>
          <Text style={styles.emailText}>To view our account deletion policy, please visit the following link:{" "}
          <Text
            onPress={() => Linking.openURL('https://jalsuraksha.iitd.ac.in/Account_Deletion_Policy.html')}
            style={styles.link2}
          >
            https://jalsuraksha.iitd.ac.in/Account_Deletion_Policy.html
          </Text>
          </Text>
        </View> */}
        </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   formContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   input: {
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#A9A9A9',
//     borderRadius: 4,
//     width: '100%',
//   },
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
//   buttonContainer2: {
//     borderWidth: 1,
//     borderColor: '#006400', // Border color
//     borderRadius: 12,
//     overflow: 'hidden', // Ensures the border radius is applied correctly
//     backgroundColor:"#90EE90",
//     width:"70%",
//     marginTop: 10
//   },
//   buttonContainer1: {
//     borderWidth: 1,
//     borderColor: 'blue', // Border color
//     borderRadius: 12,
//     overflow: 'hidden', // Ensures the border radius is applied correctly
//     backgroundColor:"#ADD8E6",
//     width:"70%",
//     marginTop: 20
//   },
//   contact:{
//     alignItems: "center",
//     bottom:20,
//     fontStyle: "italic"
//   },
//   form: {
//     marginTop: 30,
//     paddingVertical: 0,
//     top: 30
//   },
//   contactmail:{
//     flexDirection: "row",
//     paddingTop: 1,
//     marginTop:1
//   }
// });



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  link2: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  formContainer: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 4,
    width: '100%',
  },
  body: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  navcontainer: {
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer2: {
    borderWidth: 1,
    borderColor: '#006400', // Border color
    borderRadius: 12,
    overflow: 'hidden', // Ensures the border radius is applied correctly
    backgroundColor: "#90EE90",
    width: '100%',
    marginTop: 10,
  },
  buttonContainer1: {
    borderWidth: 1,
    borderColor: 'blue', // Border color
    borderRadius: 12,
    overflow: 'hidden', // Ensures the border radius is applied correctly
    backgroundColor: "#ADD8E6",
    width: '100%',
    marginTop: 20,
  },
  contact: {
    padding: 15,
    alignItems: 'center',
    alignContent: "center",
    alignSelf: "center"
  },
  contactText: {
    fontSize: 10,
    fontStyle: 'italic',
    alignItems: 'center',
    alignContent: "center",
    alignSelf: "center",
  },
  contactmail: {
    marginTop: 3
  },
  emailText: {
    fontSize: 10,
    fontStyle: 'italic',
    alignItems: 'center',
    alignContent: "center",
    alignSelf: "center"
  },
  form: {
    paddingVertical: 0,
    alignItems: 'center',
  },
});

export default RegisterForm;
