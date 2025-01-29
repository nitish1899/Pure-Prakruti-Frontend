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
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import { Keyboard, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginAsync,
  selectIsAuthenticated,
  selectUserInfo,
  selectUserExist,
} from './calculatorSlice';

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const signUpSchema = yup.object().shape({
  mobileNumber: yup
    .string()
    .matches(phoneRegex, 'Enter a valid phone number')
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
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Welcome</Text>
        </View>

        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={{ mobileNumber: '', pin: '' }}
              validationSchema={signUpSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formWrapper}>
                  <Text style={styles.subtitle}>Please Login</Text>

                  <Text style={styles.label}>Mobile Number</Text>
                  <TextInput
                    onChangeText={handleChange('mobileNumber')}
                    onBlur={handleBlur('mobileNumber')}
                    value={values.mobileNumber}
                    placeholder="Enter your mobile number"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {errors.mobileNumber && touched.mobileNumber && (
                    <Text style={styles.errorText}>{errors.mobileNumber}</Text>
                  )}

                  <Text style={styles.label}>PIN</Text>
                  <TextInput
                    onChangeText={handleChange('pin')}
                    onBlur={handleBlur('pin')}
                    value={values.pin}
                    placeholder="Enter your PIN"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {errors.pin && touched.pin && (
                    <Text style={styles.errorText}>{errors.pin}</Text>
                  )}

                  <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>

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
  );
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
    marginTop: 150,
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
  submitButton: {
    backgroundColor: '#004d00',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLink: {
    fontSize: 16,
    color: '#0C5A29',
    fontWeight: 'bold',
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
// } from 'react-native';
// import { Formik } from 'formik';
// import { useNavigation } from '@react-navigation/native';
// import * as yup from 'yup';
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
//           <ScrollView>
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

//         <View style={styles.footerContainer}>
//           <Image
//             source={require('../../assets/images/mantra.jpg')}
//             style={styles.footerImage1}
//           />
//           <Image
//             source={require('../../assets/images/make-in-India-logo.jpg')}
//             style={styles.footerImage2}
//           />
//         </View>
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
//     marginTop: 150,
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


// import React, { useEffect, useState, useCallback } from 'react';
// import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Modal, Image, ActivityIndicator, Alert } from 'react-native';
// import { Formik, Form, Field } from 'formik';
// import { TextInput } from 'react-native';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import * as yup from 'yup'
// import { useDispatch, useSelector } from 'react-redux';
// import { loginAsync, selectIsAuthenticated, selectUserInfo, selectUserExist } from './calculatorSlice';


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

// })

// const App = () => {
//   const [isChecked, setIsChecked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [image, setImage] = useState(null);
//   const navigation = useNavigation();
//   const handleCheckBox = () => {
//     setIsChecked(!isChecked);
//   };
//   const dispatch = useDispatch();
//   const userInfo = useSelector(selectUserInfo);
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const userExist = useSelector(selectUserExist);

//   const [modalVisible, setModalVisible] = useState(false);

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const resultStatus = useSelector((state) => state.calculator.status); // Assuming you have status in your state
//   const error = useSelector((state) => state.calculator.error);



//   useEffect(() => {
//     if (resultStatus === 'idle' && isAuthenticated) {
//       setIsLoading(false);
//       navigation.navigate('Calculator');
//     } else if (resultStatus === 'idle' && error) {
//       setIsLoading(false);
//       // Handle error if necessary
//       Alert.alert('Error', error); // Display error using Alert (or any other notification mechanism)
//     }
//   }, [resultStatus, isAuthenticated, error]);


//   const handleSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append('photo', {
//       uri: values.image.uri,
//       name: 'photo.jpg',
//       type: 'image/jpeg',
//     });

//     // Append other form fields to formData if necessary
//     for (const key in values) {

//       if (key === 'pin' || key === 'mobileNumber') {
//         // Convert pin to a number
//         formData.append(key, Number(values[key]));
//       } else {
//         formData.append(key, values[key]);
//       }

//     }
//     if (isChecked) {
//       // console.log(values);
//       // console.log(formData);
//       dispatch(loginAsync(values));
//       // Navigate to the next page
//       if (userInfo) {
//         navigation.navigate('Calculator');
//       }
//     } else {
//       // Do nothing, stay on the same page
//     }

//   };

//   return (
//     <View >
//        <ImageBackground source={require("../../assets/images/Pure Prakriti bg img.jpg")} resizeMode="cover" className="h-[100%] flex items-center">
//               <View className="w-[100%] h-[15%] bg-green-700 ">
//                 <Text className="mt-[90px] text-2xl text-white text-center">Welcome</Text>
             
//               </View>

//         <KeyboardAvoidingView className=" h-[70%] w-[100%] mt-20">
//           <ScrollView>
//             <Formik
//               initialValues={{ mobileNumber: null, pin: null }}
//               validationSchema={signUpSchema}
//               onSubmit={(values) => {
//                 setIsLoading(true);
//                 if (true) {
//                   // console.log(isAuthenticated)
//                   console.log(values);
//                   dispatch(loginAsync(values));
//                   if (isAuthenticated) {

//                     // api for Login

//                     // Navigate to the next page
//                     navigation.navigate('Calculator');
//                   }
//                 } else {
//                   setIsLoading(false);
//                 }
//               }}
//             >
//               {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
//                 <View style={styles.container1}>
//                  <Text style={styles.subtitle}>Please Login</Text>
//                   <Text style={styles.label}>Username</Text>
//                   <TextInput 
//                     onChangeText={handleChange('mobileNumber')}
//                     value={values.mobileNumber}
//                     placeholder='Mobile Number'
//                     keyboardType="numeric"
//                     style={styles.input} 
//                   />
//                   {(errors.mobileNumber && touched.mobileNumber) &&
//                     <Text className="mx-auto" style={{ color: 'red' }}>{errors.mobileNumber}</Text>
//                   }
//                   <Text style={styles.label}>Pin</Text>
//                   <TextInput 
//                     onChangeText={handleChange('pin')}
//                     onBlur={handleBlur('pin')}
//                     value={values.pin}
//                     placeholder='Pin'
//                     keyboardType="numeric"
//                     style={styles.input} 
//                   />
//                   {(errors.pin && touched.pin) &&
//                     <Text className="mx-auto" style={{ color: 'red' }}>{errors.pin}</Text>
//                   }


//                   <TouchableOpacity onPress={handleSubmit}
//                   // disabled={!isValid}
//                   >
//                     {/* {userExist? null : <Text className="text-red-600">User does not exist</Text>} */}
//                     <View >

//                       {isLoading ? (
//                         <ActivityIndicator size="large" color="#ffffff" />
//                       ) : (
//                         <Text style={styles.submitButton}>        <Text style={styles.submitText}>Submit</Text></Text>
//                       )}
//                       {/* <Text className="text-white text-2xl">Submit</Text> */}
//                     </View>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => navigation.navigate("Signup")} className="flex-row mx-auto"><Text className="  text-xl font-[600]">New User </Text>
//               <Text className="  text-xl text-blue-700 font-[800]"> Signup</Text>


//             </TouchableOpacity>
//                 </View>
                
//               )}
//             </Formik>
           


//           </ScrollView>
//         </KeyboardAvoidingView>

//         <View style={styles.container2}>
//           <View style={styles.firstImageContainer}>
//             <Image
//               source={require("../../assets/images/mantra.jpg")}
//               style={styles.firstImage}
//             />
//           </View>

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
//   container: {
//     flex: 1,
//   },
//   container1: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
  
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 14,
//     marginVertical: 5,
//     color: "#006400", // Deep green color
//   },
//     input: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 10,
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
//     aspectRatio: 100 / 28, // Actual aspect ratio of the image
//     resizeMode: 'contain',
//     marginLeft: 2, // Adjust if needed
//   },

//   submitButton: {
//     backgroundColor: "#004d00",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   submitText: {
//     color: "#fff",
//     fontWeight: "bold",
//     text: 'center',
//   },
// });

// export default App;