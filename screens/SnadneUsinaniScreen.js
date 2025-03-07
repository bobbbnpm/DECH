import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Speech from "expo-speech";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },   
  { phase: "Zadržet dech", duration: 7000, scale: 1.3 },  
  { phase: "Výdech", duration: 8000, scale: 1 },  
];


const SnadneUsinaniScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const selectedTime = (route.params?.selectedTime || 5) * 60000;
  const [remainingTime, setRemainingTime] = useState(selectedTime);
  const [breathing, setBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let phaseTimer;
    let countdown;

    if (breathing) {
      const { duration, scale, phase } = breathCycle[phaseIndex];

      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000);
      Speech.speak(phase);

      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer);
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
            Speech.speak(breathCycle[(phaseIndex + 1) % breathCycle.length].phase);
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown);
            setBreathing(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      clearInterval(countdown);
      clearInterval(phaseTimer);
      Speech.stop();
      setRemainingTime(selectedTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
      Speech.stop();
    };
  }, [breathing, phaseIndex]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom, 
      paddingLeft: insets.left, 
      paddingRight: insets.right }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>SNADNÉ USÍNÁNÍ</Text>
        </View>

        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}> 
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setBreathing(!breathing)}>
          <Text style={styles.buttonText}>{breathing ? "Zastavit" : "Začít"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: "#121212" 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: width * 0.03, 
    justifyContent: "space-between", 
    paddingVertical: height * 0.02 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    position: "relative", 
    marginTop: height * 0.02 
  },
  backButton: { 
    position: "absolute", 
    left: width * 0.02, 
    top: height * 0.01, 
    padding: 10, 
    backgroundColor: "#7E5EE3", 
    borderRadius: 50 
  },
  title: { 
    marginTop: height * 0.025,
    fontSize: width * 0.06, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF", // Jemnější tmavá zelená
    marginBottom: height * 0.02
  },
  timer: { 
    fontSize: width * 0.07, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#7E5EE3", // Bílé písmo
  },
  circleContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: height * 0.015 
  },
  circle: { 
    width: width * 0.65, 
    height: width * 0.65, 
    borderRadius: width * 0.325, 
    backgroundColor: "#311D3F", 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 3, 
    borderColor: "#7E5EE3" 
  },
  circleText: { 
    fontSize: width * 0.1, 
    fontWeight: "bold", 
    color: "#FFF" 
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#7E5EE3", 
    marginBottom: height * 0.02 
  },
  button: { 
    backgroundColor: "#7E5EE3", 
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center", 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  }
});

export default SnadneUsinaniScreen;