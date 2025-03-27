import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.2 },
  { phase: "Zadržet dech", duration: 7000, scale: 1.2 },
  { phase: "Výdech", duration: 8000, scale: 1 },
];

const comfortingTexts = [
  "Vydechuj dlouze a představuj si, jak se každá část těla uvolňuje.",
  "Počítej nádechy do deseti a pak začni znovu, pomalu a klidně.",
  "Představ si jemné vlny, které s každým výdechem odnášejí napětí.",
  "Začni u prstů na nohou a postupně uvolňuj celé tělo až k hlavě.",
  "Dýchej jako bys už spal – pomalu, pravidelně a bez námahy.",
  "Představ si, že jsi v měkké, teplé dece a všechno kolem se rozplývá."
];

const DychaniPredSpanimC = () => {
  const navigation = useNavigation(); // Hook pro návrat na předchozí obrazovku
  const route = useRoute(); // Hook pro přístup k parametrům přeneseným z předchozí obrazovky
  const selectedTime = (route.params?.selectedTime || 5) * 60000; // Čas zvolený uživatelem, převedený na milisekundy, výchozí 5 min
  const insets = useSafeAreaInsets(); // Bezpečné okraje pro zařízení s výřezem / zaoblenými rohy

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Zbývající čas celého cvičení
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze v dechovém cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Zbývající čas aktuální fáze v sekundách
  const [breathing, setBreathing] = useState(false); // Bool hodnota říkající, zda dýchací cvičení právě probíhá
  const [textIndex, setTextIndex] = useState(0); // Index uklidňujícího textu, který se zobrazuje během cvičení
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animovaná hodnota pro měnící se velikost kruhu (nádech/výdech)

  useEffect(() => {
    let phaseTimer; // Timer pro přepínání mezi fázemi dechového cyklu
    let countdown; // Timer pro celkové odpočítávání zvoleného času

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Načtení aktuální fáze

      // Spuštění animace měřítka kruhu (nádech/zadržení/výdech)
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastavení času pro aktuální fázi

      // Timer pro fázi – každou sekundu snižuje zbývající čas aktuální fáze
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer); // Přechod na další fázi
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      // Hlavní časovač podle vybraného času – každou sekundu odečítá 1s
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Konec cvičení
            setBreathing(false); // Ukončí dýchání
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      // Resetuje vše, pokud se dýchání zastaví ručně
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime); // Resetuje zbývající čas
      setPhaseTime(breathCycle[0].duration / 1000); // Reset první fáze
      scaleAnim.setValue(1); // Obnoví původní velikost kruhu
      setPhaseIndex(0); // Vrátí fázi na začátek
    }

    // Čištění timerů při ukončení efektu
    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    // Mění uklidňující text každých 10 sekund, pokud je cvičení aktivní
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval); // Vyčistí interval po ukončení
    } else {
      setTextIndex(0); // Pokud dýchání neběží, zobrazí první text
    }
  }, [breathing]);

  // Pomocná funkce pro převod času v ms na formát MM:SS
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
        <Text style={styles.title}>DÝCHÁNÍ PŘED SPANÍM</Text>
      </View>

      {/* Uklidňující text a časovač cvičení */}
      <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      {/* Animovaný kruh s odpočtem aktuální fáze */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.circleText}>{phaseTime}</Text>
        </Animated.View>
      </View>

      {/* Text názvu aktuální fáze (např. nádech, výdech) */}
      <Text style={styles.phaseText}>{breathCycle[phaseIndex].phase}</Text>

      {/* Tlačítko pro spuštění nebo zastavení cvičení */}
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
    backgroundColor: "#0B1D3A", // hluboká noční modř
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
    backgroundColor: "#A78BFA", // jemná fialová
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
    color: "#E8E6FF", // světle fialová jako měsíční svit
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#C3B9FF", // jemnější tón pro uklidnění
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
    color: "#C3B9FF", 
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
    backgroundColor: "#1E2C4C", // tmavší ale jemné
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A78BFA",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#E8E6FF",
  },
  phaseText: {
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    color: "#E8E6FF", 
  },
  button: {
    backgroundColor: "#A78BFA", 
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#0B1D3A", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});


export default DychaniPredSpanimC;
