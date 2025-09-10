import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectIsOtpVerified,
  sendNumberAsync,
  signupAsync,
  verifyOtpAsync,
} from "./calculatorSlice";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SignupScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    mobileNumber: "",
    pin: "",
    confirmPin: "",
    otp: "",
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [timer, setTimer] = useState(30);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOtpVerified = useSelector(selectIsOtpVerified);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      navigation.navigate("Calculator");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let interval;
    if (isOTPSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsOTPSent(false);
    }
    return () => clearInterval(interval);
  }, [isOTPSent, timer]);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    if (formValues.mobileNumber.length !== 10) {
      Alert.alert("Invalid", "Please enter a valid 10-digit mobile number");
      return;
    }
    dispatch(sendNumberAsync({ mobileNumber: formValues.mobileNumber }));
    setIsOTPSent(true);
    setTimer(60);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!formValues.userName || !formValues.mobileNumber || !formValues.pin) {
      Alert.alert("Error", "All fields are required!");
      setIsLoading(false);
      return;
    }
    if (formValues.pin !== formValues.confirmPin) {
      Alert.alert("Error", "PINs do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const otpResponse = await dispatch(
        verifyOtpAsync({
          otp: formValues.otp,
          mobileNumber: formValues.mobileNumber,
        })
      ).unwrap();

      if (!otpResponse.success) {
        Alert.alert("Error", "OTP verification failed!");
        setIsLoading(false);
        return;
      }

      const signupResponse = await dispatch(signupAsync(formValues)).unwrap();
      if (signupResponse) {
        navigation.navigate("Calculator");
      } else {
        Alert.alert("Error", "Signup failed!");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require("../../assets/images/Pure Prakriti bg img.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}  showsVerticalScrollIndicator={false}>
            {/* Logo + Heading */}
            <View style={styles.centerContent}>
              <Image
                source={require("../../assets/images/pureP.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up with your WhatsApp Number
              </Text>
            </View>

            {/* Signup Form */}
            <View style={styles.formWrapper}>
              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  value={formValues.userName}
                  onChangeText={(t) => handleInputChange("userName", t)}
                />
              </View>

              {/* PIN */}
              <Text style={styles.label}>PIN</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit PIN"
                  secureTextEntry
                  keyboardType="numeric"
                  value={formValues.pin}
                  onChangeText={(t) => handleInputChange("pin", t)}
                />
              </View>

              {/* Confirm PIN */}
              <Text style={styles.label}>Confirm PIN</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm PIN"
                  secureTextEntry
                  keyboardType="numeric"
                  value={formValues.confirmPin}
                  onChangeText={(t) => handleInputChange("confirmPin", t)}
                />
              </View>

              {/* Mobile Number */}
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#888"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  keyboardType="numeric"
                  value={formValues.mobileNumber}
                  onChangeText={(t) => handleInputChange("mobileNumber", t)}
                  editable={!isOtpVerified}
                />
              </View>

              {/* OTP Section */}
              {isOTPSent && (
                <View>
                  <Text style={styles.label}>Enter OTP</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color="#888"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      keyboardType="numeric"
                      maxLength={4}
                      onChangeText={(t) => handleInputChange("otp", t)}
                    />
                  </View>
                </View>
              )}

              {/* Send OTP / Resend OTP */}
              <TouchableOpacity
                style={styles.otpButton}
                onPress={handleSendOtp}
                disabled={isOTPSent}
              >
                <Text style={styles.otpText}>
                  {isOTPSent ? `Resend OTP in ${timer}s` : "Send OTP"}
                </Text>
              </TouchableOpacity>

              {/* Signup Button */}
              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#0d47a1", "#1976d2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Signup</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.signupContainer}
              >
                <Text style={styles.signupText}>Already have an account?</Text>
                <Text style={styles.signupLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer Logos */}
        {!isKeyboardVisible && (
          <View style={styles.footerContainer}>
            <Text style={styles.termsText}>
              By logging in, you agree to our{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('TermsScreen')}
              >
                Terms & Conditions
              </Text>
            </Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  imageBackground: { flex: 1, },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  centerContent: { alignItems: "center", marginBottom: 25 },
  logo: { width: 140, height: 140, resizeMode: "contain", marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B0000",
    letterSpacing: 0.5,
  },
  subtitle: { fontSize: 14, color: "#444", marginTop: 5 },
  formWrapper: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 6 },
  input: { flex: 1, height: 42, fontSize: 14 },
  otpButton: { alignSelf: "flex-end", marginBottom: 10 },
  otpText: { color: "#0d47a1", fontWeight: "600" },
  submitButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#0d47a1",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  signupText: { fontSize: 12, color: "#555" },
  signupLink: { fontSize: 12, fontWeight: "700", color: "#0d47a1" },
  footerContainer: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  termsText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  linkText: {
    color: '#0d47a1',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;




// import React, { useEffect, useState } from 'react';
// import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Image, Modal, ActivityIndicator, Alert } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Formik, Form, Field } from 'formik';
// import { TextInput } from 'react-native';
// import { CheckBox } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// // import CheckBox from 'react-native-check-box';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup'
// import { useSelector, useDispatch } from 'react-redux';
// import { selectIsAuthenticated, selectIsOtpVerified, selectUserInfo, sendNumberAsync, signupAsync, verifyOtpAsync } from './calculatorSlice';
// import { BlurView } from "expo-blur";
// import { Keyboard, Platform } from 'react-native';
// const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
// const signUpSchema = yup.object().shape({

//   userName: yup
//     .string()
//     .required('User name is required'),
//   // image: yup
//   //   .string()
//   //   .required('image is required'),
//   mobileNumber: yup
//     .string()
//     .matches(phoneRegex, 'Enter a valid phone number')
//     .required('Phone number is required'),
//   pin: yup
//     .string()
//     .min(4, 'Length should be 4')
//     .max(4, 'Length should be 4')
//     // .matches(phoneRegex, 'Enter a valid pin number')
//     .required('Pin is required'),
//   confirmPin: yup
//     .string()
//     .oneOf([yup.ref('pin')], 'Pin do not match')
//     .required('Confirm pin is required'),
//   // email: yup
//   //   .string()
//   //   .email("Please enter valid email")
//   //   .required('Email is required'),
//   // password: yup
//   //   .string()
//   //   .matches(/\w*[a-z]\w*/,  "Password must have a small letter")
//   //   .matches(/\w*[A-Z]\w*/,  "Password must have a capital letter")
//   //   .matches(/\d/, "Password must have a number")
//   //   .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
//   //   .min(8, ({ min }) => Password must be at least ${min} characters)
//   //   .required('Password is required'),
//   // confirmPassword: yup
//   //   .string()
//   //   .oneOf([yup.ref('password')], 'Passwords do not match')
//   //   .required('Confirm password is required'),
// })

// const SignupScreen = () => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [inputOtp, setInputOtp] = useState('');
//   const [image, setImage] = useState(null);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const userInfor = useSelector(selectUserInfo);
//   const isOtpVerified = useSelector(selectIsOtpVerified);
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isOTPSent, setIsOTPSent] = useState(false);
//   const [timer, setTimer] = useState(30);
//   const [modalVisible1, setModalVisible1] = useState(false);

//   const [formValues, setFormValues] = useState({
//     userName: '',
//     mobileNumber: '',
//     pin: '',
//     confirmPin: '',
//     otp: '',
//   });
//   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//   useEffect(() => {
//     const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//       setIsKeyboardVisible(true);
//     });
//     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//       setIsKeyboardVisible(false);
//     });
  
//     return () => {
//       showSubscription.remove();
//       hideSubscription.remove();
//     };
//   }, []);

//   const handleInputChange = (field, value) => {
//     setFormValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const openModal1 = () => {
//     setModalVisible1(true);
//   };

//   const closeModal1 = () => {
//     setModalVisible1(false);
//   };
//   useEffect(() => {
//     if (isAuthenticated) {
//       // Navigate to the next page
//       setIsLoading(false);
//       navigation.navigate('Calculator');
//     }
//   }, [isAuthenticated, navigation]);
//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };
//   const handleCheckBox = () => {
//     setIsChecked(!isChecked);
//   };

//   const handleSendOtp = () => {
//     if (formValues.mobileNumber.length !== 10) {
//       Alert.alert("Invalid", "Please enter a valid 10-digit mobile number");
//       return;
//     }
//     dispatch(sendNumberAsync({ 'mobileNumber': formValues.mobileNumber }));
//     setIsOTPSent(true);
//     setTimer(60);
//     // Simulate OTP send logic
//     // console.log("OTP Sent to:", formValues.mobileNumber);
//   };

//   // const handleVerifyOtp = () => {
//   //   setIsOtpVerified(true);
//   //   Alert.alert("Success", "OTP Verified Successfully!");
//   // };

//   useEffect(() => {
//     let interval;
//     if (isOTPSent && timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       clearInterval(interval);
//       setIsOTPSent(false);
//     }
//     return () => clearInterval(interval);
//   }, [isOTPSent, timer]);

//   const pickImage = async (setFieldValue) => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     // console.log(result);
//     // console.log(result.assets[0].uri);
//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setFieldValue('image', result.assets[0].uri);
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);

//     if (!formValues.userName || !formValues.mobileNumber || !formValues.pin || !formValues.confirmPin) {
//       Alert.alert("Error", "All fields are required!");
//       setIsLoading(false);
//       return;
//     }

//     if (formValues.pin !== formValues.confirmPin) {
//       Alert.alert("Error", "PINs do not match!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // First API call: Verify OTP
//       const otpResponse = await dispatch(verifyOtpAsync({ "otp": formValues.otp, "mobileNumber": formValues.mobileNumber })).unwrap(); // Ensure API response handling

//       if (!otpResponse.success) {
//         Alert.alert("Error", "OTP verification failed!");
//         setIsLoading(false);
//         return;
//       }

//       // Second API call: Sign up the user
//       const signupResponse = await dispatch(signupAsync(formValues)).unwrap();

//       if (signupResponse) {
//         console.log("Signup successful!", signupResponse);
//         navigation.navigate("Calculator");
//       } else {
//         Alert.alert("Error", "Signup failed!");
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       Alert.alert("Error", "Something went wrong!");
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <View style={styles.mainContainer}>
//            <ImageBackground
//              source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//              resizeMode="cover"
//              style={styles.imageBackground}
//            >
//          <View style={styles.overlay} />
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerText}>Welcome</Text>
//         </View>

//         <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
//           <ScrollView
//            showsVerticalScrollIndicator={false}
//           >

//             <View style={styles.formWrapper}>
//               <Text style={styles.subtitle}>Sign Up</Text>

//               {/* Username */}
//               <Text style={styles.label}>Username</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Username"
//                 value={formValues.userName}
//                 onChangeText={(text) => handleInputChange("userName", text)}
//               />

//               {/* PIN */}
//               <Text style={styles.label}>Pin</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="PIN"
//                 secureTextEntry
//                 keyboardType="numeric"
//                 value={formValues.pin}
//                 onChangeText={(text) => handleInputChange("pin", text)}
//               />

//               {/* Confirm PIN */}
//               <Text style={styles.label}>Confirm Pin</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm PIN"
//                 secureTextEntry
//                 keyboardType="numeric"
//                 value={formValues.confirmPin}
//                 onChangeText={(text) => handleInputChange("confirmPin", text)}
//               />

//               {/* Mobile Number */}
//               <Text style={styles.label}>Mobile Number</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Mobile Number"
//                 keyboardType="numeric"
//                 value={formValues.mobileNumber}
//                 onChangeText={(text) => handleInputChange("mobileNumber", text)}
//                 editable={!isOtpVerified}
//               />

//               {/* OTP Section */}
//               {isOTPSent && (
//                 <View>
//                   <Text style={styles.label}>Enter OTP</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter OTP"
//                     keyboardType="numeric"
//                     onChangeText={(text) => handleInputChange("otp", text)}
//                     maxLength={4}
//                   />
//                   {/* <TouchableOpacity style={styles.otpButton} onPress={handleVerifyOtp}>
//                     <Text style={styles.otpText}>Verify OTP</Text>
//                   </TouchableOpacity> */}
//                 </View>
//               )}

//               {/* Send OTP / Resend OTP */}
//               <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp} disabled={isOTPSent}>
//                 <Text style={styles.otpText}>{isOTPSent ? `Resend OTP in ${timer}s` : "Send OTP"}</Text>
//               </TouchableOpacity>

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.signupButton,
//                   { backgroundColor: formValues.otp?.length === 4 ? "#0C5A29" : "#A5A5A5" }, // Disabled color
//                 ]}
//                 onPress={handleSubmit}
//                 disabled={formValues.otp?.length < 4}
//               >
//                 {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupText}>Signup</Text>}
//               </TouchableOpacity>

//               {/* Login Link */}
//               <TouchableOpacity onPress={() => navigation.navigate("Login")}
//                 style={styles.loginContainer}>
//                 <Text style={styles.loginText}>
//                   Already have an account? <Text style={styles.loginLink}>Login</Text>
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>

//         </KeyboardAvoidingView>

//         {!isKeyboardVisible && (
//   <View style={styles.footerContainer}>
//     <Image
//       source={require('../../assets/images/mantra.jpg')}
//       style={styles.footerImage1}
//     />
//     <Image
//       source={require('../../assets/images/makeInIndia.jpg')}
//       style={styles.footerImage2}
//     />
//   </View>
// )}
//       </ImageBackground>
//     </View>
//   )
// };

// const styles = StyleSheet.create({

//   mainContainer: {
//     flex: 1,
//   },
//   imageBackground: {
//     flex: 1,
//     alignItems: 'center',
  
//   },
//   headerContainer: {
//     width: '100%',
//     height: '15%',
//     backgroundColor: '#006400',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 24,
//     textAlign: 'center',
//   },
//   formContainer: {
//     flex: 1,
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   formWrapper: {
//     marginTop: 100,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     alignSelf: "flex-start",
//     fontSize: 16,
//     color: "#073618",
//     fontWeight: "600",
//     marginTop: 10,
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 10,
//   },

//   footerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginVertical: 20,
//     width: '100%',
//   },
//   footerImage1: {
//     width: 50,
//     height: 40,
//     resizeMode: 'contain',
//   },
//   footerImage2: {
//     width: 50,
//     height: 50,
//     resizeMode: 'contain',
//   },

//   otpButton: {
//     padding: 10,
//     paddingTop: 0,
//     paddingRight: 0,
//     alignSelf: "flex-end",
//   },
//   otpText: {
//     color: "#042410",
//     fontWeight: "bold",
//   },
//   signupButton: {
//     backgroundColor: '#004d00',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   signupText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   loginText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loginLink: {
//     color: "#0C5A29",
//     fontWeight: "bold",
//   },

//   overlay: {
//     ...StyleSheet.absoluteFillObject, // Covers the entire ImageBackground
//     backgroundColor: 'rgba(247, 238, 243, 0.6)', // Adjust color and opacity
//   },
// });

// export default SignupScreen;
