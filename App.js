import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './app/store';
import MainNavigator from './MainNavigator';



export default function App() {



  return (
    <SafeAreaProvider>
       <Provider store={store} > 
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
       </Provider>
    </SafeAreaProvider>
  );
}






























// // In App.js in a new project

// import * as React from 'react';
// import { Button, View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Landing from './screens/Landing';
// import Home from './screens/Home';

// // function HomeScreen({ navigation }) {
// //   return (
// //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// //       <Text>Home Screen</Text>
      
// //       <Button title="Landing" onPress ={() => navigation.navigate('Landing')}  />
      
// //       {/* <Button title="Signup" style={{marginTop: 20}} onClick={() => navigation.navigate('Marketplace')} /> */}
// //     </View>
// //   );
// // }

// // function LandingScreen() {
// //   return (
// //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// //       <Text>Landing Screen</Text>
// //     </View>
// //   );
// // }

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen name="Landing" component={Landing} />
//         {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
//         <Stack.Screen name="Home" component={Home} />
//         {/* <Stack.Screen name="Landing" component={LandingScreen} /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;










// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>ky hua tera wada ? </Text>
      
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });   

// import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
// import Autocomplete from "react-google-autocomplete";

// export default () => {
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.topBox}>
//                 <Text style={{fontSize: 30, fontWeight: '700'}}>TWCPL</Text>
//             </View>

//             <View style={styles.selectionContainer}>
//                 <Text style={{fontSize: 28, color: '#FFF', marginBottom: 20}}>Where to ship?</Text>

//                 <View>
//                     <Text style={{fontSize: 18, color: '#FFF'}}>From</Text>
//                     <Autocomplete
//                         style={{width: '100%', borderRadius: 25, backgroundColor: 'white', marginTop: 5, marginBottom: 10}}
//                         apiKey={process.env.EXPO_PUBLIC_GOOGLE_KEY}
//                         onPlaceSelected={(place) => {
//                             console.log(place);
//                         }}
//                     />
//                 </View>

//                 <View>
//                     <Text style={{fontSize: 18, color: '#FFF'}}>To</Text>
//                     <Autocomplete
//                         style={{width: '100%', borderRadius: 25, backgroundColor: 'white', marginTop: 5, marginBottom: 10}}
//                         apiKey={process.env.EXPO_PUBLIC_GOOGLE_KEY}
//                         onPlaceSelected={(place) => {
//                             console.log(place);
//                         }}
//                     />
//                 </View>
//             </View>

//             <View style={styles.ctaWrapper}>
//                 <TouchableOpacity style={styles.cta}>
//                     <Text>Wallet</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.cta}>
//                     <Text>Insurance</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.cta}>
//                     <Text>Help & FAQ</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = new StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFF'
//     },
//     topBox: {
//         backgroundColor: '#70ACC1',
//         height: 250,
//         padding: 50
//     },
//     selectionContainer: {
//         backgroundColor: '#1E40D8',
//         borderRadius: 50,
//         width: '90%',
//         position: 'absolute',
//         top: 170,
//         left: '5%',
//         height: 250,
//         padding: 20
//     },
//     ctaWrapper: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginTop: 300
//     },
//     cta: {
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#1E40D8',
//         shadowOffset: 0,
//         shadowOpacity: 4,
//         borderColor: '#1E40D8',
//         borderWidth: 2,
//         shadowRadius: 10
//     }
// })