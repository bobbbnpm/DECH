import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech (2 kroky)", duration: 2000, scale: 1.2 },
  { phase: "Výdech (2 kroky)", duration: 2000, scale: 1 },
];

const comfortingTexts = [
  "Věděl jsi, že pokud dýcháš nosem, lépe okysličíš svaly a vydržíš déle?",
  "Věděl jsi, že nádech na dva kroky a výdech na dva kroky pomáhá udržet stabilní rytmus?",
  "Věděl jsi, že dlouhý výdech při běhu pomáhá snížit tepovou frekvenci a únavu?",
  "Věděl jsi, že pokud uvolníš ramena a paže, dýchání při běhu bude přirozenější?",
  "Věděl jsi, že hluboké břišní dýchání ti pomůže předejít píchání v boku?",
  "Věděl jsi, že při běhu do kopce je lepší zkrátit dechový rytmus a soustředit se na výdech?",
  "Věděl jsi, že zadržování dechu při běhu může způsobit rychlejší vyčerpání?",
  "Věděl jsi, že pokud dýcháš ústy, tvé tělo získá více kyslíku, ale rychleji vysychá hrdlo?",
  "Věděl jsi, že při běhu v chladném počasí bys měl dýchat nosem, aby se vzduch ohřál?",
  "Věděl jsi, že synchronizace dechu s krokem ti pomůže běžet plynuleji a efektivněji?",
  "Věděl jsi, že pokud se při běhu soustředíš na klidný výdech, uvolníš napětí v těle?",
  "Věděl jsi, že zpomalení dechu při delším běhu pomáhá udržet rovnoměrné tempo?",
  "Věděl jsi, že krátký sprint na závěr běhu pomáhá zlepšit celkovou výdrž?",
  "Věděl jsi, že pokud začneš běh příliš rychle, tvé dýchání se rychle rozhodí?",
  "Věděl jsi, že správné dýchání pomáhá tělu efektivněji spalovat energii?"
];

const RozdychaniPredBehemC = () => {
  const navigation = useNavigation(); // Hook pro návrat zpět na předchozí obrazovku
  const route = useRoute(); // Hook pro přístup k parametrům z předchozí obrazovky

  const selectedTime = (route.params?.selectedTime || 5) * 60000; // Načte vybraný čas (v minutách), nebo výchozích 5 minut a převede na milisekundy
  const insets = useSafeAreaInsets(); // Zajistí, že obsah se nevyhne do výřezů (notch apod.)

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Stav pro zbývající čas cvičení
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dechového cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Délka aktuální fáze v sekundách
  const [breathing, setBreathing] = useState(false); // Určuje, zda je cvičení aktivní
  const [textIndex, setTextIndex] = useState(0); // Index aktuální uklidňující fráze
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace škálování kruhu podle fáze

  useEffect(() => {
    let phaseTimer; // Timer pro fáze dýchání
    let countdown;  // Hlavní časovač pro celé cvičení

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Získá aktuální fázi

      // Spustí animaci zvětšení nebo zmenšení kruhu podle fáze
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastaví počet sekund v aktuální fázi

      // Interval pro odpočítávání fáze dýchání (sekundový krok)
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

      // Hlavní odpočítávání do konce celého cvičení
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Cvičení končí
            setBreathing(false); // Zastaví dýchání
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      // Pokud dýchání není aktivní, resetujeme stavy
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    // Čistíme intervaly při změně komponenty nebo zastavení dýchání
    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    // Mění uklidňující texty každých 10 sekund během dýchání
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval); // Vyčistí se při ukončení
    } else {
      setTextIndex(0); // Resetuje text při zastavení dýchání
    }
  }, [breathing]);

  // Pomocná funkce pro převod času v milisekundách na formát MM:SS
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
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>ROZDÝCHÁNÍ{"\n"}PŘED BĚHEM</Text>
      </View>

      {/* Text a časovač do konce cvičení */}
      <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      {/* Animovaný kruh s počítadlem fáze */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.circleText}>{phaseTime}</Text>
        </Animated.View>
      </View>

      {/* Zobrazení aktuální fáze dýchání */}
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
    backgroundColor: "#1F2B26", // tmavý lesní základ, jako stín stromů
  },
  container: { 
    flex: 1, 
    backgroundColor: "#1F2B26", 
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
    backgroundColor: "#8EA98E", // pastelová zelená – mech a lístky
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
    color: "#D8E6D3",
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#A8C1A0", // listová pastelová zeleň
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
    color: "#D8E6D3", 
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
    backgroundColor: "#2E3B33", // Hlubší fialovošedá – jemný kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#8EA98E",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#D8E6D3",
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    color: "#A8C1A0", 
  },
  button: { 
    backgroundColor: "#8EA98E", 
    padding: height * 0.02, 
    borderRadius: 12, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: "#1F2B26", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});


export default RozdychaniPredBehemC;
