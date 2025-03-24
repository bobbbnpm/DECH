import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.3 },
  { phase: "Výdech", duration: 4000, scale: 1 },
  { phase: "Zadržet dech", duration: 30000, scale: 1 },
];

const comfortingTexts = [
  "Věděl jsi, že Wim Hof začíná den studenou sprchou, aby probudil tělo a mysl?",
  "Věděl jsi, že pravidelné otužování může posílit tvůj imunitní systém?",
  "Věděl jsi, že Wim Hof tráví čas v extrémním chladu, protože věří v sílu těla přizpůsobit se?",
  "Věděl jsi, že hluboké dýchání může pomoci tělu lépe zvládnout stres?",
  "Věděl jsi, že Wim Hof dokáže kontrolovat svou tělesnou teplotu pouze pomocí mysli?",
  "Věděl jsi, že pokud se postavíš chladu s klidnou myslí, tvoje tělo ho lépe zvládne?",
  "Věděl jsi, že Wim Hof doporučuje dýchání a otužování jako cestu k silnější vůli?",
  "Věděl jsi, že klidný dech ti může pomoci zvládnout i extrémní podmínky?",
  "Věděl jsi, že Wim Hof věří, že každý může posílit své tělo tréninkem mysli?",
  "Věděl jsi, že pokud se soustředíš na dech, dokážeš ovlivnit své tělesné reakce?",
  "Věděl jsi, že pravidelné vystavování se chladu ti může pomoci lépe zvládat stres?",
  "Věděl jsi, že Wim Hof tráví čas v přírodě, protože věří v propojení člověka s přírodou?",
  "Věděl jsi, že pokud chceš být silnější, měl bys posilovat nejen tělo, ale i mysl?",
  "Věděl jsi, že klíčem k otužování není boj s chladem, ale jeho přijetí?",
  "Věděl jsi, že Wim Hof doporučuje meditaci jako nástroj k ovládání emocí a těla?"
];


const WimHofovaMetodaC = () => {
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
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>WIM HOFOVA METODA</Text>
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
    backgroundColor: "#0A1A24", // tmavý studený odstín – hlubina ledu
  },
  container: { 
    flex: 1, 
    backgroundColor: "#0A1A24", 
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
    backgroundColor: "#6ECFF6", // studená světle modrá jako led
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
    color: "#D6EFFB", // bledě ledová
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#A3DFF0", // uklidňující modrozelená
    marginTop: height * 0.035, 
    marginBottom: height * 0.02, 
    maxWidth: "80%",
    alignSelf: "center",
    lineHeight: width * 0.06,
    fontStyle: "italic"
  },  
  timer: { 
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.035,
    color: "#D6EFFB", 
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
    backgroundColor: "#132A33", // Hlubší fialovošedá – jemný kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6ECFF6",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#D6EFFB",
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginTop: height * 0.025,
    marginBottom: height * 0.015,
    color: "#A3DFF0", 
  },
  button: { 
    backgroundColor: "#6ECFF6", 
    padding: height * 0.018, 
    borderRadius: 12, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: "#0A1A24", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});

export default WimHofovaMetodaC;
