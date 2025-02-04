import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import { TextInput } from 'react-native';
import { CheckBox, Image } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
// import CheckBox from 'react-native-check-box';
import { useNavigation } from '@react-navigation/native';
import { calculateResultAsync, selectUserInfo } from './calculatorSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Keyboard, Platform } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const App = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [vehiclePart1, setVehiclePart1] = useState('');
  const [vehiclePart2, setVehiclePart2] = useState('');
  const [vehiclePart3, setVehiclePart3] = useState('');
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false); // State to toggle additional details
  const userInfo = useSelector(selectUserInfo);

  const [box1, setBox1] = useState('');
  const [box2, setBox2] = useState('');
  const [box3, setBox3] = useState('');

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);

  const [showImage, setShowImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    const timer = setTimeout(() => {
      setShowImage(true);

      const blinkInterval = setInterval(() => {
        setShowImage(prevShowImage => !prevShowImage);
      }, 10000);

      // Clear the interval if the component is unmounted
      return () => clearInterval(blinkInterval);
    }, 5000);

    // Clear the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  const handleBox1Change = (text) => {
    if (text.length <= 2) {
      setBox1(text);
      if (text.length === 2) {
        box2Ref.current.focus();
      }
    }
  };

  const handleBox2Change = (text) => {
    if (text.length <= 6) {
      setBox2(text);
      if (text.length === 6) {
        box3Ref.current.focus();
      }
    }
  };

  const handleBox3Change = (text) => {
    if (text.length <= 4) {
      setBox3(text);
    }
  };

  const handleBox3Blur = () => {
    const totalDigits = box2.length + box3.length;
    if (totalDigits === 9) {
      const newBox2 = box2.slice(0, -1);
      const newBox3 = box2.slice(-1) + box3;
      setBox2(newBox2);
      setBox3(newBox3);
    }
  };


  const part1Ref = useRef(null);
  const part2Ref = useRef(null);
  const part3Ref = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const result = useSelector((state) => state.calculator.result); // Adjust according to your state structure
  const resultStatus = useSelector((state) => state.calculator.status); // Assuming you have status in your state
  const error = useSelector((state) => state.calculator.error);



  useEffect(() => {
    if (resultStatus === 'idle' && result) {
      setIsLoading(false);
      navigation.navigate('Result');
    } else if (resultStatus === 'idle' && error) {
      setIsLoading(false);
      // Handle error if necessary
      Alert.alert('Error', error); // Display error using Alert (or any other notification mechanism)
    }
  }, [resultStatus, result, error]);

  const toggleAdditionalDetails = () => {
    setShowAdditionalDetails(!showAdditionalDetails); // Toggle additional details visibility
  };

  const handleCheckBox = () => {
    setIsChecked(!isChecked);
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
          <Text style={styles.headerText}>नमस्ते {userInfo ? userInfo.userName : "Name"}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.iconContainer}
          >
            <FontAwesome name="user-o" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Formik initialValues={{
              VechileNumber: '', SourcePincode: '', DestinationPincode: '', LoadedWeight: '', VechileType: '', MobilisationDistance: '', DeMobilisationDistance: '', gstin: ''
            }}
              onSubmit={async (values) => {
                setIsLoading(true);
                values.VechileNumber = box2 + box3;
                dispatch(calculateResultAsync(values));
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, resetForm }) => {
                useFocusEffect(
                  useCallback(() => {
                    resetForm();
                    setBox2('');
                    setBox3(''); // Reset form when screen is focused (on back navigation)
                  }, [])
                );
                return (

                  <View style={styles.formWrapper}>

                    <Text style={styles.subtitle}>Trip Details</Text>

                    <Text style={styles.label}>Vehicle Number</Text>


                    <View className="flex-row  space-x-2 ">
                      <TextInput
                        value={box2}
                        onChangeText={handleBox2Change}
                        maxLength={6}
                        ref={box2Ref}
                        keyboardType="default"
                        className="bg-white p-2 rounded-md border border-gray-300 mb-2 flex-1"
                      />
                      <TextInput
                        value={box3}
                        onChangeText={handleBox3Change}
                        onBlur={handleBox3Blur}
                        keyboardType="numeric"
                        maxLength={4}
                        ref={box3Ref}
                        className="bg-white p-2 rounded-md border border-gray-300 mb-2 flex-1"
                      />
                    </View>

                    <View >
                      <View >
                        <Text style={styles.label}>Source Pincode</Text>
                        <TextInput
                          onChangeText={handleChange('SourcePincode')}
                          onBlur={handleBlur('SourcePincode')}
                          value={values.SourcePincode}
                          placeholder='Source Pincode'
                          keyboardType="numeric"
                          maxLength={6}
                          style={styles.input}
                        />

                        <Text style={styles.label}>Destination Pincode</Text>
                        <TextInput
                          onChangeText={handleChange('DestinationPincode')}
                          onBlur={handleBlur('DestinationPincode')}
                          value={values.DestinationPincode}
                          placeholder='Destination Pincode'
                          keyboardType="numeric"
                          maxLength={6}
                          style={styles.input}
                        />
                        <Text style={styles.label}>Loaded Weight (in kg)</Text>
                        <TextInput
                          onChangeText={handleChange('LoadedWeight')}
                          onBlur={handleBlur('LoadedWeight')}
                          value={values.LoadedWeight}
                          placeholder='Loaded Weight (in kg)'
                          keyboardType="numeric"
                          style={styles.input}
                        />
                        <Text style={styles.label}>GSTIN</Text>
                        <TextInput
                          onChangeText={handleChange('gstin')}
                          onBlur={handleBlur('gstin')}
                          value={values.gstin.toUpperCase()}
                          placeholder='GSTIN'
                          maxLength={16}
                          style={styles.input}
                        />
                      </View>
                    </View>

                    <TouchableOpacity onPress={toggleAdditionalDetails}>
                      <Text className="text-xl font-[500] mx-auto mb-1 mt-4">
                        Additional Details (optional) {showAdditionalDetails ? '▲' : '▼'}
                      </Text>
                    </TouchableOpacity>

                    {showAdditionalDetails && (
                      <>
                        <Text style={styles.label}>Mobilisation Distance</Text>
                        <TextInput
                          onChangeText={handleChange('MobilisationDistance')}
                          onBlur={handleBlur('MobilisationDistance')}
                          value={values.MobilisationDistance}
                          placeholder='Mob Distance (km)'
                          keyboardType="numeric"
                          style={styles.input}
                        />
                        <Text style={styles.label}>DeMobilisation Distance</Text>
                        <TextInput
                          onChangeText={handleChange('DeMobilisationDistance')}
                          onBlur={handleBlur('DeMobilisationDistance')}
                          value={values.DeMobilisationDistance}
                          placeholder='DeMob Distance (km)'
                          keyboardType="numeric"
                          style={styles.input}
                        />
                      </>
                    )}

                    <View style={{ flex: 1 }}>
                    </View>

                    <TouchableOpacity onPress={handleSubmit}>
                      <View style={styles.submitButton}>
                        {isLoading ? (
                          <ActivityIndicator size="large" color="#ffffff" />
                        ) : (
                          <Text style={styles.submitButtonText}>Submit</Text>
                        )}
                        {/* <Text className="text-white text-2xl">Submit</Text> */}
                      </View>
                    </TouchableOpacity>

                  </View>
                );
              }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Optional padding for some space from edges
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    flex: 1, // This will make the text take available space, pushing the icon to the right
  },
  iconContainer: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20, // Makes it a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,

  },
  formWrapper: {
    marginTop: 50,
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