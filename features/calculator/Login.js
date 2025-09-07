import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loginAsync, selectIsAuthenticated } from './calculatorSlice';

const phoneRegex = /^\d{10}$/;
const signUpSchema = yup.object().shape({
  mobileNumber: yup
    .string()
    .matches(phoneRegex, 'Enter a valid 10-digit phone number')
    .required('Phone number is required'),
  pin: yup
    .string()
    .min(4, 'Length should be 4')
    .max(4, 'Length should be 4')
    .required('PIN is required'),
});

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector((state) => state.calculator.error);
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

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
      navigation.navigate('Calculator');
    } else if (error) {
      setIsLoading(false);
      Alert.alert('Error', error);
    }
  }, [isAuthenticated, error]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    dispatch(loginAsync(values));
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/Pure Prakriti bg img.jpg')}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            {/* Logo + Heading */}
            <View style={styles.centerContent}>
              <Image
                source={require('../../assets/images/pureP.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>Log in or Sign up</Text>
              <Text style={styles.subtitle}>Login with your WhatsApp Number</Text>
            </View>

            {/* Login Form */}
            <Formik
              initialValues={{ mobileNumber: '', pin: '' }}
              validationSchema={signUpSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formWrapper}>

                  {/* Mobile Number */}
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      onChangeText={handleChange('mobileNumber')}
                      onBlur={handleBlur('mobileNumber')}
                      value={values.mobileNumber}
                      placeholder="Enter mobile number"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                  </View>
                  {errors.mobileNumber && touched.mobileNumber && (
                    <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                  )}

                  {/* PIN */}
                  <Text style={styles.label}>PIN</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      onChangeText={handleChange('pin')}
                      onBlur={handleBlur('pin')}
                      value={values.pin}
                      placeholder="Enter 4-digit PIN"
                      keyboardType="numeric"
                      secureTextEntry
                      style={styles.input}
                    />
                  </View>
                  {errors.pin && touched.pin && (
                    <Text style={styles.errorText}>{errors.pin}</Text>
                  )}

                  {/* Gradient Login Button */}
                  <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#0d47a1', '#1976d2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.submitButton}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.submitButtonText}>Login</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Signup Link */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    style={styles.signupContainer}
                  >
                    <Text style={styles.signupText}>New User?</Text>
                    <Text style={styles.signupLink}> Signup</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer Text */}
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B0000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  formWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
  submitButton: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#0d47a1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  signupText: {
    fontSize: 12,
    color: '#555',
  },
  signupLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d47a1',
  },
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

export default App;


// import React, { useEffect, useState } from 'react';
// import {
//   ImageBackground,
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   Keyboard,
// } from 'react-native';
// import { Formik } from 'formik';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginAsync, selectIsAuthenticated } from './calculatorSlice';

// const phoneRegex = /^\d{10}$/;
// const signUpSchema = yup.object().shape({
//   mobileNumber: yup
//     .string()
//     .matches(phoneRegex, 'Enter a valid 10-digit phone number')
//     .required('Phone number is required'),
//   pin: yup
//     .string()
//     .min(4, 'Length should be 4')
//     .max(4, 'Length should be 4')
//     .required('PIN is required'),
// });

// const App = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const error = useSelector((state) => state.calculator.error);
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

//   useEffect(() => {
//     if (isAuthenticated) {
//       setIsLoading(false);
//       navigation.navigate('Calculator');
//     } else if (error) {
//       setIsLoading(false);
//       Alert.alert('Error', error);
//     }
//   }, [isAuthenticated, error]);

//   const handleSubmit = async (values) => {
//     setIsLoading(true);
//     dispatch(loginAsync(values));
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <ImageBackground
//         source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//         resizeMode="cover"
//         style={styles.imageBackground}
//       >
//         <View style={styles.overlay} />

//         <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
//           <ScrollView contentContainerStyle={styles.scrollContainer}>

//             {/* Logo + Heading */}
//             <View style={styles.centerContent}>
//               <Image
//                 source={require('../../assets/images/pureP.png')}
//                 style={styles.logo}
//               />
//               <Text style={styles.title}>Log in or Sign up</Text>
//               <Text style={styles.subtitle}>Using your WhatsApp Mobile Number</Text>
//             </View>

//             {/* Login Form */}
//             <Formik
//               initialValues={{ mobileNumber: '', pin: '' }}
//               validationSchema={signUpSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
//                 <View style={styles.formWrapper}>

//                   {/* Mobile Number */}
//                   <Text style={styles.label}>Mobile Number</Text>
//                   <TextInput
//                     onChangeText={handleChange('mobileNumber')}
//                     onBlur={handleBlur('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder="Enter mobile number"
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {errors.mobileNumber && touched.mobileNumber && (
//                     <Text style={styles.errorText}>{errors.mobileNumber}</Text>
//                   )}

//                   {/* PIN */}
//                   <Text style={styles.label}>PIN</Text>
//                   <TextInput
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder="Enter 4-digit PIN"
//                     keyboardType="numeric"
//                     secureTextEntry
//                     style={styles.input}
//                   />
//                   {errors.pin && touched.pin && (
//                     <Text style={styles.errorText}>{errors.pin}</Text>
//                   )}

//                   {/* Login Button */}
//                   <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//                     {isLoading ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <Text style={styles.submitButtonText}>Login</Text>
//                     )}
//                   </TouchableOpacity>

//                   {/* Signup Link */}
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('Signup')}
//                     style={styles.signupContainer}
//                   >
//                     <Text style={styles.signupText}>New User?</Text>
//                     <Text style={styles.signupLink}> Signup</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </Formik>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         {/* Footer Text */}
//         {!isKeyboardVisible && (
//           <View style={styles.footerContainer}>
//             <Text style={styles.termsText}>
//               By logging in, you agree to our{' '}
//               <Text
//                 style={styles.linkText}
//                 onPress={() => navigation.navigate('Terms')}
//               >
//                 Terms & Conditions
//               </Text>
//             </Text>
//           </View>
//         )}
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   imageBackground: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.6)', // blur overlay
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   centerContent: {
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   logo: {
//     width: 160,
//     height: 160,
//     resizeMode: 'contain',
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#8B0000',
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#444',
//     marginTop: 5,
//   },
//   formWrapper: {
//     padding: 18,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     marginBottom: 8,
//     backgroundColor: '#f9f9f9',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 6,
//   },
//   submitButton: {
//     backgroundColor: '#0d47a1',
//     height: 42,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//     shadowColor: '#0d47a1',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 6,
//   },
//   signupText: {
//     fontSize: 12,
//     color: '#555',
//   },
//   signupLink: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#0d47a1',
//   },
//   footerContainer: {
//     marginBottom: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
//   },
//   termsText: {
//     fontSize: 11,
//     color: '#666',
//     textAlign: 'center',
//   },
//   linkText: {
//     color: '#0d47a1',
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
// });

// export default App;


// import React, { useEffect, useState } from 'react';
// import {
//   ImageBackground,
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   Keyboard,
// } from 'react-native';
// import { Formik } from 'formik';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   loginAsync,
//   selectIsAuthenticated,
// } from './calculatorSlice';

// const phoneRegex = /^\d{10}$/;
// const signUpSchema = yup.object().shape({
//   mobileNumber: yup
//     .string()
//     .matches(phoneRegex, 'Enter a valid 10-digit phone number')
//     .required('Phone number is required'),
//   pin: yup
//     .string()
//     .min(4, 'Length should be 4')
//     .max(4, 'Length should be 4')
//     .required('PIN is required'),
// });

// const App = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const error = useSelector((state) => state.calculator.error);
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

//   useEffect(() => {
//     if (isAuthenticated) {
//       setIsLoading(false);
//       navigation.navigate('Calculator');
//     } else if (error) {
//       setIsLoading(false);
//       Alert.alert('Error', error);
//     }
//   }, [isAuthenticated, error]);

//   const handleSubmit = async (values) => {
//     setIsLoading(true);
//     dispatch(loginAsync(values));
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <ImageBackground
//         source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//         resizeMode="cover"
//         style={styles.imageBackground}
//       >
//         <View style={styles.overlay} />

//         <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
            
//             {/* Centered Logo & Title */}
//             <View style={styles.centerContent}>
//               <Image
//                 source={require('../../assets/images/pureP.png')}
//                 style={styles.logo}
//               />
//               <Text style={styles.title}>Log in or Sign up</Text>
//               <Text style={styles.subtitle}>Using your WhatsApp Mobile Number</Text>
//             </View>

//             {/* Login Form */}
// <Formik
//   initialValues={{ mobileNumber: '', pin: '' }}
//   validationSchema={signUpSchema}
//   onSubmit={handleSubmit}
// >
//   {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
//     <View style={styles.formWrapper}>
//       {/* Mobile Number */}
//       <Text style={styles.label}>Mobile Number</Text>
//       <TextInput
//         onChangeText={handleChange('mobileNumber')}
//         onBlur={handleBlur('mobileNumber')}
//         value={values.mobileNumber}
//         placeholder="Enter mobile number"
//         keyboardType="numeric"
//         style={styles.input}
//       />
//       {errors.mobileNumber && touched.mobileNumber && (
//         <Text style={styles.errorText}>{errors.mobileNumber}</Text>
//       )}

//       {/* PIN */}
//       <Text style={styles.label}>PIN</Text>
//       <TextInput
//         onChangeText={handleChange('pin')}
//         onBlur={handleBlur('pin')}
//         value={values.pin}
//         placeholder="Enter PIN"
//         keyboardType="numeric"
//         secureTextEntry
//         style={styles.input}
//       />
//       {errors.pin && touched.pin && (
//         <Text style={styles.errorText}>{errors.pin}</Text>
//       )}

//       {/* Login Button */}
//       <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//         {isLoading ? (
//           <ActivityIndicator size="small" color="#fff" />
//         ) : (
//           <Text style={styles.submitButtonText}>Login</Text>
//         )}
//       </TouchableOpacity>

//       {/* Signup Link */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate('Signup')}
//         style={styles.signupContainer}
//       >
//         <Text style={styles.signupText}>New User?</Text>
//         <Text style={styles.signupLink}> Signup</Text>
//       </TouchableOpacity>
//     </View>
//   )}
// </Formik>

//           </ScrollView>
//         </KeyboardAvoidingView>

    
// {/* Footer Text (hidden when keyboard is open) */}
// {!isKeyboardVisible && (
//   <View style={styles.footerContainer}>
//     <Text style={styles.termsText}>
//       By logging in, you agree to our{' '}
//       <Text
//         style={styles.linkText}
//         onPress={() => navigation.navigate('Terms')}
//       >
//         Terms & Conditions
//       </Text>
//     </Text>
//   </View>
// )}

//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//   },
//   imageBackground: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.6)', // dhundla effect
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   centerContent: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   logo: {
//     width: 200,
//     height: 200,
//     resizeMode: 'contain',
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#8B0000',
//     letterSpacing: 1,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#333',
//     marginTop: 5,
//     fontStyle: 'italic',
//   },
//   formWrapper: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//     marginHorizontal: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   input: {
//     height: 42, // smaller height
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     marginBottom: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 6,
//   },
//   submitButton: {
//     backgroundColor: '#0d47a1',
//     height: 44,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 10,
//     shadowColor: '#0d47a1',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 5,
//   },
//   signupText: {
//     fontSize: 13,
//     color: '#555',
//   },
//   signupLink: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#0d47a1',
//   },
//  footerContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//   },
//   termsText: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   linkText: {
//     color: '#0d47a1',
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
// });

// export default App;


// import React, { useEffect, useState } from 'react';
// import {
//   ImageBackground,
//   KeyboardAvoidingView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   ActivityIndicator,
//   Alert,
//   TextInput,
// } from 'react-native';
// import { Formik } from 'formik';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup';
// import { Keyboard, Platform } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   loginAsync,
//   selectIsAuthenticated,
//   selectUserInfo,
//   selectUserExist,
// } from './calculatorSlice';

// const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
// const signUpSchema = yup.object().shape({
//   mobileNumber: yup
//     .string()
//     .matches(phoneRegex, 'Enter a valid phone number')
//     .required('Phone number is required'),
//   pin: yup
//     .string()
//     .min(4, 'Length should be 4')
//     .max(4, 'Length should be 4')
//     .required('PIN is required'),
// });

// const App = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const error = useSelector((state) => state.calculator.error);
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
  

//   useEffect(() => {
//     if (isAuthenticated) {
//       setIsLoading(false);
//       navigation.navigate('Calculator');
//     } else if (error) {
//       setIsLoading(false);
//       Alert.alert('Error', error);
//     }
//   }, [isAuthenticated, error]);

//   const handleSubmit = async (values) => {
//     setIsLoading(true);
//     dispatch(loginAsync(values));
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <ImageBackground
//         source={require('../../assets/images/Pure Prakriti bg img.jpg')}
//         resizeMode="cover"
//         style={styles.imageBackground}
//       >
//          <View style={styles.overlay} />
//         <View style={styles.headerContainer}>
//           <Text style={styles.headerText}>Welcome</Text>
//         </View>

//         <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <Formik
//               initialValues={{ mobileNumber: '', pin: '' }}
//               validationSchema={signUpSchema}
//               onSubmit={handleSubmit}
//             >
//               {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
//                 <View style={styles.formWrapper}>
//                   <Text style={styles.subtitle}>Please Login</Text>

//                   <Text style={styles.label}>Mobile Number</Text>
//                   <TextInput
//                     onChangeText={handleChange('mobileNumber')}
//                     onBlur={handleBlur('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder="Enter your mobile number"
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {errors.mobileNumber && touched.mobileNumber && (
//                     <Text style={styles.errorText}>{errors.mobileNumber}</Text>
//                   )}

//                   <Text style={styles.label}>PIN</Text>
//                   <TextInput
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder="Enter your PIN"
//                     keyboardType="numeric"
//                     style={styles.input}
//                   />
//                   {errors.pin && touched.pin && (
//                     <Text style={styles.errorText}>{errors.pin}</Text>
//                   )}

//                   <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//                     {isLoading ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <Text style={styles.submitButtonText}>Submit</Text>
//                     )}
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('Signup')}
//                     style={styles.signupContainer}
//                   >
//                     <Text style={styles.signupText}>New User?</Text>
//                     <Text style={styles.signupLink}> Signup</Text>
//                   </TouchableOpacity>
                  
//                 </View>
//               )}
//             </Formik>
//           </ScrollView>
//         </KeyboardAvoidingView>

//         {!isKeyboardVisible && (
//   <View style={styles.footerContainer}>
//     <Image
//       source={require('../../assets/images/mantra.jpg')}
//       style={styles.footerImage1}
//     />
//     <Image
//       source={require('../../assets/images/makeIndia.jpg')}
//       style={styles.footerImage2}
//     />
//   </View>
// )}
//       </ImageBackground>
      
//     </View>
//   );
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
//     marginTop: 150,
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
//     color: '#0C5A29',
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
// });

// export default App;