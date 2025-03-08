import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Dechová technika – Wim Hof metoda
const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.2 }, // 4 sekundy nádech
  { phase: "Zadržet dech", duration: 4000, scale: 1.2 }, // 4 sekundy držení
  { phase: "Výdech", duration: 8000, scale: 1 }, // 6–8 sekund výdech
  { phase: "Zadržet dech", duration: 2000, scale: 1 }, // 2 sekundy pauza
];

const comfortingTexts = [
  "Nadechuj se zhluboka.",
  "Uvolni ramena.",
  "S každým výdechem nech odcházet napětí.",
  "Dýchej nosem, pomáhá to tělu lépe se okysličit.",
  "Soustřeď se na rytmus svého dechu, buď tady a teď.",
  "Pomalý výdech uklidňuje nervový systém.",
  "Ráno je nový začátek, nadechni se s úsměvem.",
  "Dýchej vědomě a pomalu.",
  "Hýbej prsty na rukou i nohou, aktivuješ tak krevní oběh.",
  "Po dechovém cvičení se napij čisté vody.",
  "Soustřeď se jen na svůj dech, nic jiného teď není důležité.",
  "Nech myšlenky volně plynout, teď se věnuj jen dýchání.",
  "Dýchej hluboko do břicha.",
  "Po cvičení se připrav na nový den, začni ho klidně.",
];


const GoodMorningExercise = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedTime = (route.params?.selectedTime || 5) * 60000;
  const insets = useSafeAreaInsets(); 
  const [remainingTime, setRemainingTime] = useState(selectedTime);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000);
  const [breathing, setBreathing] = useState(false);
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

      // Hlavní časovač podle vybraného času
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
      setRemainingTime(selectedTime);
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

  // Převod milisekund na minuty a sekundy
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
      {/* Hlavička s tlačítkem zpět */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>DOBRÉ RÁNO</Text>
      </View>

      {/* Časovač odpočítávající do konce cvičení */}
      <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      {/* Animovaný kruh s odpočtem uvnitř */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.circleText}>{phaseTime}</Text>
        </Animated.View>
      </View>

      {/* Text fáze dýchání pod kruhem */}
      <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

      {/* Tlačítko Start/Stop */}
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
    paddingVertical: height * 0.02
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
    left: width * 0.05, 
    backgroundColor: "#FFA500", 
    borderRadius: 50, 
    padding: 12,  
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFA500",
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#FFA500",
    marginTop: height * 0.04, 
    marginBottom: height * 0.02, 
    maxWidth: "80%",
    alignSelf: "center",
    lineHeight: width * 0.06,
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
    borderColor: "#FFA500", // Modrý okraj pro lepší viditelnost
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#FFA500", // Světle modrá pro lepší viditelnost
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#FFA500", // Modrá pro dobrý kontrast
  },
  button: { 
    backgroundColor: "#FFA500", // Modrá pro lepší viditelnost
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#9B5DE5",
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

export default GoodMorningExercise;
