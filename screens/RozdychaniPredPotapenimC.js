import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 5000, scale: 1.3 },
  { phase: "Výdech", duration: 10000, scale: 1 },
  { phase: "Nádech", duration: 5000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 30000, scale: 1.3 },
  { phase: "Výdech", duration: 10000, scale: 1 }, 
];

const comfortingTexts = [
  "Věděl jsi, že před freedivingem je klíčové dýchat pomalu a hluboce, aby ses zklidnil?",
  "Věděl jsi, že nikdy nesmíš freediving trénovat sám? Vždy měj buddyho, který tě hlídá.",
  "Věděl jsi, že hyperventilace před ponorem může zvýšit riziko ztráty vědomí pod vodou?",
  "Věděl jsi, že pomalejší srdeční tep ti pomůže šetřit kyslík a vydržet pod vodou déle?",
  "Věděl jsi, že při freedivingu je nejlepší nadechnout se hluboko, ale ne na úplné maximum?",
  "Věděl jsi, že pokud uvolníš celé tělo, snížíš spotřebu kyslíku a zlepšíš svůj výkon?",
  "Věděl jsi, že při sestupu je důležité vyrovnávat tlak v uších každých pár metrů?",
  "Věděl jsi, že trénink flexibility bránice pomáhá lépe zvládat tlak v hloubce?",
  "Věděl jsi, že dlouhý a pomalý výdech po vynoření pomáhá tělu předejít blackoutu?",
  "Věděl jsi, že freediveři využívají relaxační techniky, aby zůstali klidní i ve velké hloubce?",
  "Věděl jsi, že při výstupu je lepší soustředit se na pomalé a klidné pohyby?",
  "Věděl jsi, že pravidelný trénink dýchání a otužování zlepšuje tvou výdrž pod vodou?",
  "Věděl jsi, že freediving není o síle, ale o klidu a efektivním hospodaření s kyslíkem?",
  "Věděl jsi, že po freedivingu bys měl vždy pár minut odpočívat a nechat tělo zregenerovat?",
  "Věděl jsi, že freediveři trénují i na souši. Pomocí dechových cvičení a jógy?"
];

const RozdychaniPredPotapenimC = () => {
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
        <Text style={styles.title}>ROZDÝCHÁNÍ {"\n"}PŘED POTÁPENÍM</Text>
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
    backgroundColor: "#001F3F", // Temně modrá jako hluboké moře
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
    backgroundColor: "#008B8B", 
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
    color: "#E0FFFF",
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  comfortingText: {
    fontSize: width * 0.05,
    fontWeight: "500",
    textAlign: "center",
    color: "#008B8B",
    marginTop: height * 0.04, 
    marginBottom: height * 0.02, 
    maxWidth: "80%",
    alignSelf: "center",
    lineHeight: width * 0.06,
  },  
  timer: {
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.04,
    color: "#008B8B", 
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
    backgroundColor: "#004C7F", // Tmavě šedé pozadí pro kontrast
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E0FFFF",
  },
  circleText: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    color: "#E0FFFF",
  },
  phaseText: {
    fontSize: width * 0.05, 
    fontWeight: "bold", 
    textAlign: "center",
    marginBottom: height * 0.02,
    marginTop: height * 0.05,
    color: "#E0FFFF", 
  },
  button: {
    backgroundColor: "#008B8B", 
    padding: height * 0.02, 
    borderRadius: 10, 
    width: "90%", 
    alignSelf: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#E0FFFF", // Černá, aby to bylo čitelné na světlém tlačítku
    fontSize: width * 0.045, 
    fontWeight: "bold" 
  },
});

export default RozdychaniPredPotapenimC;
