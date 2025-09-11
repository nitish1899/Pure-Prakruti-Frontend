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
  const [fuelType, setFuelType] = useState("diesel");
const [co2Saved, setCo2Saved] = useState(0);


    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

// sample emission factors (kg CO₂ per unit fuel) 
const emissionFactors = {
  petrol: 2.68,
  diesel: 2.23,
  ethanol: 1.5,
  electric: 0.0 
};

useEffect(() => {
  if (result && result.co2Emission) {
    // diesel ko base reference fuel maana gaya hai
    const currentEmission = result.co2Emission;

    // alternative fuel emission nikalna
    const altEmission =
      (currentEmission / emissionFactors["diesel"]) *
      emissionFactors[fuelType];

    // kitna CO₂ bacha uska difference
    setCo2Saved((currentEmission - altEmission).toFixed(2));
  }
}, [fuelType, result]);

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
  const recommendedTrees = result ? Math.ceil(result.co2Emission / 1000) * 12 : 0; 
  const html = `      
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of CO₂ Emission</title>
  <style>
    @page {
      size: A4; /* Full page A4 */
      margin: 0;
    }

body {
  margin: 0;
  padding: 0;
}

.page {
  width: 210mm;
  height: 297mm;
  background: #f7f7f7; /* background now applies in PDF */
  display: flex;
  justify-content: center;
  align-items: center;
}

    .certificate {
      position: relative;
      width: 210mm;
      height: 297mm; /* A4 fixed */
      margin: auto;
      background: #fff;
      border: 20px solid #0d47a1; /* outer frame */
      box-sizing: border-box;
      padding: 60px 50px 120px 50px; /* bottom padding to leave space for footer */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* HEADER */
    .header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      margin-bottom: 20px;
    }

    .header .left {
      font-size: 14px;
      text-align: left;
    }

    .header .center img {
      height: 120px;
    }

    .header .right {
      text-align: right;
    }

    .header .right img {
      display: block;
      margin: 8px auto;
    }

    /* TITLE */
    .certificate-heading {
      text-align: center;
      margin: 20px 0;
    }

    .certificate-heading h1 {
      font-size: 32px;
      color: #0d47a1;
      margin: 0;
      text-transform: uppercase;
      border-bottom: 2px solid #0d47a1;
      display: inline-block;
      padding-bottom: 5px;
    }

    .certificate-heading h2 {
      font-size: 20px;
      color: #444;
      margin: 10px 0 30px;
      letter-spacing: 1px;
    }

    /* CONTENT */
    .certificate-body {
      flex-grow: 1;
      text-align: center;
    }

    .certificate-body p {
      font-size: 18px;
      line-height: 1.7;
    }

    .highlight {
      color: #002060;
      font-weight: bold;
    }

    /* DATE SECTION */
    .details {
      display: flex;
      justify-content: center;
      gap: 120px;
      margin-bottom: 30px;
    }

    .detail-item {
      text-align: center;
    }

    .date {
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid #c0a060;
      padding-bottom: 3px;
      margin-bottom: 5px;
    }

    .label {
      font-size: 12px;
      font-weight: bold;
      color: #003366;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* FOOTER FIXED */
    .footer {
      position: absolute;
      bottom: 40px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .signature {
      text-align: center;
      font-size: 14px;
    }

    .signature img {
      height: 60px;
      margin-bottom: 5px;
    }

    .issuer {
      text-align: right;
      font-size: 16px;
      font-weight: bold;
      color: #0d47a1;
    }

    .date-section {
      text-align: right;
      font-size: 14px;
      margin-top: 10px;
    }

  </style>
</head>

<body>
<div class="page">
  <div class="certificate">
    <!-- HEADER -->
    <div class="header">
      <div class="left">
        <p><strong>CERTIFICATE NO:</strong><br>
          <span class="highlight" id="certificateNumber">${result && result.certificateNumber}</span>
        </p>
      </div>
      <div class="center">
        <img
          src="https://raw.githubusercontent.com/jagdish97897/exchange-backend/refs/heads/main/141237_a99dc7bf9310471cb7b315bf6b1f13ae%7Emv2.avif"
          alt="DPIIT Logo" style="height:280px;">
      </div>
 <!-- Right Section -->
      <div class="right" style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <img src="https://raw.githubusercontent.com/nitish1899/Image/main/pureprukriti.png" alt="TSIL Logo"
          style="height:120px; display:block; align-items:center margin-bottom:10px;">
        <img src="https://github.com/nitish1899/Image/blob/main/Logo1.png?raw=true" alt="Startup India Logo"
          style="height:25px;">
      </div>
    </div>
<!-- Certificate Heading -->
<div class="certificate-heading">
  <h1>Green Certificate</h1>
  <h2>CO₂ Emission Certification</h2>
</div>

<div class="certificate-body">
  <p>This is to certify that <span class="highlight" id="vehicleOwner">${userInfo ? userInfo.userName : "Name"}</span>, 
     with vehicle number <span class="highlight" id="vehicleNumber">${result && result.vehicleNumber}</span>, 
     has emitted <span class="highlight" id="co2Emission">${result && (result.co2Emission / 1000).toFixed(1)}</span> unit CO₂.</p>

       <p>As part of our commitment to sustainability, it is recommended to offset this footprint by planting <span style="color:green; font-weight:bold;">${result ? Math.ceil((result.co2Emission / 1000) * 12) : '...'}</span> 🌳.</p>
</div>


      <div class="details">
        <div class="detail-item">
          <p class="date">${result && result.certificateIssueDate}</p>
          <p class="label">Date of Issue</p>
        </div>
        <div class="detail-item">
          <p class="date">31-12-2030</p>
          <p class="label">Valid Upto</p>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="signature">
        <img src="https://raw.githubusercontent.com/nitish1899/Image/main/sign1.png" alt="Signature">
        <p>Authorized Signature</p>
      </div>
      <div class="issuer">
        Issued by:<br>
        <span>Transvue Solution India Pvt. Ltd.</span>
        <div class="date-section">
          Time: <span class="highlight" id="time">${new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  </div>
  </div>
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
    <Text style={styles.value}>
      {result && result.co2Emission} kg
    </Text>
    <Text style={styles.equivalent}>Equivalent to</Text>
    <Text style={styles.unit}>
      {result && (result.co2Emission / 1000).toFixed(1)} unit
    </Text>
  </View>

  <Text style={styles.plantText}>
    Plant
    <Text style={styles.highlight}>
      {" "}
      {`${result ? Math.ceil((result.co2Emission / 1000) * 12) : '...'}`} trees
    </Text>{" "}
    🌳 to offset your CO2 Footprint
  </Text>

  {/* Buttons placed in normal flow at bottom */}
  <View style={styles.actionRow}>
    <TouchableOpacity onPress={print} style={{ marginRight: 20 }}>
      <Ionicons name="print-outline" size={28} color="#4CAF50" />
    </TouchableOpacity>
    <TouchableOpacity onPress={printToFile}>
      <Ionicons name="share-social-outline" size={28} color="#2196F3" />
    </TouchableOpacity>
  </View>
</View>


             </Animated.View>}
            </View>


<View className="mt-8 w-72 bg-white rounded-2xl shadow-lg p-4 items-center self-center">
  <Text className="text-xl font-bold text-gray-800 mb-3 text-center">
    Saving CO₂ with alternate fuel type
  </Text>
  <View className="w-full border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
    <Picker
      selectedValue={fuelType}
      onValueChange={(itemValue) => setFuelType(itemValue)}
      style={{ height: 50, width: "100%" }}
    >
      <Picker.Item label="Petrol" value="petrol" />
      <Picker.Item label="Diesel" value="diesel" />
      <Picker.Item label="Ethanol" value="ethanol" />
      <Picker.Item label="Electric" value="electric" />
    </Picker>
  </View>
</View>


<ImageBackground
  source={require("../../assets/images/forest.jpg")}
  className="mt-6 p-4 rounded-lg overflow-hidden shadow-md"
  resizeMode="cover"
  blurRadius={5} // 👈 blur apply
>
  <View className="bg-black bg-opacity-30 flex-1 justify-center p-5 rounded-2xl">
    {fuelType === "petrol" && co2Saved < 0 ? (
      <Text className="text-red-200 font-medium text-center">
        Using petrol may release more CO₂ compared to diesel.  
        We recommend exploring other eco-friendly fuel options.  
      </Text>
    ) : (
      <Text className="text-white font-semibold text-center">
        You have saved {co2Saved} kg of CO₂ by using {fuelType}.  
        Thank you for contributing towards a greener planet! 🌍  
      </Text>
    )}
  </View>
</ImageBackground>



          </ScrollView>

        </KeyboardAvoidingView>

        {!isKeyboardVisible && (
  <View style={styles.footerContainer}>
    <Image
      source={require('../../assets/images/mantra.jpg')}
      style={styles.footerImage1}
    />
    <Image
      source={require('../../assets/images/make-in-India-logo.png')}
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
    backgroundColor: "#f5f7fa",
  },
  imageBackground: {
    flex: 1,
    alignItems: "center",
  },

  // ✅ Header (curved with shadow)
  headerContainer: {
    width: "100%",
    height: "15%",
    backgroundColor: "#006400",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // ✅ Overlay tint
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(247, 238, 243, 0.6)",
  },

  formContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  formWrapper: {
    marginTop: 10,
    width: "100%",
  },

  // ✅ Lottie + Animation wrapper
  animatedView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 320,
    height: 300,
  },

 card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  valueContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 6,
  },
  equivalent: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  unit: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2196F3",
  },
  plantText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginTop: 15,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: "bold",
    color: "#FF5722",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  // ✅ Dropdown (modern neumorphic)
  dropdown: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemContainer: {
    padding: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
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
    width: 70,
    height: 60,
    resizeMode: 'contain',
  },
});


export default App;
