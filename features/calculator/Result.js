import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform, Button, Animated, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import { TextInput } from 'react-native';
import { CheckBox, Image } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
// import CheckBox from 'react-native-check-box';
import { useNavigation } from '@react-navigation/native';
import { selectCalculator, selectCalculatorError, selectUserInfo } from './calculatorSlice';
import { useSelector, useDispatch } from 'react-redux';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { Keyboard } from 'react-native';
const { width } = Dimensions.get('window');


const App = () => {
  const userBoy = "rocky";
  const [showText, setShowText] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [isChecked, setIsChecked] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const navigation = useNavigation();
  const [selectedFuel, setSelectedFuel] = useState("");

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [isFocus, setIsFocus] = useState(false);

  const fuelTypes = [
    { label: 'Petrol', value: 'petrol' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Ethanol', value: 'ethanol' },
    { label: 'Electric', value: 'electric' },
  ];
    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
      });
    
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

  // CO2 Emission Data (kg)
  const fuelEmissions = {
    petrol: 200,
    diesel: 180,
    ethanol: 100,
    electric: 0,
  };


  const animationRef = useRef(null);
  const translateX = useRef(new Animated.Value(-200)).current; // Starting position off-screen
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(translateX, {
      toValue: width,
      duration: 5000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start(() => {
      setShowText(true); // Show text after animation completes


      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const handleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const result = useSelector(selectCalculator);
  // const result = {
  //   co2Emission : 4545
  // }
  const resulterror = useSelector(selectCalculatorError);


  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  };

  const html = `      
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of CO2 Emission</title>
    <style>
        @font-face {
            font-family: 'Magnolia Script';
            src: url('MagnoliaScript.ttf') format('truetype');
        }

        body {
            font-family: 'Playfair Display', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8f9fa;
            margin: 0;
        }

        .certificate {
            border: 10px solid #D4AF37;
            padding: 30px;
            width: 700px;
            text-align: center;
            background-color: #fff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            position: relative;
            background: url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png');
        }

        .certificate h1 {
            font-size: 36px;
            margin-bottom: 20px;
            font-style: italic;
            font-family: 'Magnolia Script', cursive;
            color: #D4AF37;
        }

        .certificate p {
            font-size: 18px;
            margin: 10px 0;
        }

        .certificate .highlight {
            font-weight: bold;
            color: #2c3e50;
        }

        .top-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .top-section p {
            margin: 0;
            font-size: 16px;
        }

        .logos {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }

        .logos-left,
        .logos-right {
            display: flex;
            flex-direction: column;
        }

        .logos-left a img {
            height: 20px;
            margin-bottom: 5px;
        }

        .logos-right img {
            height: 60px;
            width: 60px;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        .info-section p {
            text-align: left;
            margin: 5px 0;
            font-size: 7px;
        }

        .signature-section {
            margin-top: 40px;
            text-align: right;
        }

        .signature-line {
            margin-top: 20px;
            border-top: 1px solid #000;
            width: 250px;
            margin-left: auto;
            margin-right: 0;
        }

        .issuer-section {
            margin-top: 40px;
            text-align: center;
        }
    </style>
 
</head>

<body>
    <div class="certificate">
        <div class="logos">
            <div class="logos-left">
                <a target="blank" href="https://dpiit.gov.in" class="logo nonsticky" data-page="home-page">
                    <img src="https://github.com/nitish1899/Image/blob/main/DPIIT-1719464112334.png?raw=true"
                        alt="DPIIT Logo">
                </a>
                <a href="https://www.startupindia.gov.in" class="logo nonsticky" data-page="home-page">
                    <img src="https://github.com/nitish1899/Image/blob/main/Logo1.png?raw=true"
                        alt="Startup India Logo">
                </a>
            </div>
            <div class="logos-right">
                <img src="	https://raw.githubusercontent.com/nitish1899/Image/main/pureprukriti.png
                " alt="TSIL Logo">
            </div>
        </div>
        <div class="top-section">
            <p>Certificate Number: <span class="highlight" id="certificateNumber">${result && result.certificateNumber}</span></p>
            <p>Date: <span class="highlight" id="date">${result && result.certificateIssueDate}</span></p>
        </div>
        <h1>Certificate of CO2 Emission</h1>
        <p>This is to certify that the vehicle owned/hired by</p>
        <p class="highlight" id="vehicleOwner">${userInfo ? userInfo.userName : "Name"}</p>
        <p>with vehicle number</p>
        <p class="highlight" id="vehicleNumber">${result && result.vehicleNumber}</p>
        <p>has emitted</p>
        <p><span class="highlight" id="co2Emission">${result && (result.co2Emission / 1000).toFixed(1)}</span> unit CO2</p>

        <div class="signature-section">
            <img src="https://raw.githubusercontent.com/nitish1899/Image/main/sign1.png" alt="Signature"  height="50" width="200">
            <p>Authorized Signature</p>
        </div>

        <div class="issuer-section">
            <p>Issued by:</p>
            <p class="highlight">Transvue Solution India Pvt. Ltd.</p>
        </div>

        <div style="display: flex;">
            <div class="info-section">
                <p>* The above result is based on user input.</p>
                <p>* Additional details are based on US/UK research.</p> 
            </div>
            <div class="time-section" style="margin-left: auto;" style="margin-right: 1px;">
                <p>Time: <span class="highlight" id="time">${new Date().toLocaleTimeString()}</span></p>
            </div>
        </div>
    </div>
       <script>
        window.onload = function() {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = now.toLocaleDateString('en-US', options);
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            document.getElementById('date').innerText = dateStr;
            document.getElementById('time').innerText = timeStr;
        };
    </script>
</body>

</html>
        `;
  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html });
    // console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };



  return (
    <View style={styles.mainContainer}>
          <ImageBackground
             source={require('../../assets/images/Pure Prakriti bg img.jpg')}
             resizeMode="cover"
             style={styles.imageBackground}
           >
      
         <View style={styles.overlay} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Your Stats</Text>
        </View>
        
        
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>

              <View style={styles.formWrapper}>

              <Animated.View style={[styles.animatedView, { transform: [{ translateX }] }]}>
                <View style={styles.container}>
                  <LottieView
                    ref={animationRef}
                    source={require('../../assets/images/animation.json')}
                    autoPlay
                    loop={false}
                    style={{ width: 320, height: 300 }}
                  />
                </View>
              </Animated.View>
              {showText && 
               <Animated.View
               style={[
                 {
                   opacity: fadeAnim, // Fade effect
                   transform: [
                     {
                       translateY: fadeAnim.interpolate({
                         inputRange: [0, 1],
                         outputRange: [0, 0], // Slide-up effect
                       }),
                     },
                   ],
                 },
               ]}
               className="absolute w-[100%] shadow-lg  flex items-center justify-center"
             >
          <View style={styles.card}>
        <Text style={styles.title}>Total Carbon Footprint</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{result && result.co2Emission} kg</Text>
          <Text style={styles.equivalent}>Equivalent to</Text>
          <Text style={styles.unit}>{result && (result.co2Emission / 1000).toFixed(1)} unit</Text>
        </View>
        <Text style={styles.plantText}>
          Plant <Text style={styles.highlight}> {result && (Math.ceil(result.co2Emission / 1000)) * 12} trees</Text> 🌳 to offset for your CO2 Footprint
        </Text>
        <View
      style={{
        position: "absolute",
        bottom: 1,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={print} style={{ marginRight: 10 }}>
        <Ionicons name="print-outline" size={30} color="#4CAF50" />
      </TouchableOpacity>
      <TouchableOpacity onPress={printToFile}>
        <Ionicons name="share-social-outline" size={30} color="#2196F3" />
      </TouchableOpacity>
    </View>
      </View>


             </Animated.View>}
            </View>

              <View className="m-10  w-[80%]">

                        {/* Fuel Type Selection */}
        <Text className="text-lg font-semibold mt-6 mb-2">
          Compare your CO2 emissions:
        </Text>
        <View className="border rounded-lg bg-white shadow-md">
   

          <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#007BFF' }]}
        data={fuelTypes}
        labelField="label"
        valueField="value"
        placeholder="Select Fuel type"
        value={selectedFuel}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => setSelectedFuel(item.value)}
        renderItem={(item, index) => (
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
            {index < fuelTypes.length - 1 && <View style={styles.separator} />} 
          </View>
        )}
      />

        </View>

        {/* Conditional CO2 Footprint Result */}
        {selectedFuel !== "" && (
          <ImageBackground
          source={require("../../assets/images/forest.jpg")}
            className="mt-6 p-4 rounded-lg overflow-hidden shadow-md"
            resizeMode="cover"
          >
            <View className=" bg-opacity-50 p-4 rounded-lg">
              <Text className="text-white text-md">Your Carbon Footprint: 200kg</Text>
              <Text className="text-white text-lg font-bold mt-2">
                Your Carbon Footprint, if you Used {selectedFuel.charAt(0).toUpperCase() + selectedFuel.slice(1)}:{" "}
                {fuelEmissions[selectedFuel]}kg
              </Text>
            </View>
          </ImageBackground>
        )}
            </View>
          </ScrollView>

        </KeyboardAvoidingView>

        {!isKeyboardVisible && (
  <View style={styles.footerContainer}>
    <Image
      source={require('../../assets/images/mantra.jpg')}
      style={styles.footerImage1}
    />
    <Image
      source={require('../../assets/images/make-in-India-logo.jpg')}
      style={styles.footerImage2}
    />
  </View>
)}
      </ImageBackground>
    </View>
  )
};

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
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
  },
  formWrapper: {
    marginTop: 10,
    width: '100%',
  
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247, 238, 243, 0.6)', 
  },
  animatedView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 380,
    height: 350,
  },
  card: {
    backgroundColor: '#006400',
    margin: 50,
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  equivalent: {
    fontSize: 16,
    color: '#FFF',
  },
  unit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  plantText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  dropdown: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 9,
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    // marginHorizontal: 0,
  },


});

export default App;