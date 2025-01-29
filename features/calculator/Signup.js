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
