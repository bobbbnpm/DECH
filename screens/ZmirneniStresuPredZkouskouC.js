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
  "Zaměř se na nádech a výdech – právě teď není nic důležitějšího.",
  "Každý výdech ti pomáhá pustit napětí a obavy.",
  "Tvoje hodnota nezávisí na výsledku zkoušky, ale na tom, kdo jsi.",
  "Už teď děláš to nejlepší, co můžeš – a to stačí.",
  "Představ si, že s každým nádechem přijímáš klid a jistotu.",
  "Soustřeď se jen na tento okamžik. Všechno ostatní může počkat.",
  "Tvoje mysl se uklidňuje, tvé tělo se uvolňuje, jsi v bezpečí.",
  "Každý nádech ti přináší větší rovnováhu a soustředění.",
  "Důvěřuj si. Připravoval ses a jsi připraven zvládnout cokoli.",
  "Zkouška je jen situace. Dýchej. Všechno zvládneš krok za krokem."
];

const ZmirneniStresuPredZkouskouC = () => {
  const navigation = useNavigation(); // Hook pro navigaci mezi obrazovkami
  const route = useRoute(); // Hook pro přístup k parametrům předané navigací

  // Čas cvičení (v milisekundách), výchozí hodnota je 5 minut
  const selectedTime = (route.params?.selectedTime || 5) * 60000;

  const insets = useSafeAreaInsets(); // Bezpečné okraje (např. na iPhone s notchem)

  // Stavy cvičení
  const [remainingTime, setRemainingTime] = useState(selectedTime); // Čas do konce
  const [phaseIndex, setPhaseIndex] = useState(0); // Aktuální fáze v cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Čas aktuální fáze v sekundách
  const [breathing, setBreathing] = useState(false); // Cvičení zapnuto/vypnuto
  const [textIndex, setTextIndex] = useState(0); // Index aktuální uklidňující fráze
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace měnící velikost kruhu

  // Efekt pro správu cyklu dýchání a celkového času
  useEffect(() => {
    let phaseTimer;
    let countdown;

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex];

      // Spustí animaci zvětšení/zmenšení kruhu
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastaví délku aktuální fáze v sekundách

      // Časovač pro přepnutí na další fázi dýchání
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer); // Konec fáze – přechod na další
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length);
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000;
          }
          return prev - 1; // Jinak odečítání sekund
        });
      }, 1000);

      // Hlavní časovač pro celé cvičení (odpočítává zvolený čas)
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Po dokončení zastaví cvičení
            setBreathing(false);
            return 0;
          }
          return prev - 1000; // Jinak odečítá 1 sekundu
        });
      }, 1000);
    } else {
      // Reset při zastavení cvičení
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime);
      setPhaseTime(breathCycle[0].duration / 1000);
      scaleAnim.setValue(1);
      setPhaseIndex(0);
    }

    return () => {
      // Vyčištění timerů při odchodu nebo restartu
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  // Efekt pro pravidelné střídání uklidňujících textů (každých 10 s)
  useEffect(() => {
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval);
    } else {
      setTextIndex(0); // Reset při zastavení
    }
  }, [breathing]);

  // Pomocná funkce – převede milisekundy na formát mm:ss
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
        {/* Hlavička s názvem a tlačítkem zpět */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>ZMÍRNĚNÍ STRESU{"\n"}PŘED ZKOUŠKOU</Text>
        </View>

        {/* Uklidňující věta a čas do konce */}
        <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        {/* Animovaný kruh s odpočtem fáze */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        {/* Text s názvem fáze dýchání (např. Nádech, Výdech) */}
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
    backgroundColor: "#1D1625", // hlubší, teplá temně fialová
  },
  container: {
    flex: 1,
    backgroundColor: "#1D1625",
    paddingHorizontal: width * 0.03,
    justifyContent: "space-between",
    paddingVertical: height * 0.02,
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
    backgroundColor: "#B98EBF", // jemná tlumená fialovo-růžová
    borderRadius: 50,
    padding: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    color: "#E9E3EF", // jemná světlá lila
    marginLeft: width * 0.08,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#C2B4CC", // měkký šeříkový tón
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
    color: "#E9E3EF",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.02,
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "#2B2038", // hlubší tón s jemným odstínem lila
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#B98EBF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#E9E3EF",
  },
  phaseText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.02,
    color: "#C2B4CC",
  },
  button: {
    backgroundColor: "#B98EBF",
    padding: height * 0.02,
    borderRadius: 12,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#1D1625",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});


export default ZmirneniStresuPredZkouskouC;
