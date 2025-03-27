import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech nosem", duration: 4000, scale: 1.2 }, 
  { phase: "Výdech", duration: 6000, scale: 1 }, 
  { phase: "Nádech", duration: 1000, scale: 1.2 }, 
  { phase: "Výdech", duration: 1000, scale: 1 }, 
];

const comfortingTexts = [
  "Nadechuj se zhluboka.",
  "Uvolni ramena.",
  "Dýchej nosem, pomáhá to tělu lépe se okysličit.",
  "Soustřeď se na rytmus svého dechu, buď tady a teď.",
  "Pomalý výdech uklidňuje nervový systém.",
  "Dýchej vědomě a pomalu.",
  "Hýbej prsty na rukou i nohou, aktivuješ tak krevní oběh.",
  "Po dechovém cvičení se napij čisté vody.",
  "Soustřeď se jen na svůj dech, nic jiného teď není důležité.",
  "Nech myšlenky volně plynout, soustřeď se jen na dýchání.",
  "Dýchej hluboko do břicha.",
  "Při každém nádechu by se mělo břicho mírně rozpínat.",
  "Po cvičení začni nový den v klidu.",
];

const GoodMorningExercise = () => {
  const navigation = useNavigation(); // Navigace zpět
  const route = useRoute(); // Přístup k parametrům z předchozí obrazovky

  // Získání vybraného času nebo výchozí hodnota 5 minut
  const selectedTime = (route.params?.selectedTime || 5) * 60000;

  const insets = useSafeAreaInsets(); // Zajištění bezpečné oblasti obrazovky na různých zařízeních

  // Stavové proměnné
  const [remainingTime, setRemainingTime] = useState(selectedTime); // Zbývající čas
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dýchání
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Čas zbývající v aktuální fázi
  const [breathing, setBreathing] = useState(false); // Indikace, zda je cvičení aktivní
  const [textIndex, setTextIndex] = useState(0); // Index aktuální uklidňující věty
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace škálování kruhu

  // Efekt, který řídí animaci dýchání a časovač
  useEffect(() => {
    let phaseTimer;
    let countdown;

    if (breathing) {
      // Spuštění animace škálování kruhu dle fáze
      const { duration, scale } = breathCycle[phaseIndex];
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // Odpočítávání času fáze
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

      // Odpočítávání celkové doby cvičení
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
      // Reset všech hodnot po zastavení
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

  // Efekt pro přepínání uklidňujících vět
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

  // Pomocná funkce pro zformátování zbývajícího času do mm:ss
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
      paddingRight: insets.right 
    }]}>
      <View style={styles.container}>
        
        {/* Hlavička s tlačítkem zpět */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0D1B2A" />
          </TouchableOpacity>
          <Text style={styles.title}>DOBRÉ RÁNO</Text>
        </View>

        {/* Uklidňující věta a hlavní časovač */}
        <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        {/* Animovaný kruh s počtem sekund v aktuální fázi */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        {/* Název aktuální fáze dýchání */}
        <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

        {/* Tlačítko pro spuštění/zastavení cvičení */}
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
    backgroundColor: "#F3ECE7", // světlý, jemně teplý základ
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
    marginTop: height * 0.02,
    position: "relative",
  },
  backButton: { 
    position: "absolute", 
    left: width * 0.05, 
    backgroundColor: "#FFD29D", // jemná broskvová
    borderRadius: 50, 
    padding: 12,  
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 4, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#4C3A2D", // teplá hnědá pro kontrast
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#7D5A50", // tlumená teplá hnědorůžová
    marginTop: height * 0.04, 
    marginBottom: height * 0.02, 
    maxWidth: "80%",
    alignSelf: "center",
    lineHeight: width * 0.06,
    fontStyle: "italic", 
  },  
  timer: { 
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#4C3A2D", 
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.02
  },
  circle: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: width * 0.275,
    backgroundColor: "#FFEBD9", // jemný broskvový tón
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD29D", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#4C3A2D", 
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    color: "#7D5A50", 
  },
  button: { 
    backgroundColor: "#FFD29D", 
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { 
    color: "#4C3A2D", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});


export default GoodMorningExercise;
