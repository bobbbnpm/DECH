import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const rainSoundUri = require("../assets/rain.mp3");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 4000, scale: 1.3 },
  { phase: "Výdech", duration: 6000, scale: 1 },
  { phase: "Zadržet dech", duration: 2000, scale: 1 }
];

const totalExerciseTime = 300000; // 5 minut

const ZklidnitStresScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [breathing, setBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(totalExerciseTime);
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000);
  const [rainPlaying, setRainPlaying] = useState(false);
  const rainSound = useRef(null);
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
            stopRain();
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

  // 🚀 **Zastavení zvuku při odchodu z obrazovky**
  useEffect(() => {
    const stopAndUnload = async () => {
      if (rainSound.current) {
        try {
          await rainSound.current.stopAsync();
          await rainSound.current.unloadAsync();
          rainSound.current = null;
          setRainPlaying(false);
        } catch (error) {
          // Chybu ignorujeme, aby se neobjevila žádná hláška
        }
      }
    };

    const unsubscribe = navigation.addListener("beforeRemove", stopAndUnload);

    return () => {
      unsubscribe();
      stopAndUnload();
    };
  }, [navigation]);

  // ✅ **Spuštění a vypnutí zvuku**
  const toggleRain = async () => {
    if (rainPlaying) {
      stopRain();
    } else {
      try {
        const { sound } = await Audio.Sound.createAsync(rainSoundUri, { isLooping: true });
        rainSound.current = sound;
        await sound.playAsync();
        setRainPlaying(true);
      } catch (error) {
        // Chybu ignorujeme
      }
    }
  };

  // ✅ **Zastavení zvuku**
  const stopRain = async () => {
    if (rainSound.current) {
      try {
        await rainSound.current.stopAsync();
        await rainSound.current.unloadAsync();
        rainSound.current = null;
        setRainPlaying(false);
      } catch (error) {
        // Chybu ignorujeme
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom, 
      paddingLeft: insets.left, 
      paddingRight: insets.right 
    }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { stopRain(); navigation.goBack(); }} style={styles.backButton}>
            <Ionicons name="arrow-back" size={32} />
          </TouchableOpacity>
          <Text style={styles.title}>ZKLIDNIT STRES</Text>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={toggleRain} style={styles.soundToggle}>
            <Ionicons name={rainPlaying ? "cloud" : "cloud-offline"} size={32} color="#445D48" />
          </TouchableOpacity>
        </View>

        <Text style={styles.timer}>{Math.floor(remainingTime / 60000)}:{(remainingTime % 60000 / 1000).toFixed(0).padStart(2, "0")}</Text>

        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

        <TouchableOpacity style={styles.button} onPress={breathing ? () => { stopRain(); setBreathing(false); } : () => setBreathing(true)}>
          <Text style={styles.buttonText}>{breathing ? "Zastavit" : "Začít"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F1F0EB", // Jemná krémová pro klidný pocit
  },
  container: { 
    flex: 1, 
    backgroundColor: "#F1F0EB",
    paddingHorizontal: width * 0.03,
    justifyContent: "space-between",
    paddingVertical: height * 0.01
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    marginTop: height * 0.02,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: width * 0.02,
    top: height * 0.01, 
    padding: 10, 
    backgroundColor: "#A8B5A2", // Jemná přírodní zelená
    borderRadius: 50, 
  },
  title: { 
    fontSize: width * 0.06, 
    position: "absolute",
    top: height * 0.02, 
    alignSelf: "center", // Zarovná text na střed v rámci `header`
    fontWeight: "bold", 
    color: "#445D48",
  },
  soundToggle: {
    position: "absolute",
    right: width * 0.4, 
    top: height * 0.06, 
    backgroundColor: "#A8B5A2", 
    padding: 10,
    borderRadius: 50,
    shadowColor: "#3C493F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  timer: { 
    marginTop: height * 0.1,
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#3C493F", // Jemnější tmavá zelená
    marginBottom: height * 0.02
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
    backgroundColor: "#DDE2C6", // Jemná pastelová zelená místo hnědé
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#445D48", // Kontrastní tlumená zelená
    shadowColor: "#A8B5A2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#445D48", // Kontrastní tmavší zelená
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    color: "#445D48", 
    marginBottom: height * 0.02
  },
  button: { 
    backgroundColor: "#445D48", // Zklidňující tmavší zelená
    paddingVertical: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#3C493F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: { 
    color: "#F1F0EB", // Světlejší béžová pro dobrý kontrast
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});

export default ZklidnitStresScreen;
