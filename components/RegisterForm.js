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
import {ScrollView, SafeAreaView, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Header from './Navbar';
import { Formik } from 'formik';
import axios from 'axios'; // Import axios for HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'https://jalsuraksha.iitd.ac.in/barapullah/aab_prahari/addappuser.php'; // Replace with your actual API endpoint

const RegisterForm = () => {
  const handleSubmit = async (values) => {
    try {
      // Construct FormData object
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);

      // Send HTTP POST request using axios
      const response = await axios.post(API_URL, formData);
      console.log('Registration Response:', response.data);
      await AsyncStorage.setItem('aab_prahari_register_cache', JSON.stringify({"name":values.name,"email":values.email,"mobile":values.mobile,"active":"FALSE","user":""}))
      // Handle success
      Alert.alert('Success', 'Mail with registeration link sent to your email');
    } catch (error) {
      // Handle error
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Failure: Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.body}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor="#390080" barStyle="light-content" />
      <Header style={styles.navcontainer} />
    <Formik
      initialValues={{ name: '', email: '', mobile: '' }}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (


        <View style={styles.formContainer}>
          <TextInput
            placeholder="Name"
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
          <TextInput
            placeholder="Mobile"
            onChangeText={handleChange('mobile')}
            onBlur={handleBlur('mobile')}
            value={values.mobile}
            style={styles.input}
          />
          <Button title="Register" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: '100%',
  },
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
});

export default RegisterForm;
