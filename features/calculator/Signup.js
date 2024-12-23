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
  //   .min(8, ({ min }) => `Password must be at least ${min} characters`)
  //   .required('Password is required'),
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref('password')], 'Passwords do not match')
  //   .required('Confirm password is required'),
})

const App = () => {
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

  const [modalVisible1, setModalVisible1] = useState(false);

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

  const handleSendOtp = (mobileNumber) => {
    if (mobileNumber) {
      // Logic to send OTP
      console.log({ 'mobileNumber': mobileNumber });
      dispatch(sendNumberAsync({ 'mobileNumber': mobileNumber }))
      // Open the OTP modal
      setModalVisible(true);
    } else {
      console.log('Mobile number is required to send OTP');
    }
  };

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




  return (
    <View className=" h-[100%] ">
      <ImageBackground source={require("../../assets/images/bg4.jpg")} resizeMode="cover" className="h-[100%] flex items-center">
        <View className="w-[105%] h-[13%] bg-cyan-200 rounded-b-[100px] flex-row">
          <Text className="mt-[40px] text-3xl ml-[35%]">Welcome</Text>
          {/* <TouchableOpacity className="mt-[40px] ml-[60px] flex items-center justify-center h-[40px] w-[40px] bg-white rounded-3xl" >
        <FontAwesome name="user-o" size={24} color="black" />
        </TouchableOpacity> */}
        </View>



        {/* <Text className="text-xl mt-2 px-6">Track your carbon footprint </Text>
      <Text className="text-xl px-6">effortlessly with our CO2 emission</Text>
      <Text className="text-xl px-6">calculator. Small steps, big impact!</Text> */}

        <KeyboardAvoidingView className=" h-[70%] w-[100%] mt-8">
          <ScrollView>
            <Formik
              initialValues={{ userName: '', mobileNumber: null, pin: null, confirmPin: null }}
              validationSchema={signUpSchema}
              onSubmit={(values) => {
                setIsLoading(true);
                if (isChecked) {
                  console.log(isOtpVerified);
                  if (isOtpVerified) {
                    dispatch(signupAsync(values));
                  }
                  if (isAuthenticated) {
                    // console.log("success")
                    navigation.navigate('Calculator');
                  }
                } else {
                  setIsLoading(false);
                  // Do nothing, stay on the same page
                }
              }
              }
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                <View className="pb-[50px]">
                  <Text className="text-3xl ml-[140px] font-semibold mb-11">Sign Up</Text>
                  {/* Photo Input */}

                  {/* <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20}}>
      {values.image && <Image source={{ uri: values.image }} className="h-[80px] w-[80px] rounded-[100px]" />}
      <Button title="add photo" onPress={()=>pickImage(setFieldValue)} />
      </View>
      {(errors.image && touched.image) &&
                  <Text style={{ color: 'red' }}>{errors.image}</Text>
                } */}

                  <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
                    onChangeText={handleChange('userName')}
                    onBlur={handleBlur('userName')}
                    value={values.userName}
                    placeholder='User Name'
                  />
                  {(errors.userName && touched.userName) &&
                    <Text style={{ color: 'red' }}>{errors.userName}</Text>
                  }
                  <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
                    onChangeText={handleChange('mobileNumber')}
                    onBlur={handleBlur('mobileNumber')}
                    value={values.mobileNumber}
                    placeholder='Mobile Number'
                    keyboardType="numeric"
                    editable={!isOtpVerified}
                  />
                  {(errors.mobileNumber && touched.mobileNumber) &&
                    <Text style={{ color: 'red' }}>{errors.mobileNumber}</Text>
                  }
                  {isOtpVerified ?
                    <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-green-800 font-bold">Otp Verified</Text></TouchableOpacity>

                    : <TouchableOpacity onPress={() => handleSendOtp(values.mobileNumber)} className="mx-auto px-[20px] bg-white"><Text className="text-blue-800 font-bold">Send Otp</Text></TouchableOpacity>
                  }
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                  >
                    <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                      <View className="h-[300px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text className="text-2xl ml-[0px]">Fill Otp</Text>
                        <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[40px]"
                          value={inputOtp}
                          onChangeText={setInputOtp}
                          placeholder='Enter Otp'
                        />
                        <View className="mt-11">
                          <Button title="Verify Otp" onPress={() => { setModalVisible(false); dispatch(verifyOtpAsync({ "otp": inputOtp, "mobileNumber": values.mobileNumber })); }} />
                        </View>
                      </View>
                    </View>
                  </Modal>

                  {/* <TouchableOpacity className="mx-auto mt-5 px-[20px] bg-white"><Text className="text-blue-800 font-bold">Verify Otp</Text></TouchableOpacity> */}

                  <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
                    onChangeText={handleChange('pin')}
                    onBlur={handleBlur('pin')}
                    value={values.pin}
                    placeholder='Pin'
                    keyboardType="numeric"
                  />
                  {(errors.pin && touched.pin) &&
                    <Text style={{ color: 'red' }}>{errors.pin}</Text>
                  }

                  <TextInput className="mx-[12%] my-2 rounded-xl border-2 text-black-200 text-lg font-semibold pl-[90px]"
                    onChangeText={handleChange('confirmPin')}
                    onBlur={handleBlur('confirmPin')}
                    value={values.confirmPin}
                    placeholder='Confirm Pin'
                    keyboardType="numeric"
                  />
                  {(errors.confirmPin && touched.confirmPin) &&
                    <Text style={{ color: 'red' }}>{errors.confirmPin}</Text>
                  }

                  <View className="mx-[65px]  flex-row  justify-center">
                    {/* <CheckBox
        title='By checking this box, you agree to our terms and conditions'
        checked={isChecked}
        onPress={handleCheckBox}
      />  */}
                    <View >
                      {/* // className="mx-[65px]  flex-row justify-center" */}
                      <CheckBox
                        style={{ backgroundColor: 'transparent', borderWidth: 0 }}
                        title='By checking this box, you agree to our terms and conditions'
                        checked={isChecked}
                        onPress={handleCheckBox}
                        containerStyle={{
                          backgroundColor: 'transparent',
                          borderWidth: 0,
                        }}
                      />
                      {/* <TouchableOpacity><Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text></TouchableOpacity> */}
                    </View>
                    <TouchableOpacity onPress={openModal1}>
                      {/* <Text className="text-blue-800 font-bold w-[50px] pl-2 bg-white text-lg mt-2 mr-11 pt-5 h-[70px]">T&C</Text> */}
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible1}
                      onRequestClose={closeModal1}
                    >
                      <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View className="h-[600px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
                          <Text className="text-2xl ml-[20px]">Terms & Conditions</Text>
                          <View className="border-black border-2 mt-[20px]">
                            <Text className=" mt-[20px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
                            <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
                            <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
                            <Text className=" mt-[40px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
                            <Text className=" mt-[40px] mx-auto mb-[20px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
                          </View>
                          <View className="mt-11">
                            <Button title="Read T&C" onPress={() => { setModalVisible1(false) }} />
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>

                  <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
                    <View className="w-[150px] h-[50px] ml-[130px] rounded-2xl mt-5 bg-blue-900 flex items-center justify-center">
                      {isLoading ? (
                        <ActivityIndicator size="large" color="#ffffff" />
                      ) : (
                        <Text className="text-white text-2xl">Submit</Text>
                      )}
                      {/* <Text className="text-white text-2xl">Submit</Text> */}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} className="flex-row mx-auto mb-11"><Text className="  text-xl font-[600]">Existing User </Text>
              <Text className="  text-xl text-blue-700 font-[800]"> Login</Text>

            </TouchableOpacity>


          </ScrollView>

        </KeyboardAvoidingView>
        {/* <View className="flex-1 flex-row items-center justify-center mt-0">
        <Text className="text-white">Made in</Text>
        <Image
          className=" ml-2"
          source={require("../../assets/images/image 10.png")}
          style={{ width: 40, height: 22 }}
        />
      </View> */}
        {/* <View className="flex-1 flex-row space-x-[10%] items-center  mt-0">
        <View>
        <Image
          className="ml-0"
          source={require("../../assets/images/mantra.jpg")}
          style={{ width: 50, height: 50 }}
        />
        </View>
     
     <View className="flex-row"> 
      <Text className="text-white pl-6">Made in</Text>
        <Image
          className=" ml-2"
          source={require("../../assets/images/image 10.png")}
          style={{ width: 40, height: 22 }}
        />
        </View>
       <View>
        <Image
          className=" ml-11"
          source={require("../../assets/images/make-in-India-logo.jpg")}
          style={{ width: 80, height: 48 }}
        />
        </View>
      </View> */}
        <View className="flex-1 flex-row space-x-[6%] items-center  mt-0 w-[100%]">
          <View className="w-[25%]">
            <Image
              className="ml-2"
              source={require("../../assets/images/mantra.jpg")}
              style={{ width: 50, height: 50 }}
            />
          </View>

          <View className="flex-row w-[25%]">
            <Text className="text-white pl-6">Made in</Text>
            <Image
              className=" ml-2"
              source={require("../../assets/images/image 10.png")}
              style={{ width: 40, height: 28 }}
            />
          </View>
          <View style={{ width: "37%" }}>
            <Image
              source={require("../../assets/images/make-in-India-logo.jpg")}
              style={{
                width: "100%",
                height: undefined,
                aspectRatio: 100 / 28, // Use the actual aspect ratio of the image
                resizeMode: "contain",
                marginLeft: 24,
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default App;