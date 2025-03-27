import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Speech from "expo-speech"; // Import knihovny pro převod textu na řeč

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky zařízení

// Definice dechového cyklu s názvem fáze, délkou v ms a cílovým měřítkem pro animaci
const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 7000, scale: 1.3 },
  { phase: "Výdech", duration: 8000, scale: 1 },
];

const SnadneUsinaniScreen = () => {
  const navigation = useNavigation(); // Hook pro navigaci zpět
  const insets = useSafeAreaInsets(); // Získání okrajů zařízení pro bezpečné vykreslení
  const route = useRoute(); // Hook pro získání parametrů z předchozí obrazovky
  const selectedTime = (route.params?.selectedTime || 5) * 60000; // Výběr délky cvičení v milisekundách

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Čas zbývající do konce cvičení
  const [breathing, setBreathing] = useState(false); // Stav, zda je cvičení spuštěno
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dýchání
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Doba aktuální fáze v sekundách
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace měřítka kruhu

  useEffect(() => {
    let phaseTimer; // Timer pro přepínání fází
    let countdown; // Timer pro celkový čas cvičení

    if (breathing) {
      const { duration, scale, phase } = breathCycle[phaseIndex]; // Získání aktuální fáze

      // Spuštění animace měřítka kruhu
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastavení času dané fáze
      Speech.speak(phase); // Hlasová výzva pro fázi

      // Fáze dýchání - snižování sekund a přechod na další
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer); // Zastavení timeru pro fázi
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length); // Přechod na další fázi
            Speech.speak(breathCycle[(phaseIndex + 1) % breathCycle.length].phase); // Hlasová výzva pro další fázi
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1; // Každou sekundu sníží čas fáze o 1
        });
      }, 1000);

      // Odpočet celkového času cvičení
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Zastavení odpočtu
            setBreathing(false); // Ukončení dýchání
            return 0;
          }
          return prev - 1000; // Snížení zbývajícího času o 1 sekundu
        });
      }, 1000);
    } else {
      // Reset při zastavení cvičení
      clearInterval(countdown);
      clearInterval(phaseTimer);
      Speech.stop(); // Zastavení řeči
      setRemainingTime(selectedTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    return () => {
      // Vyčištění při unmount nebo změně
      clearInterval(phaseTimer);
      clearInterval(countdown);
      Speech.stop();
    };
  }, [breathing, phaseIndex]);

  // Funkce pro formátování času do mm:ss
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
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>SNADNÉ USÍNÁNÍ</Text>
        </View>

        {/* Zobrazení zbývajícího času */}
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        {/* Kruhový animovaný indikátor */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        {/* Název aktuální fáze dýchání */}
        <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

        {/* Tlačítko pro spuštění / zastavení cvičení */}
        <TouchableOpacity style={styles.button} onPress={() => setBreathing(!breathing)}>
          <Text style={styles.buttonText}>{breathing ? "Zastavit" : "Začít"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Stylování komponenty
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
    color: "#FFF",
    marginBottom: height * 0.02
  },
  timer: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#7E5EE3"
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
