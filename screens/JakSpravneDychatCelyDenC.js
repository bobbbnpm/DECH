import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 4000, scale: 1.2 },
  { phase: "Zadržet dech", duration: 4000, scale: 1.2 },
  { phase: "Výdech", duration: 6000, scale: 1 },
];

const comfortingTexts = [
  "Věděl jsi, že správné dýchání dokáže zlepšit tvé soustředění?",
  "Věděl jsi, že pokud dýcháš nosem, tělo se lépe okysličuje?",
  "Věděl jsi, že dlouhý výdech pomáhá tělu přejít do klidového režimu?",
  "Věděl jsi, že když uvolníš ramena, tvůj dech se prohloubí automaticky?",
  "Věděl jsi, že pravidelné hluboké nádechy ti mohou dodat více energie než káva?",
  "Věděl jsi, že správné dýchání pomáhá snížit stres i při náročném dni?",
  "Věděl jsi, že pomalý výdech tě udrží v klidu i během těžké situace?",
  "Věděl jsi, že při chůzi můžeš synchronizovat dech s kroky pro lepší rovnováhu?",
  "Věděl jsi, že pokud zadržuješ dech při stresu, tělo reaguje napětím?",
  "Věděl jsi, že správné dýchání ti může pomoci lépe zvládnout únavu?",
  "Věděl jsi, že vědomé dýchání může zlepšit kvalitu spánku už během dne?",
  "Věděl jsi, že když dýcháš klidně a pomalu, tvé tělo se cítí bezpečněji?",
  "Věděl jsi, že krátká dechová pauza po nádechu pomáhá tělu efektivněji využít kyslík?",
  "Věděl jsi, že hluboké dýchání může pomoci uvolnit napjaté svaly?",
];


const JakSpravneDychatCelyDenC = () => {
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
        <Text style={styles.title}>JAK SPRÁVNĚ DÝCHAT{"\n"}CELÝ DEN</Text>
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
    backgroundColor: "#2C1F25", // tmavý tón květinového stínu (tmavě růžově-hnědá)
  },
  container: { 
    flex: 1, 
    backgroundColor: "#2C1F25", 
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
    backgroundColor: "#F2B5A8", // jemná květinová meruňková
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
    color: "#FFE9D6", // krémová/slunečně světlá
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#F2B5A8",
    marginTop: height * 0.04, 
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
    marginBottom: height * 0.02,
    color: "#FFE9D6", 
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
    backgroundColor: "#3D2B33", // Hlubší fialovošedá – jemný kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F2B5A8",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#FFE9D6",
  },
  phaseText: { 
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.02,
    color: "#F2B5A8", 
  },
  button: { 
    backgroundColor: "#F2B5A8", 
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
    color: "#2C1F25", 
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});

export default JakSpravneDychatCelyDenC;
