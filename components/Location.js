import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function LocationComponent({onCapture}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission access denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
      // console.log([location,address]);
      // onCapture([location,address]);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // console.log(reverseGeocode)

      try {
        // console.log(reverseGeocode);
        setAddress(reverseGeocode[0].name + ', ' + reverseGeocode[0].street + ', ' + reverseGeocode[0].district + ', ' + reverseGeocode[0].postalCode + ', ' + reverseGeocode[0].region + ', ' + reverseGeocode[0].city + ', ' + reverseGeocode[0].country);
      }
      catch{
        
      }
      onCapture([location,address]);
    })();
  }, []);

  const refreshLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
    // console.log([location,address]);
    // onCapture([location,address]);

    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // console.log(reverseGeocode)

    try {
      // console.log(reverseGeocode);
      setAddress(reverseGeocode[0].name + ', ' + reverseGeocode[0].street + ', ' + reverseGeocode[0].district + ', ' + reverseGeocode[0].postalCode + ', ' + reverseGeocode[0].region + ', ' + reverseGeocode[0].city + ', ' + reverseGeocode[0].country);
    }
    catch{

    }
    onCapture([location,address]);


  };

  return (
    <View style={styles.loccontainer}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <>
          <View style={styles.row}>
            <Text>Address: </Text>
            <TextInput
              style={[styles.textbox_add, styles.flex]}
              editable={true}
              multiline={true}
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />
            <Button title="Refresh" onPress={refreshLocation} />
          </View>
          <View style={styles.row}>
            <Text>Latitude: </Text>
            <TextInput
              style={styles.textbox_cords}
              editable={false}
              value={latitude}
            />
            <Text>Longitude: </Text>
            <TextInput
              style={styles.textbox_cords}
              editable={false}
              value={longitude}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loccontainer: {
    flexDirection: 'column',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textbox_add: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1,
    // flexWrap: 'wrap',
    // overflow: 'scroll',
    minHeight:20,
    maxHeight:40,
    height:'auto'
  },
  textbox_cords: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    padding: 10,
    flex: 1,
  },
  flex: {
    flex: 1,
    marginRight: 10,
  },
});
