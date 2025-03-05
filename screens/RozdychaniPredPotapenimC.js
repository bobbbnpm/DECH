import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient"; // Gradient pozadí
import LottieView from "lottie-react-native"; // Animace bublin

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3, color: "#66CCFF" },
  { phase: "Zadržet dech", duration: 4000, scale: 1.3, color: "#3388CC" },
  { phase: "Výdech", duration: 6000, scale: 1, color: "#004488" },
];

const RozdychaniPredPotapenimC = () => {
  const navigation = useNavigation();
  const [breathing, setBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [showBubbles, setShowBubbles] = useState(true);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const buttonAnim = useState(new Animated.Value(1))[0];
  const circleColor = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (breathing) {
      console.log("Dýchání zahájeno!");
      cycleBreath();
    }
  }, [breathing]);

  const cycleBreath = () => {
    if (!breathing) return;

    const { duration, scale, color } = breathCycle[phaseIndex];

    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: scale, duration: duration, useNativeDriver: true }),
      Animated.timing(circleColor, { toValue: phaseIndex, duration: duration, useNativeDriver: false }),
    ]).start(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
      cycleBreath();
    });
  };

  const startBreathing = () => {
    setBreathing(!breathing);
    setPhaseIndex(0);

    if (!breathing) {
      cycleBreath();
      if (showBubbles) setTimeout(() => setShowBubbles(false), 3000);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const interpolatedColor = circleColor.interpolate({
    inputRange: breathCycle.map((_, i) => i),
    outputRange: breathCycle.map((b) => b.color),
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Mořské pozadí pomocí gradientu */}
      <LinearGradient colors={["#0099FF", "#003366"]} style={StyleSheet.absoluteFill} />

      {/* Animace bublin (pouze při prvním spuštění) */}
      {showBubbles && (
        <LottieView
          source={require("../assets/bubbles.json")}
          autoPlay
          loop={false}
          style={styles.bubbles}
        />
      )}

      {/* Zpětné tlačítko */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Kruh s animací */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: interpolatedColor,
          },
        ]}
      >
        <Text style={styles.circleText}>{breathCycle[phaseIndex].phase}</Text>
      </Animated.View>

      {/* Tlačítko Start/Zastavit */}
      <Animated.View style={{ transform: [{ scale: buttonAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            startBreathing();
            animateButton();
          }}
        >
          <Text style={styles.buttonText}>{breathing ? "Zastavit" : "Začít"}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#003366" },
  bubbles: { position: "absolute", width: 300, height: 300, top: -50 },
  header: { position: "absolute", top: height * 0.02, left: width * 0.02 },
  backButton: { padding: 10 },
  circle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: { fontSize: width * 0.07, fontWeight: "bold", color: "white" },
  button: {
    backgroundColor: "#00bfff",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default RozdychaniPredPotapenimC;
