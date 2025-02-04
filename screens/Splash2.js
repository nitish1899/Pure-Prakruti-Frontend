import React from "react";
import {
  ImageBackground, StyleSheet, KeyboardAvoidingView,
  ScrollView, Text, View, Image
} from "react-native";

export default function App() {
  return (
    <View style={styles.mainContainer}>

      <ImageBackground
        source={require('../assets/images/Pure Prakriti bg img.jpg')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Welcome</Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView>

            <View className="flex items-center mt-[80px]">
              <Text className="text-black text-2xl w-[118px] h-[41px] ">About Us</Text>
              <Text className="text-black w-[301px] h-[194px] mt-[30px]">
                Since 1956, Transvue Solution India Pvt. Ltd. has been a market leader
                in logistics.Moving cargo across India within various states has its
                own unforeseen challenges.Over 66 years of intensive, accurate,
                efficient, innovative, and dedicated operations have earned TWI a
                prestigious reputation in the domestic inland transportation industry.
                Our extensive network covers not only over 100 locations spread all
                over India but also neighbouring countries like Nepal, Bangladesh, and
                Bhutan.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.footerContainer}>
          <Image
            source={require('../assets/images/mantra.jpg')}
            style={styles.footerImage1}
          />
          <Image
            source={require('../assets/images/make-in-India-logo.jpg')}
            style={styles.footerImage2}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    height: '15%',
    backgroundColor: '#006400',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 40,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 120,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
    width: '100%',
  },
  footerImage1: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
  },
  footerImage2: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire ImageBackground
    backgroundColor: 'rgba(247, 238, 243, 0.6)', // Adjust color and opacity
  },
});
