import React, { useEffect, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik, Form, Field } from 'formik';
import { TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
// import CheckBox from 'react-native-check-box';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectIsOtpVerified, selectUserInfo, sendNumberAsync, signupAsync, verifyOtpAsync } from './calculatorSlice';
import { BlurView } from "expo-blur";
import { Keyboard, Platform } from 'react-native';
const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const signUpSchema = yup.object().shape({

  userName: yup
    .string()
    .required('User name is required'),
  // image: yup
  //   .string()
  //   .required('image is required'),
  mobileNumber: yup
    .string()
    .matches(phoneRegex, 'Enter a valid phone number')
    .required('Phone number is required'),
  pin: yup
    .string()
    .min(4, 'Length should be 4')
    .max(4, 'Length should be 4')
    // .matches(phoneRegex, 'Enter a valid pin number')
    .required('Pin is required'),
  confirmPin: yup
    .string()
    .oneOf([yup.ref('pin')], 'Pin do not match')
    .required('Confirm pin is required'),
  // email: yup
  //   .string()
  //   .email("Please enter valid email")
  //   .required('Email is required'),
  // password: yup
  //   .string()
  //   .matches(/\w*[a-z]\w*/,  "Password must have a small letter")
  //   .matches(/\w*[A-Z]\w*/,  "Password must have a capital letter")
  //   .matches(/\d/, "Password must have a number")
  //   .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
  //   .min(8, ({ min }) => Password must be at least ${min} characters)
  //   .required('Password is required'),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords do not match')
  //   .required('Confirm password is required'),
})

const SignupScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfor = useSelector(selectUserInfo);
  const isOtpVerified = useSelector(selectIsOtpVerified);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [formValues, setFormValues] = useState({
    userName: '',
    mobileNumber: '',
    pin: '',
    confirmPin: '',
    otp: '',
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
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

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openModal1 = () => {
    setModalVisible1(true);
  };

  const closeModal1 = () => {
    setModalVisible1(false);
  };
  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to the next page
      setIsLoading(false);
      navigation.navigate('Calculator');
    }
  }, [isAuthenticated, navigation]);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const handleSendOtp = () => {
    if (formValues.mobileNumber.length !== 10) {
      Alert.alert("Invalid", "Please enter a valid 10-digit mobile number");
      return;
    }
    dispatch(sendNumberAsync({ 'mobileNumber': formValues.mobileNumber }));
    setIsOTPSent(true);
    setTimer(60);
    // Simulate OTP send logic
    // console.log("OTP Sent to:", formValues.mobileNumber);
  };

  // const handleVerifyOtp = () => {
  //   setIsOtpVerified(true);
  //   Alert.alert("Success", "OTP Verified Successfully!");
  // };

  useEffect(() => {
    let interval;
    if (isOTPSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsOTPSent(false);
    }
    return () => clearInterval(interval);
  }, [isOTPSent, timer]);

  const pickImage = async (setFieldValue) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    // console.log(result.assets[0].uri);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFieldValue('image', result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!formValues.userName || !formValues.mobileNumber || !formValues.pin || !formValues.confirmPin) {
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
      // First API call: Verify OTP
      const otpResponse = await dispatch(verifyOtpAsync({ "otp": formValues.otp, "mobileNumber": formValues.mobileNumber })).unwrap(); // Ensure API response handling

      if (!otpResponse.success) {
        Alert.alert("Error", "OTP verification failed!");
        setIsLoading(false);
        return;
      }

      // Second API call: Sign up the user
      const signupResponse = await dispatch(signupAsync(formValues)).unwrap();

      if (signupResponse) {
        console.log("Signup successful!", signupResponse);
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
             source={require('../../assets/images/Pure Prakriti bg img.jpg')}
             resizeMode="cover"
             style={styles.imageBackground}
           >
         <View style={styles.overlay} />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Welcome</Text>
        </View>

        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView
           showsVerticalScrollIndicator={false}
          >

            <View style={styles.formWrapper}>
              <Text style={styles.subtitle}>Sign Up</Text>

              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={formValues.userName}
                onChangeText={(text) => handleInputChange("userName", text)}
              />

              {/* PIN */}
              <Text style={styles.label}>Pin</Text>
              <TextInput
                style={styles.input}
                placeholder="PIN"
                secureTextEntry
                keyboardType="numeric"
                value={formValues.pin}
                onChangeText={(text) => handleInputChange("pin", text)}
              />

              {/* Confirm PIN */}
              <Text style={styles.label}>Confirm Pin</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm PIN"
                secureTextEntry
                keyboardType="numeric"
                value={formValues.confirmPin}
                onChangeText={(text) => handleInputChange("confirmPin", text)}
              />

              {/* Mobile Number */}
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="numeric"
                value={formValues.mobileNumber}
                onChangeText={(text) => handleInputChange("mobileNumber", text)}
                editable={!isOtpVerified}
              />

              {/* OTP Section */}
              {isOTPSent && (
                <View>
                  <Text style={styles.label}>Enter OTP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                    onChangeText={(text) => handleInputChange("otp", text)}
                    maxLength={4}
                  />
                  {/* <TouchableOpacity style={styles.otpButton} onPress={handleVerifyOtp}>
                    <Text style={styles.otpText}>Verify OTP</Text>
                  </TouchableOpacity> */}
                </View>
              )}

              {/* Send OTP / Resend OTP */}
              <TouchableOpacity style={styles.otpButton} onPress={handleSendOtp} disabled={isOTPSent}>
                <Text style={styles.otpText}>{isOTPSent ? `Resend OTP in ${timer}s` : "Send OTP"}</Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  { backgroundColor: formValues.otp?.length === 4 ? "#0C5A29" : "#A5A5A5" }, // Disabled color
                ]}
                onPress={handleSubmit}
                disabled={formValues.otp?.length < 4}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupText}>Signup</Text>}
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity onPress={() => navigation.navigate("Login")}
                style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginLink}>Login</Text>
                </Text>
              </TouchableOpacity>
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
  },
  formWrapper: {
    marginTop: 100,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#073618",
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
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

  otpButton: {
    padding: 10,
    paddingTop: 0,
    paddingRight: 0,
    alignSelf: "flex-end",
  },
  otpText: {
    color: "#042410",
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: '#004d00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: "#0C5A29",
    fontWeight: "bold",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire ImageBackground
    backgroundColor: 'rgba(247, 238, 243, 0.6)', // Adjust color and opacity
  },
});

export default SignupScreen;

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
//     <View style={styles.container}>
//       <ImageBackground source={require('../../assets/images/Pure Prakriti bg img.jpg')} style={styles.background}>
//         <BlurView intensity={50} tint="light" style={styles.blurOverlay} />
//         <View style={styles.welcomeBox}>
//           <Text style={styles.welcometext}>Welcome</Text>
//         </View>

//         <KeyboardAvoidingView >
//           <ScrollView
//             style={styles.subtitleContainer}
//             contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingBottom: 70 }}
//             keyboardShouldPersistTaps="handled"
//           >

//             <View style={styles.subtitleContainer}>
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
//               <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//                 <Text style={styles.loginText}>
//                   Already have an account? <Text style={styles.loginLink}>Login</Text>
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>

//         </KeyboardAvoidingView>

//         <View style={styles.container2}>
//           <View style={styles.firstImageContainer}>
//             <Image
//               // className="ml-2"
//               source={require("../../assets/images/mantra.jpg")}
//               style={styles.firstImage}
//             />
//           </View>

//           {/* <View className="flex-row w-[25%]">
//             <Text className="text-white pl-6">Made in</Text>
//             <Image
//               className=" ml-2"
//               source={require("../../assets/images/image 10.png")}
//               style={{ width: 40, height: 28 }}
//             />
//           </View> */}
//           <View style={styles.secondImageContainer}>
//             <Image
//               source={require("../../assets/images/make-in-India-logo.jpg")}
//               style={styles.secondImage}
//             />
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   )
// };

// const styles = StyleSheet.create({
//   blurOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   container: {
//     flex: 1,
//     width: "100%", // Ensures the container spans the full width
//     height: "100%", // Ensures the container spans the full height
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   background: {
//     flex: 1,
//     width: "100%", // Ensure it spans the full width
//     height: "100%", // Ensure it spans the full height
//     resizeMode: "cover",
//     blurRadius: "10"
//   },
//   welcomeBox: {
//     width: '100%',
//     height: '15%',
//     paddingHorizontal: 10,
//     paddingVertical: 16,
//     backgroundColor: '#0C5A29',
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   welcometext: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#E3F4EA",
//     lineHeight: 29.05,
//     fontFamily: "sans-serif-medium"
//   },
//   subtitleContainer: {
//     width: '100%',
//     height: '78%',
//     paddingHorizontal: 12,
//     // paddingVertical: 28,
//     color: "#ffffff",
//   },
//   subtitle: {
//     fontWeight: "600",
//     fontSize: 20,
//     color: "black",
//     marginBottom: 20,
//     top: 0,
//     textAlign: 'center'
//   },
//   label: {
//     alignSelf: "flex-start",
//     fontSize: 16,
//     color: "#073618",
//     fontWeight: "600",
//     marginTop: 10,
//   },
//   input: {
//     width: "100%",
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//     marginBottom: 10,
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
//     width: '100%',
//     backgroundColor: "#0C5A29",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   signupText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   loginText: {
//     color: "#fff",
//     marginTop: 10,
//     textAlign: 'center'
//   },
//   loginLink: {
//     color: "#0C5A29",
//     fontWeight: "bold",
//   },
//   container2: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between', // for equal spacing between items
//     alignItems: 'center',
//     width: '100%',
//   },
//   firstImageContainer: {
//     width: '25%',
//     marginLeft: 8, // Replaces the ml-2 from Tailwind
//   },
//   firstImage: {
//     width: 40,
//     height: 40,
//     marginLeft: 20,
//   },
//   secondImageContainer: {
//     width: '27%',
//   },
//   secondImage: {
//     width: '100%',
//     height: undefined,
//     aspectRatio: 100 / 40, // Actual aspect ratio of the image
//     resizeMode: 'contain',
//     marginLeft: 2, // Adjust if needed
//   },
// });

// export default SignupScreen;

// import React, { useEffect, useState } from 'react';
// import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Image, Modal, ActivityIndicator, Alert } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Formik, Form, Field } from 'formik';
// import { TextInput } from 'react-native';
// import { CheckBox } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/Ionicons';

// import * as ImagePicker from 'expo-image-picker';
// // import CheckBox from 'react-native-check-box';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup'
// import { useSelector, useDispatch } from 'react-redux';
// import { selectIsAuthenticated, selectIsOtpVerified, selectUserInfo, sendNumberAsync, signupAsync, verifyOtpAsync } from './calculatorSlice';
// import { Keyboard } from 'react-native';

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

// })

// const App = () => {
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

//   const [modalVisible1, setModalVisible1] = useState(false);

//   const openModal1 = () => {
//     setModalVisible1(true);
//   };

//   const closeModal1 = () => {
//     setModalVisible1(false);
//   };
//     const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
//     useEffect(() => {
//       const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
//         setIsKeyboardVisible(true);
//       });
//       const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
//         setIsKeyboardVisible(false);
//       });
    
//       return () => {
//         showSubscription.remove();
//         hideSubscription.remove();
//       };
//     }, []);
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

//   const handleSendOtp = (mobileNumber) => {
//     if (mobileNumber) {
//       // Logic to send OTP
//       console.log({ 'mobileNumber': mobileNumber });
//       dispatch(sendNumberAsync({ 'mobileNumber': mobileNumber }))
//       // Open the OTP modal
//       setModalVisible(true);
//     } else {
//       console.log('Mobile number is required to send OTP');
//     }
//   };

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




//   return (
//     <View style={styles.mainContainer}>
//       <ImageBackground
//         source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//         resizeMode="cover"
//         style={styles.imageBackground}
//       >
//             <View style={styles.overlay} />
//     <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Welcome</Text>
//       </View>


//         <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <Formik
//               initialValues={{ userName: '', mobileNumber: null, pin: null, confirmPin: null }}
//               validationSchema={signUpSchema}
//               onSubmit={(values) => {
//                 setIsLoading(true);
//                 if (isChecked) {
//                   console.log(isOtpVerified);
//                   if (isOtpVerified) {
//                     dispatch(signupAsync(values));
//                   }
//                   if (isAuthenticated) {
//                     // console.log("success")
//                     navigation.navigate('Calculator');
//                   }
//                 } else {
//                   setIsLoading(false);
//                   // Do nothing, stay on the same page
//                 }
//               }
//               }
//             >
//               {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
//                 <View style={styles.formWrapper}>
//                   <Text style={styles.subtitle}>Sign Up</Text>
//                   {/* Photo Input */}


//                    <Text style={styles.label}>userName</Text>
//                   <TextInput 
//                     onChangeText={handleChange('userName')}
//                     onBlur={handleBlur('userName')}
//                     value={values.userName}
//                     placeholder='User Name'
//                     style={styles.input}
//                   />
//                   {(errors.userName && touched.userName) &&
//                     <Text style={{ color: 'red' }}>{errors.userName}</Text>
//                   }

//                                     {/* <TouchableOpacity className="mx-auto mt-5 px-[20px] bg-white"><Text className="text-blue-800 font-bold">Verify Otp</Text></TouchableOpacity> */}
//                                     <Text style={styles.label}>pin</Text>
//                   <TextInput 
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder='Pin'
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {(errors.pin && touched.pin) &&
//                     <Text style={{ color: 'red' }}>{errors.pin}</Text>
//                   }
//                     <Text style={styles.label}>confirmPin</Text>
//                   <TextInput
//                     onChangeText={handleChange('confirmPin')}
//                     onBlur={handleBlur('confirmPin')}
//                     value={values.confirmPin}
//                     placeholder='Confirm Pin'
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {(errors.confirmPin && touched.confirmPin) &&
//                     <Text style={{ color: 'red' }}>{errors.confirmPin}</Text>
//                   }
//                        <Text style={styles.label}>Mobile Number</Text>
//                   <TextInput 
//                     onChangeText={handleChange('mobileNumber')}
//                     onBlur={handleBlur('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder='Mobile Number'
//                     keyboardType="numeric"
//                     editable={!isOtpVerified}
//                     style={styles.input}
//                   />
//                   {(errors.mobileNumber && touched.mobileNumber) &&
//                     <Text style={{ color: 'red' }}>{errors.mobileNumber}</Text>
//                   }
//                   {isOtpVerified ?
//                     <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-green-800 font-bold">Otp Verified</Text></TouchableOpacity>

//                     : <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-blue-800 font-bold">Send Otp</Text></TouchableOpacity>
//                   }
//                   <Modal
//                     animationType="slide"
//                     transparent={true}
//                     visible={modalVisible}
//                     onRequestClose={closeModal}
//                   >
//                     <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                       <View className="h-[300px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                         <Text className="text-2xl ml-[0px]">Fill Otp</Text>
//                         <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[40px]"
//                           value={inputOtp}
//                           onChangeText={setInputOtp}
//                           placeholder='Enter Otp'
//                         />
//                         <View className="mt-11">
//                           <Button title="Verify Otp" onPress={() => { setModalVisible(false); dispatch(verifyOtpAsync({ "otp": inputOtp, "mobileNumber": values.mobileNumber })); }} />
//                         </View>
//                       </View>
//                     </View>
//                   </Modal>


//                   <View className="mx-[65px]  flex-row  justify-center">

//                     <View >
//                       {/* // className="mx-[65px]  flex-row justify-center" */}
//                       <CheckBox
//                         style={{ backgroundColor: 'transparent', borderWidth: 0 }}
//                         title='By checking this box, you agree to our terms and conditions'
//                         checked={isChecked}
//                         onPress={handleCheckBox}
//                         containerStyle={{
//                           backgroundColor: 'transparent',
//                           borderWidth: 0,
//                         }}
//                       />
//                       {/* <TouchableOpacity><Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text></TouchableOpacity> */}
//                     </View>
//                     <TouchableOpacity onPress={openModal1}>
//                       {/* <Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text> */}
//                     </TouchableOpacity>
//                     <Modal
//                       animationType="slide"
//                       transparent={true}
//                       visible={modalVisible1}
//                       onRequestClose={closeModal1}
//                     >
//                       <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                         <View className="h-[600px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                           <Text className="text-2xl ml-[20px]">Terms & Conditions</Text>
//                           <View className="border-black border-2 mt-[20px]">
//                             <Text className=" mt-[20px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto mb-[20px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                           </View>
//                           <View className="mt-11">
//                             <Button title="Read T&C" onPress={() => { setModalVisible1(false) }} />
//                           </View>
//                         </View>
//                       </View>
//                     </Modal>
//                   </View>

//                   <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
//                     <View style={styles.submitButton}>
//                       {isLoading ? (
//                         <ActivityIndicator size="large" color="#ffffff" />
//                       ) : (
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                       )}
//                       {/* <Text className="text-white text-2xl">Submit</Text> */}
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </Formik>
//              <TouchableOpacity
//                                 onPress={() => navigation.navigate("Login")}
//                                 style={styles.signupContainer}
//                               >
//                                 <Text style={styles.signupText}>Existing User </Text>
//                                 <Text style={styles.signupLink}> Login</Text>
//                               </TouchableOpacity>


//           </ScrollView>

//         </KeyboardAvoidingView>

//         {!isKeyboardVisible && (
//   <View style={styles.footerContainer}>
//     <Image
//       source={require('../../assets/images/mantra.jpg')}
//       style={styles.footerImage1}
//     />
//     <Image
//       source={require('../../assets/images/make-in-India-logo.jpg')}
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
//   },
//   backButton: {
//     position: 'absolute',
//     left: 16, // Keeps the back button on the left
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 24,
//     textAlign: 'center',
//     marginTop: 40,
//   },
//   formContainer: {
//     flex: 1,
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   formWrapper: {
//     marginTop: 50,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: '#004d00',
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

//   submitButton: {
//     backgroundColor: '#004d00',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
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
//   overlay: {
//     ...StyleSheet.absoluteFillObject, // Covers the entire ImageBackground
//     backgroundColor: 'rgba(247, 238, 243, 0.6)', // Adjust color and opacity
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   signupText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   signupLink: {
//     fontSize: 16,
//     color: '#007bff',
//     fontWeight: 'bold',
//   },

// });

// export default App;

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

// })

// const App = () => {
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

//   const [modalVisible1, setModalVisible1] = useState(false);

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

//   const handleSendOtp = (mobileNumber) => {
//     if (mobileNumber) {
//       // Logic to send OTP
//       console.log({ 'mobileNumber': mobileNumber });
//       dispatch(sendNumberAsync({ 'mobileNumber': mobileNumber }))
//       // Open the OTP modal
//       setModalVisible(true);
//     } else {
//       console.log('Mobile number is required to send OTP');
//     }
//   };

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




//   return (
//     <View style={styles.mainContainer}>
//       <ImageBackground
//         source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//         resizeMode="cover"
//         style={styles.imageBackground}
//       >
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerText}>Welcome</Text>
//           {/* <TouchableOpacity className="mt-[40px] ml-[60px] flex items-center justify-center h-[40px] w-[40px] bg-white rounded-3xl" >
//         <FontAwesome name="user-o" size={24} color="black" />
//         </TouchableOpacity> */}
//         </View>



//         {/* <Text className="text-xl mt-2 px-6">Track your carbon footprint </Text>
//       <Text className="text-xl px-6">effortlessly with our CO2 emission</Text>
//       <Text className="text-xl px-6">calculator. Small steps, big impact!</Text> */}

//         <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
//           <ScrollView>
//             <Formik
//               initialValues={{ userName: '', mobileNumber: null, pin: null, confirmPin: null }}
//               validationSchema={signUpSchema}
//               onSubmit={(values) => {
//                 setIsLoading(true);
//                 if (isChecked) {
//                   console.log(isOtpVerified);
//                   if (isOtpVerified) {
//                     dispatch(signupAsync(values));
//                   }
//                   if (isAuthenticated) {
//                     // console.log("success")
//                     navigation.navigate('Calculator');
//                   }
//                 } else {
//                   setIsLoading(false);
//                   // Do nothing, stay on the same page
//                 }
//               }
//               }
//             >
//               {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
//                 <View style={styles.formWrapper}>
//                   <Text style={styles.subtitle}>Sign Up</Text>
//                   {/* Photo Input */}


//                    <Text style={styles.label}>userName</Text>
//                   <TextInput 
//                     onChangeText={handleChange('userName')}
//                     onBlur={handleBlur('userName')}
//                     value={values.userName}
//                     placeholder='User Name'
//                     style={styles.input}
//                   />
//                   {(errors.userName && touched.userName) &&
//                     <Text style={{ color: 'red' }}>{errors.userName}</Text>
//                   }
//                        <Text style={styles.label}>Mobile Number</Text>
//                   <TextInput 
//                     onChangeText={handleChange('mobileNumber')}
//                     onBlur={handleBlur('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder='Mobile Number'
//                     keyboardType="numeric"
//                     editable={!isOtpVerified}
//                     style={styles.input}
//                   />
//                   {(errors.mobileNumber && touched.mobileNumber) &&
//                     <Text style={{ color: 'red' }}>{errors.mobileNumber}</Text>
//                   }
//                   {isOtpVerified ?
//                     <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-green-800 font-bold">Otp Verified</Text></TouchableOpacity>

//                     : <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-blue-800 font-bold">Send Otp</Text></TouchableOpacity>
//                   }
//                   <Modal
//                     animationType="slide"
//                     transparent={true}
//                     visible={modalVisible}
//                     onRequestClose={closeModal}
//                   >
//                     <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                       <View className="h-[300px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                         <Text className="text-2xl ml-[0px]">Fill Otp</Text>
//                         <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[40px]"
//                           value={inputOtp}
//                           onChangeText={setInputOtp}
//                           placeholder='Enter Otp'
//                         />
//                         <View className="mt-11">
//                           <Button title="Verify Otp" onPress={() => { setModalVisible(false); dispatch(verifyOtpAsync({ "otp": inputOtp, "mobileNumber": values.mobileNumber })); }} />
//                         </View>
//                       </View>
//                     </View>
//                   </Modal>

//                   {/* <TouchableOpacity className="mx-auto mt-5 px-[20px] bg-white"><Text className="text-blue-800 font-bold">Verify Otp</Text></TouchableOpacity> */}
//                   <Text style={styles.label}>pin</Text>
//                   <TextInput 
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder='Pin'
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {(errors.pin && touched.pin) &&
//                     <Text style={{ color: 'red' }}>{errors.pin}</Text>
//                   }
//                     <Text style={styles.label}>confirmPin</Text>
//                   <TextInput
//                     onChangeText={handleChange('confirmPin')}
//                     onBlur={handleBlur('confirmPin')}
//                     value={values.confirmPin}
//                     placeholder='Confirm Pin'
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {(errors.confirmPin && touched.confirmPin) &&
//                     <Text style={{ color: 'red' }}>{errors.confirmPin}</Text>
//                   }

//                   <View className="mx-[65px]  flex-row  justify-center">

//                     <View >
//                       {/* // className="mx-[65px]  flex-row justify-center" */}
//                       <CheckBox
//                         style={{ backgroundColor: 'transparent', borderWidth: 0 }}
//                         title='By checking this box, you agree to our terms and conditions'
//                         checked={isChecked}
//                         onPress={handleCheckBox}
//                         containerStyle={{
//                           backgroundColor: 'transparent',
//                           borderWidth: 0,
//                         }}
//                       />
//                       {/* <TouchableOpacity><Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text></TouchableOpacity> */}
//                     </View>
//                     <TouchableOpacity onPress={openModal1}>
//                       {/* <Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text> */}
//                     </TouchableOpacity>
//                     <Modal
//                       animationType="slide"
//                       transparent={true}
//                       visible={modalVisible1}
//                       onRequestClose={closeModal1}
//                     >
//                       <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                         <View className="h-[600px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                           <Text className="text-2xl ml-[20px]">Terms & Conditions</Text>
//                           <View className="border-black border-2 mt-[20px]">
//                             <Text className=" mt-[20px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto mb-[20px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                           </View>
//                           <View className="mt-11">
//                             <Button title="Read T&C" onPress={() => { setModalVisible1(false) }} />
//                           </View>
//                         </View>
//                       </View>
//                     </Modal>
//                   </View>

//                   <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
//                     <View style={styles.submitButton}>
//                       {isLoading ? (
//                         <ActivityIndicator size="large" color="#ffffff" />
//                       ) : (
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                       )}
//                       {/* <Text className="text-white text-2xl">Submit</Text> */}
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </Formik>
//             <TouchableOpacity onPress={() => navigation.navigate("Login")} className="flex-row mx-auto mb-11"><Text className="  text-xl font-[600]">Existing User </Text>
//               <Text className="  text-xl text-blue-700 font-[800]"> Login</Text>

//             </TouchableOpacity>


//           </ScrollView>

//         </KeyboardAvoidingView>

//         <View style={styles.footerContainer}>
//                   <Image
//                     source={require('../../assets/images/mantra.jpg')}
//                     style={styles.footerImage1}
//                   />
//                   <Image
//                     source={require('../../assets/images/make-in-India-logo.jpg')}
//                     style={styles.footerImage2}
//                   />
//                 </View>
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
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 24,
//     textAlign: 'center',
//     marginTop: 40,
//   },
//   formContainer: {
//     flex: 1,
//     width: '100%',
//     paddingHorizontal: 20,
//   },
//   formWrapper: {
//     marginTop: 50,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 5,
//     color: '#004d00',
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

//   submitButton: {
//     backgroundColor: '#004d00',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
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

// });

// export default App;


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
//   //   .min(8, ({ min }) => `Password must be at least ${min} characters`)
//   //   .required('Password is required'),
//   // confirmPassword: yup
//   //   .string()
//   //   .oneOf([yup.ref('password')], 'Passwords do not match')
//   //   .required('Confirm password is required'),
// })

// const App = () => {
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

//   const [modalVisible1, setModalVisible1] = useState(false);

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

//   const handleSendOtp = (mobileNumber) => {
//     if (mobileNumber) {
//       // Logic to send OTP
//       console.log({ 'mobileNumber': mobileNumber });
//       dispatch(sendNumberAsync({ 'mobileNumber': mobileNumber }))
//       // Open the OTP modal
//       setModalVisible(true);
//     } else {
//       console.log('Mobile number is required to send OTP');
//     }
//   };

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




//   return (
//     <View className=" h-[100%] ">
//       <ImageBackground source={require("../../assets/images/bg4.jpg")} resizeMode="cover" className="h-[100%] flex items-center">
//         <View className="w-[105%] h-[13%] bg-cyan-200 rounded-b-[100px] flex-row">
//           <Text className="mt-[40px] text-3xl ml-[35%]">Welcome</Text>
//           {/* <TouchableOpacity className="mt-[40px] ml-[60px] flex items-center justify-center h-[40px] w-[40px] bg-white rounded-3xl" >
//         <FontAwesome name="user-o" size={24} color="black" />
//         </TouchableOpacity> */}
//         </View>



//         {/* <Text className="text-xl mt-2 px-6">Track your carbon footprint </Text>
//       <Text className="text-xl px-6">effortlessly with our CO2 emission</Text>
//       <Text className="text-xl px-6">calculator. Small steps, big impact!</Text> */}

//         <KeyboardAvoidingView className=" h-[70%] w-[100%] mt-8">
//           <ScrollView>
//             <Formik
//               initialValues={{ userName: '', mobileNumber: null, pin: null, confirmPin: null }}
//               validationSchema={signUpSchema}
//               onSubmit={(values) => {
//                 setIsLoading(true);
//                 if (isChecked) {
//                   console.log(isOtpVerified);
//                   if (isOtpVerified) {
//                     dispatch(signupAsync(values));
//                   }
//                   if (isAuthenticated) {
//                     // console.log("success")
//                     navigation.navigate('Calculator');
//                   }
//                 } else {
//                   setIsLoading(false);
//                   // Do nothing, stay on the same page
//                 }
//               }
//               }
//             >
//               {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
//                 <View className="pb-[50px]">
//                   <Text className="text-3xl ml-[140px] font-semibold mb-11">Sign Up</Text>
//                   {/* Photo Input */}

//                   {/* <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20}}>
//       {values.image && <Image source={{ uri: values.image }} className="h-[80px] w-[80px] rounded-[100px]" />}
//       <Button title="add photo" onPress={()=>pickImage(setFieldValue)} />
//       </View>
//       {(errors.image && touched.image) &&
//                   <Text style={{ color: 'red' }}>{errors.image}</Text>
//                 } */}

//                   <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
//                     onChangeText={handleChange('userName')}
//                     onBlur={handleBlur('userName')}
//                     value={values.userName}
//                     placeholder='User Name'
//                   />
//                   {(errors.userName && touched.userName) &&
//                     <Text style={{ color: 'red' }}>{errors.userName}</Text>
//                   }
//                   <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
//                     onChangeText={handleChange('mobileNumber')}
//                     onBlur={handleBlur('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder='Mobile Number'
//                     keyboardType="numeric"
//                     editable={!isOtpVerified}
//                   />
//                   {(errors.mobileNumber && touched.mobileNumber) &&
//                     <Text style={{ color: 'red' }}>{errors.mobileNumber}</Text>
//                   }
//                   {isOtpVerified ?
//                     <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-green-800 font-bold">Otp Verified</Text></TouchableOpacity>

//                     : <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-blue-800 font-bold">Send Otp</Text></TouchableOpacity>
//                   }
//                   <Modal
//                     animationType="slide"
//                     transparent={true}
//                     visible={modalVisible}
//                     onRequestClose={closeModal}
//                   >
//                     <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                       <View className="h-[300px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                         <Text className="text-2xl ml-[0px]">Fill Otp</Text>
//                         <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[40px]"
//                           value={inputOtp}
//                           onChangeText={setInputOtp}
//                           placeholder='Enter Otp'
//                         />
//                         <View className="mt-11">
//                           <Button title="Verify Otp" onPress={() => { setModalVisible(false); dispatch(verifyOtpAsync({ "otp": inputOtp, "mobileNumber": values.mobileNumber })); }} />
//                         </View>
//                       </View>
//                     </View>
//                   </Modal>

//                   {/* <TouchableOpacity className="mx-auto mt-5 px-[20px] bg-white"><Text className="text-blue-800 font-bold">Verify Otp</Text></TouchableOpacity> */}

//                   <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder='Pin'
//                     keyboardType="numeric"
//                   />
//                   {(errors.pin && touched.pin) &&
//                     <Text style={{ color: 'red' }}>{errors.pin}</Text>
//                   }

//                   <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
//                     onChangeText={handleChange('confirmPin')}
//                     onBlur={handleBlur('confirmPin')}
//                     value={values.confirmPin}
//                     placeholder='Confirm Pin'
//                     keyboardType="numeric"
//                   />
//                   {(errors.confirmPin && touched.confirmPin) &&
//                     <Text style={{ color: 'red' }}>{errors.confirmPin}</Text>
//                   }

//                   <View className="mx-[65px]  flex-row  justify-center">
//                     {/* <CheckBox
//         title='By checking this box, you agree to our terms and conditions'
//         checked={isChecked}
//         onPress={handleCheckBox}
//       />  */}
//                     <View >
//                       {/* // className="mx-[65px]  flex-row justify-center" */}
//                       <CheckBox
//                         style={{ backgroundColor: 'transparent', borderWidth: 0 }}
//                         title='By checking this box, you agree to our terms and conditions'
//                         checked={isChecked}
//                         onPress={handleCheckBox}
//                         containerStyle={{
//                           backgroundColor: 'transparent',
//                           borderWidth: 0,
//                         }}
//                       />
//                       {/* <TouchableOpacity><Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text></TouchableOpacity> */}
//                     </View>
//                     <TouchableOpacity onPress={openModal1}>
//                       {/* <Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text> */}
//                     </TouchableOpacity>
//                     <Modal
//                       animationType="slide"
//                       transparent={true}
//                       visible={modalVisible1}
//                       onRequestClose={closeModal1}
//                     >
//                       <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//                         <View className="h-[600px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
//                           <Text className="text-2xl ml-[20px]">Terms & Conditions</Text>
//                           <View className="border-black border-2 mt-[20px]">
//                             <Text className=" mt-[20px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                             <Text className=" mt-[40px] mx-auto mb-[20px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
//                           </View>
//                           <View className="mt-11">
//                             <Button title="Read T&C" onPress={() => { setModalVisible1(false) }} />
//                           </View>
//                         </View>
//                       </View>
//                     </Modal>
//                   </View>

//                   <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
//                     <View className="w-[150px] h-[50px] ml-[130px] rounded-2xl mt-5 bg-blue-900 flex items-center justify-center">
//                       {isLoading ? (
//                         <ActivityIndicator size="large" color="#ffffff" />
//                       ) : (
//                         <Text className="text-white text-2xl">Submit</Text>
//                       )}
//                       {/* <Text className="text-white text-2xl">Submit</Text> */}
//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </Formik>
//             <TouchableOpacity onPress={() => navigation.navigate("Login")} className="flex-row mx-auto mb-11"><Text className="  text-xl font-[600]">Existing User </Text>
//               <Text className="  text-xl text-blue-700 font-[800]"> Login</Text>

//             </TouchableOpacity>


//           </ScrollView>

//         </KeyboardAvoidingView>
//         {/* <View className="flex-1 flex-row items-center justify-center mt-0">
//         <Text className="text-white">Made in</Text>
//         <Image
//           className=" ml-2"
//           source={require("../../assets/images/image 10.png")}
//           style={{ width: 40, height: 22 }}
//         />
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
//           source={require("../../assets/images/make-in-India-logo.jpg")}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     color: 'white',
//     fontSize: 42,
//     lineHeight: 84,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     backgroundColor: '#000000c0',
//   },
// });

// export default App;