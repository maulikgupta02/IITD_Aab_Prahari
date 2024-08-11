// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Platform } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';

// const NetworkInfoComponent = ({ onCapture }) => {
//   const [networkInfo, setNetworkInfo] = useState(null);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

//     // Initial fetch
//     NetInfo.fetch().then(state => {
//       setNetworkInfo(state);
//       onCapture(state); // Capture initial network state
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleConnectivityChange = (state) => {
//     setNetworkInfo(state);
//     onCapture(state); // Capture network state change
//   };

//   // return (
//   //   console.log(networkInfo)
//   //   // <View style={styles.container}>
//   //   //   <Text style={styles.label}>Network Info:</Text>
//   //   //   <Text>{JSON.stringify(networkInfo, null, 2)}</Text>
//   //   // </View>
//   // );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
// });

// export default NetworkInfoComponent;
