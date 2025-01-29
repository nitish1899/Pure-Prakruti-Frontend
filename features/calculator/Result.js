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
const { width } = Dimensions.get('window');

const App = () => {
  const userBoy = "rocky";
  const [showText, setShowText] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [isChecked, setIsChecked] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const navigation = useNavigation();
  const [selectedFuel, setSelectedFuel] = useState("");

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
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };



  return (
    <View className=" h-[100%] ">
      <ImageBackground source={require("../../assets/images/Pure Prakriti bg img.jpg")} resizeMode="cover" className="h-[100%] flex items-center">
      
        <View className="w-[100%] h-[15%] bg-green-700 ">
          <Text className="mt-[90px] text-2xl text-white text-center">नमस्ते  {userInfo ? userInfo.userName : "Name"}</Text>
        </View>
        
        
        <KeyboardAvoidingView className=" h-[70%] w-[100%]  ">
          <ScrollView showsVerticalScrollIndicator={false}>

              <View className=" items-center justify-center  mt-20">

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
          <Picker
            selectedValue={selectedFuel}
            onValueChange={(itemValue) => setSelectedFuel(itemValue)}
          >
            <Picker.Item label="Select Fuel type" value="" />
            <Picker.Item label="Petrol" value="petrol" />
            <Picker.Item label="Diesel" value="diesel" />
            <Picker.Item label="Ethanol" value="ethanol" />
            <Picker.Item label="Electric" value="electric" />
          </Picker>
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

        <View style={styles.container2}>
  <View style={styles.firstImageContainer}>
    <Image
      source={require("../../assets/images/mantra.jpg")}
      style={styles.firstImage}
    />
  </View>

  <View style={styles.secondImageContainer}>
    <Image
      source={require("../../assets/images/make-in-India-logo.jpg")}
      style={styles.secondImage}
    />
  </View>
</View>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 200,
    height: 250,
  },

  container1: {
    width: '80%',
    alignSelf: 'center',
  },
  buttonGap: {
    height: 8, // Adds a gap between buttons
  },
  button: {
    backgroundColor: '#004d00', // Green background
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Full width of the container
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedPrinterText: {
    textAlign: 'center',
  },
  
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // for equal spacing between items
    alignItems: 'center',
    width: '100%',

  },
  firstImageContainer: {
    width: '25%',
    marginLeft: 8, // Replaces the ml-2 from Tailwind
  },
  firstImage: {
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  secondImageContainer: {
    width: '20%',
  },
  secondImage: {
    width: 50,
    height: 40,
    aspectRatio: 100 / 28, // Actual aspect ratio of the image
    resizeMode: 'contain',

  },

  card: {
    backgroundColor: '#778899',
    margin: 60,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  equivalent: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  unit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  plantText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#228B22',
  },



});

export default App;



// import React, { useEffect, useRef, useState } from 'react';
// import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Platform, Button, Animated, Dimensions } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
// import { Formik } from 'formik';
// import { TextInput } from 'react-native';
// import { CheckBox, Image } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';
// // import CheckBox from 'react-native-check-box';
// import { useNavigation } from '@react-navigation/native';
// import { selectCalculator, selectCalculatorError, selectUserInfo } from './calculatorSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import * as Print from 'expo-print';
// import { shareAsync } from 'expo-sharing';
// import LottieView from 'lottie-react-native';
// const { width } = Dimensions.get('window');

// const App = () => {
//   const userBoy = "rocky";
//   const [showText, setShowText] = useState(false);
//   const [selectedPrinter, setSelectedPrinter] = React.useState();
//   const [isChecked, setIsChecked] = useState(false);
//   const userInfo = useSelector(selectUserInfo);
//   const navigation = useNavigation();

//   const animation = useRef(null);
//   const translateX = useRef(new Animated.Value(-200)).current; // Starting position off-screen

//   const startAnimation = () => {
//     Animated.timing(translateX, {
//       toValue: width,
//       duration: 5000, // Adjust the duration as needed
//       useNativeDriver: true,
//     }).start(() => {
//       setShowText(true); // Show text after animation completes
//     });
//   };

//   useEffect(() => {
//     startAnimation();
//   }, []);

//   const handleCheckBox = () => {
//     setIsChecked(!isChecked);
//   };

//   const result = useSelector(selectCalculator);
//   // const result = {
//   //   co2Emission : 4545
//   // }
//   const resulterror = useSelector(selectCalculatorError);


//   const print = async () => {
//     // On iOS/android prints the given html. On web prints the HTML from the current page.
//     await Print.printAsync({
//       html,
//       printerUrl: selectedPrinter?.url, // iOS only
//     });
//   };

//   const html = `      
// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Certificate of CO2 Emission</title>
//     <style>
//         @font-face {
//             font-family: 'Magnolia Script';
//             src: url('MagnoliaScript.ttf') format('truetype');
//         }

//         body {
//             font-family: 'Playfair Display', serif;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             background-color: #f8f9fa;
//             margin: 0;
//         }

//         .certificate {
//             border: 10px solid #D4AF37;
//             padding: 30px;
//             width: 700px;
//             text-align: center;
//             background-color: #fff;
//             box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
//             position: relative;
//             background: url('https://www.toptal.com/designers/subtlepatterns/patterns/symphony.png');
//         }

//         .certificate h1 {
//             font-size: 36px;
//             margin-bottom: 20px;
//             font-style: italic;
//             font-family: 'Magnolia Script', cursive;
//             color: #D4AF37;
//         }

//         .certificate p {
//             font-size: 18px;
//             margin: 10px 0;
//         }

//         .certificate .highlight {
//             font-weight: bold;
//             color: #2c3e50;
//         }

//         .top-section {
//             display: flex;
//             justify-content: space-between;
//             margin-bottom: 20px;
//         }

//         .top-section p {
//             margin: 0;
//             font-size: 16px;
//         }

//         .logos {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             margin-bottom: 10px;
//         }

//         .logos-left,
//         .logos-right {
//             display: flex;
//             flex-direction: column;
//         }

//         .logos-left a img {
//             height: 20px;
//             margin-bottom: 5px;
//         }

//         .logos-right img {
//             height: 60px;
//             width: 60px;
//             margin-right: 5px;
//             margin-bottom: 5px;
//         }

//         .info-section p {
//             text-align: left;
//             margin: 5px 0;
//             font-size: 7px;
//         }

//         .signature-section {
//             margin-top: 40px;
//             text-align: right;
//         }

//         .signature-line {
//             margin-top: 20px;
//             border-top: 1px solid #000;
//             width: 250px;
//             margin-left: auto;
//             margin-right: 0;
//         }

//         .issuer-section {
//             margin-top: 40px;
//             text-align: center;
//         }
//     </style>
 
// </head>

// <body>
//     <div class="certificate">
//         <div class="logos">
//             <div class="logos-left">
//                 <a target="blank" href="https://dpiit.gov.in" class="logo nonsticky" data-page="home-page">
//                     <img src="https://github.com/nitish1899/Image/blob/main/DPIIT-1719464112334.png?raw=true"
//                         alt="DPIIT Logo">
//                 </a>
//                 <a href="https://www.startupindia.gov.in" class="logo nonsticky" data-page="home-page">
//                     <img src="https://github.com/nitish1899/Image/blob/main/Logo1.png?raw=true"
//                         alt="Startup India Logo">
//                 </a>
//             </div>
//             <div class="logos-right">
//                 <img src="	https://raw.githubusercontent.com/nitish1899/Image/main/pureprukriti.png
//                 " alt="TSIL Logo">
//             </div>
//         </div>
//         <div class="top-section">
//             <p>Certificate Number: <span class="highlight" id="certificateNumber">${result && result.certificateNumber}</span></p>
//             <p>Date: <span class="highlight" id="date">${result && result.certificateIssueDate}</span></p>
//         </div>
//         <h1>Certificate of CO2 Emission</h1>
//         <p>This is to certify that the vehicle owned/hired by</p>
//         <p class="highlight" id="vehicleOwner">${userInfo ? userInfo.userName : "Name"}</p>
//         <p>with vehicle number</p>
//         <p class="highlight" id="vehicleNumber">${result && result.vehicleNumber}</p>
//         <p>has emitted</p>
//         <p><span class="highlight" id="co2Emission">${result && (result.co2Emission / 1000).toFixed(1)}</span> unit CO2</p>

//         <div class="signature-section">
//             <img src="https://raw.githubusercontent.com/nitish1899/Image/main/sign1.png" alt="Signature"  height="50" width="200">
//             <p>Authorized Signature</p>
//         </div>

//         <div class="issuer-section">
//             <p>Issued by:</p>
//             <p class="highlight">Transvue Solution India Pvt. Ltd.</p>
//         </div>

//         <div style="display: flex;">
//             <div class="info-section">
//                 <p>* The above result is based on user input.</p>
//                 <p>* Additional details are based on US/UK research.</p> 
//             </div>
//             <div class="time-section" style="margin-left: auto;" style="margin-right: 1px;">
//                 <p>Time: <span class="highlight" id="time">${new Date().toLocaleTimeString()}</span></p>
//             </div>
//         </div>
//     </div>
//        <script>
//         window.onload = function() {
//             const now = new Date();
//             const options = { year: 'numeric', month: 'long', day: 'numeric' };
//             const dateStr = now.toLocaleDateString('en-US', options);
//             const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//             document.getElementById('date').innerText = dateStr;
//             document.getElementById('time').innerText = timeStr;
//         };
//     </script>
// </body>

// </html>
//         `;
//   const printToFile = async () => {
//     // On iOS/android prints the given html. On web prints the HTML from the current page.
//     const { uri } = await Print.printToFileAsync({ html });
//     console.log('File has been saved to:', uri);
//     await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
//   };

//   const selectPrinter = async () => {
//     const printer = await Print.selectPrinterAsync(); // iOS only
//     setSelectedPrinter(printer);
//   };



//   return (
//     <View className=" h-[100%] ">
//       <ImageBackground source={require("../../assets/images/bg4.jpg")} resizeMode="cover" className="h-[100%] flex items-center">
//         <View className="w-[105%] h-[13%] bg-cyan-200 rounded-b-[100px] flex-row">
//           <Text className="mt-[50px] text-2xl ml-[120px]">नमस्ते  {userInfo ? userInfo.userName : "Name"}</Text>
//           <View className="mt-[40px] ml-[60px] flex items-center justify-center h-[40px] w-[40px] bg-white rounded-3xl">
//             {/* <FontAwesome name="user-o" size={24} color="black" /> */}
//             <FontAwesome5 name="cloud-moon" size={24} color="black" /></View>
//         </View>

//         <KeyboardAvoidingView className=" h-[70%] w-[100%] mt-8">
//           <ScrollView>
//             <Text className="text-2xl ml-[80px] mb-1">Total Carbon Footprint</Text>
//             <View className=" mt-6 h-[40px] w-[250px] ml-[70px]  flex items-center justify-center bg-gray-50">

//               <Text className="text-xl font-semibold blink">{result && result.co2Emission}   kg</Text>

//             </View>

//             <View className="h-[30px] w-[250px] ml-[70px]  flex items-center justify-center bg-gray-50">

//               <Text className="text-xl">Equivalent to </Text>

//             </View>
//             <View className="h-[40px] w-[250px] ml-[70px]  flex items-center justify-center bg-gray-50">

//               <Text className="text-xl font-semibold">{result && (result.co2Emission / 1000).toFixed(1)}   unit</Text>

//             </View>



//             {resulterror && <View className="items-center justify-center mt-11">
//               <Text className="text-xl text-red-700">{resulterror && resulterror} </Text></View>}

//             <View className="h-40">

//               <Animated.View style={{ transform: [{ translateX }] }}>
//                 <View className="w-52 h-44 relative">
//                   <Image
//                     source={require('../../assets/images/Truck6.png')}
//                     style={{ height: 160, width: 160, zIndex: 10 }}
//                     resizeMode="contain"
//                   />
//                   {/* <Image
//           source={require("../../assets/images/pureP.png")}
//           style={{ position: 'absolute', top: -40, left: 56, width: 80, height: 80, zIndex: 20 }}
//         /> */}
//                 </View>
//               </Animated.View>
//               {/* <Animated.View style={{ transform: [{ translateX }] }}>
//                 <View className="w-52 h-44 relative ">
//                 <Image
//             source={require('../../assets/images/truck5.png')}
//             className="h-[150px] w-[160px] z-10"
//             resizeMode="contain"
//           />

//                   <Image
//                     source={require("../../assets/images/pureP.png")}
//                     className="w-20 h-20 z-20 -top-[40px] left-14"
//                   />
//                 </View>
//               </Animated.View> */}
//               {/* <Animated.View style={{ transform: [{ translateX }] }}>
//         <View className="w-[200px] h-[180px] relative">
      
//         <LottieView
//           autoPlay
//           ref={animation}
//           className="w-[200px] h-[180px]"
//           source={require('../../Truck1.json')}
//         />
//         <Image
//           className="w-[200px] h-[180px] "
//           style={{zIndex:1,position: 'absolute'}}
//           source={require("../../assets/images/tranvue.jpg")}
//           // style={{ width: 22, height: 20 }}
//         />
//         </View>
         
//       </Animated.View> */}
//               {showText && <View className=" mt-11 absolute w-[250px] ml-[70px] rounded-2xl flex items-center justify-center">
//                 <View className="flex-row">
//                   {/* <Text className="text-xl pr-2">Plant  {result && ((result.co2Emission/1000).toFixed(0))*40} trees</Text> */}
//                   <Text className="text-xl pr-2">Plant  {result && (Math.ceil(result.co2Emission / 1000)) * 12} trees</Text>
//                   {/* <Image
//         source={{ uri: "../../assets/images/bg4.jpg" }}
//         style={styles.image}
//       /> */}
//                   <Image
//                     // className="mt-[50px] ml-[30px]"
//                     source={require("../../assets/images/mango2.jpg")}
//                     style={{ width: 22, height: 20 }}
//                   />
//                   <Text className="text-xl pl-1"> to offset </Text>
//                 </View>
//                 <View>
//                   <Text className="text-xl px-[5%] ml-[10%] mx-auto">for your co2 Footprint</Text>
//                 </View>
//               </View>}
//             </View>

//             {/* <View style={styles.container}> */}
//             <View className="w-[70%] mx-auto ">
//               <Button title="Print" onPress={print} />
//               <View className="h-2" />
//               <Button title="Print to PDF file" onPress={printToFile} />
//               {Platform.OS === 'ios' && (
//                 <>
//                   <View className="h-8" />
//                   <Button title="Select printer" onPress={selectPrinter} />
//                   <View className="h-8" />
//                   {selectedPrinter ? (
//                     <Text className="text-center">{`Selected printer: ${selectedPrinter.name}`}</Text>
//                   ) : undefined}
//                 </>
//               )}
//             </View>

//             <View className="mt-[80px]">
//               <Text className="text-center text-green-600 font-semibold text-xl">#Save Enviroment    #Green generation</Text>
//             </View>
//           </ScrollView>

//         </KeyboardAvoidingView>
//         {/* <View className="flex-1 flex-row space-x-[10%] items-center  mt-0">
//         <View>
//         <Image
//           className="ml-0"
//           source={require("../../assets/images/mantra.jpg")}
//           style={{ width: 50, height: 50 }}
//         />
//         </View>
     
//      <View className="flex-row"> 
//       <Text className="text-white pl-6">Made in</Text>
//         <Image
//           className=" ml-2"
//           source={require("../../assets/images/image 10.png")}
//           style={{ width: 40, height: 22 }}
//         />
//         </View>
//        <View>
//         <Image
//           className=" ml-11"
//           source={require("../../assets/images/make-in-India-logo.jpg")}
//           style={{ width: 80, height: 48 }}
//         />
//         </View>
//       </View> */}

//         {/* <View className="flex-1 flex-row space-x-[10%] items-center  mt-0">
//         <View>
//         <Image
//           className="ml-0"
//           source={require("../../assets/images/mantra.jpg")}
//           style={{ width: 50, height: 50 }}
//         />
//         </View>
     
//      <View className="flex-row"> 
//       <Text className="text-white pl-6">Made in</Text>
//         <Image
//           className=" ml-2"
//           source={require("../../assets/images/image 10.png")}
//           style={{ width: 40, height: 22 }}
//         />
//         </View>
//        <View>
//         <Image
//           className=" ml-11"
//           source={require("../../assets/images/lion3.png")}
//           style={{ width: 80, height: 48 }}
//         />
//         </View>
//       </View> */}

//         <View className="flex-1 flex-row space-x-[6%] items-center  mt-0 w-[100%]">
//           <View className="w-[25%]">
//             <Image
//               className="ml-2"
//               source={require("../../assets/images/mantra.jpg")}
//               style={{ width: 50, height: 50 }}
//             />
//           </View>

//           <View className="flex-row w-[25%]">
//             <Text className="text-white pl-6">Made in</Text>
//             <Image
//               className=" ml-2"
//               source={require("../../assets/images/image 10.png")}
//               style={{ width: 40, height: 28 }}
//             />
//           </View>
//           <View style={{ width: "37%" }}>
//             <Image
//               source={require("../../assets/images/make-in-India-logo.jpg")}
//               style={{
//                 width: "100%",
//                 height: undefined,
//                 aspectRatio: 100 / 28, // Use the actual aspect ratio of the image
//                 resizeMode: "contain",
//                 marginLeft: 24,
//               }}
//             />
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   )
// };

// // const styles = StyleSheet.create({


// //   animationContainer: {
// //     // backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     flex: 1,
// //   },
// //   container: {
// //     // backgroundColor: '#ecf0f1',
// //     height: 150,
// //   },
// //   lottieView: {
// //     width: 200,
// //     height: 180,
// //   },

// // });

// export default App;




















