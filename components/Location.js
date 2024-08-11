import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import * as Updates from 'expo-updates';

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
        setErrorMsg('Please enable location services');
        return ;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLatitude(location.coords.latitude.toString());
        setLongitude(location.coords.longitude.toString());

        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const formattedAddress = `${reverseGeocode[0].name}, ${reverseGeocode[0].district}, ${reverseGeocode[0].postalCode}, ${reverseGeocode[0].region}, ${reverseGeocode[0].city}, ${reverseGeocode[0].country}`;
        setAddress(formattedAddress);
        console.log(formattedAddress);
        onCapture([location, formattedAddress]);
      } catch (error) {
        console.log("Unable to get address", error);
      }
    })();
  }, []);

  const refreshLocation = async () => {
    await Updates.reloadAsync();
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
            {/* <Button title="Refresh" onPress={refreshLocation} /> */}
            <TouchableOpacity onPress={refreshLocation} style={styles.REFRESH}>
              <Image
                source={require('../assets/refresh.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text>Latitude: </Text>
            <TextInput
              style={styles.textbox_cords}
              editable={false}
              value={latitude.slice(0, 7)}
            />
            <Text>Longitude: </Text>
            <TextInput
              style={styles.textbox_cords}
              editable={false}
              value={longitude.slice(0, 7)}
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
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textbox_add: {
    borderColor: 'gray',
    borderWidth: 0,
    padding: 5,
    flex: 1,
    // flexWrap: 'wrap',
    // overflow: 'scroll',
    // minHeight:20,
    // maxHeight:40,
    borderBottomWidth:1,
    height:'auto'
  },
  textbox_cords: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    padding: 5,
    flex: 1,
    borderBottomWidth: 1,
    marginHorizontal: 5
  },
  flex: {
    flex: 1,
    marginRight: 10,
  },
  image: {
    height: 50,
    width: 50,
    alignContent: "flex-start"
  }
});
