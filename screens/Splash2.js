import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/Pure Prakriti bg img.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Blur/Dhundla Overlay */}
        <View style={styles.overlay} />

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/images/pureP.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>PURE PRAKRITI</Text>
          <Text style={styles.subtitle}>Nurturing Nature, Enriching Life</Text>
        </View>

        {/* Footer Logos */}
        <View style={styles.footer}>
          <Image
            source={require("../assets/images/Logo1.png")}
            style={styles.footerImage1}
          />
          <Image
            source={require("../assets/images/DPIIT.png")}
            style={styles.footerImage2}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)", // white transparent overlay to make bg blur-like
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220, // increased size
    height: 220,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#8B0000",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
    fontStyle: "italic",
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  footerImage1: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  footerImage2: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});

