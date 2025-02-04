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