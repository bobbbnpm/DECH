import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 4000, scale: 1.3 },
  { phase: "Výdech", duration: 6000, scale: 1 },
  { phase: "Zadržet dech", duration: 2000, scale: 1 }
];

const comfortingTexts = [
  "JSI V POŘÁDKU",
  "NIC SE NEDĚJE",
  "NEMUSÍŠ SE BÁT",
  "JSI V BEZPEČÍ",
  "UVOLNI SE",
];

const totalExerciseTime = 300000; // 5 minut v milisekundách

const PanickaAtakaScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // Dynamické hodnoty bezpečných okrajů
  const [breathing, setBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(totalExerciseTime);
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000);
  const [textIndex, setTextIndex] = useState(0);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    let phaseTimer;
    let countdown;

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex];
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000);
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer);
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
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
      setRemainingTime(totalExerciseTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval);
    } else {
      setTextIndex(0);
    }
  }, [breathing]);

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
            <Ionicons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>PANICKÁ ATAKA</Text>
        </View>

        <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
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
    backgroundColor: "#121212",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#121212", 
    paddingHorizontal: width * 0.03,
    justifyContent: "space-between",
    paddingVertical: height * 0.01
  },
  header: { 
  flexDirection: "row", 
  alignItems: "center", 
  justifyContent: "center",
  marginTop: height * 0.02,
  position: "relative", // Umožní správné umístění prvků
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    top: height * 0.01, 
    padding: 10, 
    backgroundColor: "#90CAF9", 
    borderRadius: 50, 
  },
  title: { 
    position: "absolute",
    top: height * 0.02, 
    alignSelf: "center", // Zarovná text na střed v rámci `header`
    fontSize: width * 0.06, 
    fontWeight: "bold", 
    color: "white",
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    color: "#90CAF9",
    marginTop: height * 0.05, // Přidává větší mezery pod "PANICKÁ ATAKA"
    marginBottom: height * 0.02, // Odsazení od časovače
  },  
  timer: { 
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "white", // Bílé písmo
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.015
  },
  circle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "#1E1E1E", // Tmavě šedé pozadí pro kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#90CAF9", // Modrý okraj pro lepší viditelnost
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#90CAF9", // Světle modrá pro lepší viditelnost
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#90CAF9", // Modrá pro dobrý kontrast
  },
  button: { 
    backgroundColor: "#90CAF9", // Modrá pro lepší viditelnost
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#90CAF9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: { 
    color: "#121212", // Černá, aby to bylo čitelné na světlém tlačítku
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});

export default PanickaAtakaScreen;
