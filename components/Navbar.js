import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native';

export default function Header() {
    return (
        <ImageBackground
            source={require("../assets/floods.jpeg")} 
            style={styles.container}
            resizeMode='cover'
        >
            <View style={styles.overlay}>
                <Text style={styles.text}>Let's Report Flooding</Text>
                <Image
                    source={require("../assets/logo.png")}
                    style={styles.image}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 120, // Adjust the height as per your design
        justifyContent: 'center', // Center content vertically

    },
    overlay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10, // Adjust padding as needed
        paddingTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a dark overlay for better text visibility
        height: '100%',

    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});
