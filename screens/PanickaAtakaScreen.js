import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky obrazovky pro responzivní rozměry

// Definice dechového cyklu s fázemi a jejich trváním a změnou velikosti kruhu
const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 4000, scale: 1.3 },
  { phase: "Výdech", duration: 6000, scale: 1 },
  { phase: "Zadržet dech", duration: 2000, scale: 1 }
];

// Uklidňující texty, které se střídají během cvičení
const comfortingTexts = [
  "JSI V POŘÁDKU",
  "NIC SE NEDĚJE",
  "NEMUSÍŠ SE BÁT",
  "JSI V BEZPEČÍ",
  "UVOLNI SE",
];

const totalExerciseTime = 300000; // Celkový čas cvičení – 5 minut (v milisekundách)

// Hlavní komponenta obrazovky pro panickou ataku
const PanickaAtakaScreen = () => {
  const navigation = useNavigation(); // Hook pro navigaci mezi obrazovkami
  const insets = useSafeAreaInsets(); // Získání bezpečných okrajů (např. pro notche)

  // Stav, zda právě probíhá dýchací cvičení
  const [breathing, setBreathing] = useState(false);

  // Index aktuální fáze dechového cyklu
  const [phaseIndex, setPhaseIndex] = useState(0);

  // Zbývající čas cvičení v ms
  const [remainingTime, setRemainingTime] = useState(totalExerciseTime);

  // Čas v sekundách zbývající v aktuální fázi
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000);

  // Index aktuální uklidňující zprávy
  const [textIndex, setTextIndex] = useState(0);

  // Animovaná hodnota pro zvětšování/zmenšování kruhu
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Efekt pro řízení dechového cyklu a časovače
  useEffect(() => {
    let phaseTimer; // Timer pro fáze
    let countdown; // Timer pro celkové odpočítávání

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Načti aktuální fázi

      // Spusť animaci změny velikosti kruhu
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      // Nastav počáteční čas aktuální fáze
      setPhaseTime(duration / 1000);

      // Spusť interval pro fázi
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer);
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length); // Posuň fázi dál
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1; // Odečítej čas
        });
      }, 1000);

      // Spusť hlavní odpočítávání
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown);
            setBreathing(false); // Ukonči cvičení
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      // Reset po zastavení cvičení
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

  // Efekt pro cyklické zobrazování uklidňujících textů
  useEffect(() => {
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval);
    } else {
      setTextIndex(0); // Reset při zastavení dýchání
    }
  }, [breathing]);

  // Pomocná funkce pro formátování času mm:ss
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
            <Ionicons name="arrow-back" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>PANICKÁ ATAKA</Text>
        </View>

        {/* Uklidňující text */}
        <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>

        {/* Odpočítávání času */}
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        {/* Animovaný kruh */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        {/* Název aktuální fáze */}
        <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

        {/* Tlačítko pro spuštění / zastavení */}
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
