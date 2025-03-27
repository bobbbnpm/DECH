import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 2000, scale: 1.3 },
  { phase: "Výdech", duration: 6000, scale: 1 }, 
];

const comfortingTexts = [
  "Spoj dlaně a dýchej do nich, pomůže ti to zpomalit dech.",
  "Nejsi v tom sám, tohle brzy přejde...tvé tělo se jen snaží chránit.",
  "Podívej se kolem sebe a vyjmenuj 5 věcí, které vidíš.",
  "Mysli na to, že jsi v bezpečí a brzy to přejde.",
  "Věděl jsi, že když několikrát zívneš, tak se tím tělo přirozeně uvolní?",
  "Polož si ruku na břicho a vnímej, jak se s nádechem zvedá a s výdechem klesá.",
  "Zkus si dát ruce kolem těla a jemně se pohupovat, zklidní to nervový systém.",
  "Věděl jsi, že pomalý výdech dokáže zpomalit tep a uklidnit tělo?",
  "Začni pomalu pohybovat prsty na rukou a nohou, vrátí tě to do přítomnosti.",
  "Řekni si nahlas: 'Jsem v bezpečí, nic mi nehrozí.'",
];

const DychaniProtiPanickymAtakamC = () => {
  const navigation = useNavigation(); // Hook pro navigaci – slouží k návratu zpět
  const route = useRoute(); // Hook pro získání parametrů předaných z předchozí obrazovky

  const selectedTime = (route.params?.selectedTime || 5) * 60000; // Vybraný čas (v minutách) převedený na milisekundy, výchozí hodnota je 5 minut
  const insets = useSafeAreaInsets(); // Získání bezpečných okrajů zařízení (notch, zaoblené rohy atd.)

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Stav pro zbývající čas cvičení
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dechového cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Čas zbývající do konce aktuální fáze (v sekundách)
  const [breathing, setBreathing] = useState(false); // Boolean: zda je cvičení spuštěno
  const [textIndex, setTextIndex] = useState(0); // Index uklidňujícího textu
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animovaná hodnota pro měnící se velikost kruhu

  useEffect(() => {
    let phaseTimer; // Timer pro jednotlivé fáze dýchání
    let countdown; // Hlavní odpočítávání celkového času

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Načtení aktuální fáze (nádech, výdech atd.)

      // Animace – zvětšování/zmenšování kruhu podle fáze
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastavení času pro aktuální fázi (v sekundách)

      // Timer pro fázi – každou sekundu snižuje zbývající čas fáze
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer); // Po dokončení fáze přejde na další
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      // Timer pro celkový čas cvičení – každou sekundu odečte 1s
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Po vypršení času cvičení skončí
            setBreathing(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      // Resetuje všechny hodnoty, pokud uživatel cvičení zastaví
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    // Vyčištění timerů při opuštění komponenty nebo změně stavu
    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    // Změna uklidňujícího textu každých 10 sekund
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval); // Vyčistí interval
    } else {
      setTextIndex(0); // Pokud se nedýchá, nastaví první text
    }
  }, [breathing]);

  // Převod času z ms na formát MM:SS
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
        <Text style={styles.title}>DÝCHÁNÍ PROTI{"\n"}PANICKÝM ATAKÁM</Text>
      </View>

      {/* Uklidňující text a časovač zbývajícího času */}
      <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
      <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

      {/* Kruh s animací a zbývajícím časem fáze */}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.circleText}>{phaseTime}</Text>
        </Animated.View>
      </View>

      {/* Název aktuální fáze */}
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
    backgroundColor: "#1E1B2E", // Jemná noční šeď s nádechem fialové
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
    backgroundColor: "#A69CAC", // Pudrová fialová
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
    color: "#EDEAF3", // Měkká světlá fialová
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#C1BEDD", // Světle šeříková
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
    color: "#C1BEDD",
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
    backgroundColor: "#2E2B40", // Hlubší fialovošedá – jemný kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#A69CAC",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#EDEAF3",
  },
  phaseText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    color: "#C1BEDD",
  },
  button: {
    backgroundColor: "#A69CAC",
    padding: height * 0.02,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#1E1B2E",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});



export default DychaniProtiPanickymAtakamC;
