import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 4000, scale: 1.3 },
  { phase: "Výdech", duration: 4000, scale: 1 },
  { phase: "Zadržet dech", duration: 4000, scale: 1 },
];

const comfortingTexts = [
  "Nadechni se nosem a vydechni ústy, pomůže ti to zpomalit dech.",
  "Polož si ruku na břicho a vnímej, jak se zvedá při nádechu a klesá při výdechu.",
  "Vydechuj pomaleji, než se nadechuješ.",
  "Zadrž dech na pár vteřin po nádechu a vnímej klid mezi dechy.",
  "Při výdechu si představuj, jak se z tebe odplavuje stres.",
  "Dýchej do břicha, ne do hrudníku, pomůže ti to lépe se uvolnit.",
  "Spočítej si nádechy a výdechy, udrží tě to soustředěného.",
  "Vydechni všechen vzduch ven a nech tělo samo rozhodnout, kdy se nadechne.",
  "Zkus 4-7-8 techniku: nadechni se na 4 doby, podrž dech na 7, vydechuj na 8.",
  "Při nádechu si představuj, že do tebe proudí energie, při výdechu odchází napětí.",
  "Jemné, pravidelné dýchání pomáhá zklidnit tep a mysl.",
  "Dechové cvičení je jako meditace – soustřeď se jen na svůj dech.",
  "Pokud se ti točí hlava, zpomal tempo a dýchej klidněji.",
  "Dýchej nosem a vnímej, jak se vzduch jemně dotýká tvých nosních dírek.",
  "Soustřeď se na prodloužené výdechy, zklidní to tvůj nervový systém.",
];

const DenBezStresuC = () => {
  const navigation = useNavigation(); // Hook pro navigaci zpět
  const route = useRoute(); // Hook pro přístup k parametrům z předchozí obrazovky
  const selectedTime = (route.params?.selectedTime || 5) * 60000; // Čas cvičení v milisekundách, výchozí 5 minut
  const insets = useSafeAreaInsets(); // Bezpečné okraje obrazovky (pro výřezy apod.)

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Stav zbývajícího času pro celé cvičení
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dechového cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Zbývající čas aktuální fáze v sekundách
  const [breathing, setBreathing] = useState(false); // Stav dýchání (true = spuštěno, false = stop)
  const [textIndex, setTextIndex] = useState(0); // Index aktuálního uklidňujícího textu
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace pro měnící se velikost kruhu

  useEffect(() => {
    let phaseTimer; // Timer pro fáze dýchání
    let countdown;  // Timer pro celkový čas cvičení

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Načtení aktuální fáze

      // Spuštění animace velikosti kruhu
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastavení času pro aktuální fázi

      // Timer pro přechod mezi fázemi
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer);
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length); // Posun na další fázi
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      // Hlavní časovač podle vybraného času
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Zastaví, pokud skončí cvičení
            setBreathing(false); // Ukončí dýchání
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      // Reset všech hodnot, pokud je dýchání zastaveno
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime); // Obnoví původní délku cvičení
      setPhaseTime(breathCycle[0].duration / 1000); // Obnoví první fázi
      scaleAnim.setValue(1); // Resetuje měřítko
      setPhaseIndex(0); // Vynuluje fázi
    }

    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    // Interval pro změnu uklidňujících textů každých 10 sekund
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval);
    } else {
      setTextIndex(0); // Po zastavení vrací první text
    }
  }, [breathing]);

  // Převod času z milisekund na formát MM:SS
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
        <Text style={styles.title}>DEN BEZ STRESU</Text>
      </View>

      {/* Uklidňující text a časovač cvičení */}
      <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      {/* Animovaný kruh s odpočtem času fáze */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.circleText}>{phaseTime}</Text>
        </Animated.View>
      </View>

      {/* Zobrazení názvu aktuální fáze dýchání */}
      <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

      {/* Tlačítko pro spuštění nebo zastavení dýchání */}
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
    backgroundColor: "#1E2A38", // Klidné tmavé pozadí
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
    backgroundColor: "#6CC9B9", // Jemná mentolová
    borderRadius: 50, 
    padding: 12,  
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 3, 
  },
  title: {
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#EAFDFC",
    marginLeft: width * 0.03,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#B2DFDB", // Jemná varianta akcentu
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
    marginBottom: height * 0.04,
    color: "#B2DFDB", 
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.015,
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.3,
    backgroundColor: "#2F3E4D", // Tmavě šedá s nádechem moře
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6CC9B9",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#EAFDFC",
  },
  phaseText: {
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    color: "#EAFDFC", 
  },
  button: {
    backgroundColor: "#6CC9B9", 
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#1E2A38", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});


export default DenBezStresuC;
