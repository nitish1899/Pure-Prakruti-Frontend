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
        source={require("../../assets/images/Pure Prakriti bg img.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            नमस्ते {userInfo ? userInfo.userName : "Name"}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.iconContainer}
          >
            <FontAwesome name="user-o" size={22} color="#004d00" />
          </TouchableOpacity>
        </View>

        {/* Form */}
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={{
                VechileNumber: "",
                SourcePincode: "",
                DestinationPincode: "",
                LoadedWeight: "",
                VechileType: "",
                MobilisationDistance: "",
                DeMobilisationDistance: "",
                gstin: "",
              }}
              onSubmit={async (values) => {
                setIsLoading(true);
                values.VechileNumber = box2 + box3;
                dispatch(calculateResultAsync(values));
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                resetForm,
              }) => {
                useFocusEffect(
                  React.useCallback(() => {
                    resetForm();
                    setBox2("");
                    setBox3("");
                  }, [])
                );
 return (
    <View style={styles.formWrapper}>
      <Text style={styles.subtitle}>Trip Details</Text>

      {/* Vehicle Number */}
      <Text style={styles.label}>Vehicle Number</Text>
      <View style={styles.vehicleRow}>
        <View style={styles.iconInputWrapper}>
          <FontAwesome name="car" size={20} color="#555" style={styles.icon} />
          <TextInput
            value={box2}
            onChangeText={handleBox2Change}
            maxLength={6}
            ref={box2Ref}
            keyboardType="default"
            style={styles.inputHalf}
            placeholder="AB12"
          />
        </View>

        <View style={styles.iconInputWrapper}>
          <FontAwesome
            name="sort-numeric-asc"
            size={20}
            color="#555"
            style={styles.icon}
          />
          <TextInput
            value={box3}
            onChangeText={handleBox3Change}
            onBlur={handleBox3Blur}
            keyboardType="numeric"
            maxLength={4}
            ref={box3Ref}
            style={styles.inputHalf}
            placeholder="1234"
          />
        </View>
      </View>

      {/* Source */}
      <Text style={styles.label}>Source Pincode</Text>
      <View style={styles.iconInputWrapper}>
        <FontAwesome name="map-marker" size={20} color="#555" style={styles.icon} />
        <TextInput
          onChangeText={handleChange("SourcePincode")}
          onBlur={handleBlur("SourcePincode")}
          value={values.SourcePincode}
          placeholder="Source Pincode"
          keyboardType="numeric"
          maxLength={6}
          style={styles.input}
        />
      </View>

      {/* Destination */}
      <Text style={styles.label}>Destination Pincode</Text>
      <View style={styles.iconInputWrapper}>
        <FontAwesome
          name="map-marker"
          size={20}
          color="#555"
          style={styles.icon}
        />
        <TextInput
          onChangeText={handleChange("DestinationPincode")}
          onBlur={handleBlur("DestinationPincode")}
          value={values.DestinationPincode}
          placeholder="Destination Pincode"
          keyboardType="numeric"
          maxLength={6}
          style={styles.input}
        />
      </View>

      {/* Weight */}
      <Text style={styles.label}>Loaded Weight (kg)</Text>
      <View style={styles.iconInputWrapper}>
        <FontAwesome
          name="balance-scale"
          size={20}
          color="#555"
          style={styles.icon}
        />
        <TextInput
          onChangeText={handleChange("LoadedWeight")}
          onBlur={handleBlur("LoadedWeight")}
          value={values.LoadedWeight}
          placeholder="Loaded Weight"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* GSTIN */}
      <Text style={styles.label}>GSTIN</Text>
      <View style={styles.iconInputWrapper}>
        <FontAwesome name="id-card" size={20} color="#555" style={styles.icon} />
        <TextInput
          onChangeText={handleChange("gstin")}
          onBlur={handleBlur("gstin")}
          value={values.gstin.toUpperCase()}
          placeholder="GSTIN"
          maxLength={16}
          style={styles.input}
        />
      </View>

      {/* Toggle extra */}
      <TouchableOpacity onPress={toggleAdditionalDetails}>
        <Text style={styles.toggleText}>
          Additional Details (optional) {showAdditionalDetails ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {/* Extra fields */}
      {showAdditionalDetails && (
        <>
          <Text style={styles.label}>Mobilisation Distance</Text>
          <View style={styles.iconInputWrapper}>
            <FontAwesome name="road" size={20} color="#555" style={styles.icon} />
            <TextInput
              onChangeText={handleChange("MobilisationDistance")}
              onBlur={handleBlur("MobilisationDistance")}
              value={values.MobilisationDistance}
              placeholder="Mob Distance (km)"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>DeMobilisation Distance</Text>
          <View style={styles.iconInputWrapper}>
            <FontAwesome name="road" size={20} color="#555" style={styles.icon} />
            <TextInput
              onChangeText={handleChange("DeMobilisationDistance")}
              onBlur={handleBlur("DeMobilisationDistance")}
              value={values.DeMobilisationDistance}
              placeholder="DeMob Distance (km)"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </>
      )}

      {/* Submit */}
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.submitButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        {!isKeyboardVisible && (
          <View style={styles.footerContainer}>
            <Image
              source={require("../../assets/images/mantra.jpg")}
              style={styles.footerImage1}
            />
            <Image
              source={require("../../assets/images/make-in-India-logo.png")}
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
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  // Header
  headerContainer: {
    width: "100%",
    height: "14%",
    backgroundColor: "#006400",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  iconContainer: {
    height: 38,
    width: 38,
    backgroundColor: "#fff",
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  // Form
  formContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 18,
  },
 formWrapper: {
    padding: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "500",
  },
vehicleRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 15,
},

iconInputWrapper: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  paddingHorizontal: 10,
  flex: 1,
  marginRight: 8,
  backgroundColor: "#fff",
  height: 50,
},

icon: {
  marginRight: 8,
},
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
  },
  inputHalf: {
    flex: 1,
    height: 42,
    fontSize: 14,
  },

inputField: {
    flex: 1,
    height: 42,
    fontSize: 14,
},

  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
