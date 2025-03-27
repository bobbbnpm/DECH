import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const breathCycle = [
  { phase: "Nádech", duration: 5000, scale: 1.3 },
  { phase: "Zadržet dech", duration: 2000, scale: 1.3 },
  { phase: "Výdech", duration: 8000, scale: 1 }, 
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
  const navigation = useNavigation(); // Hook pro navigaci zpět
  const route = useRoute(); // Hook pro přístup k parametrům předané z předchozí obrazovky

  // Převod vybraného času z minut na milisekundy (výchozí je 5 minut)
  const selectedTime = (route.params?.selectedTime || 5) * 60000;

  const insets = useSafeAreaInsets(); // Pro bezpečné okraje na zařízeních s notchem

  const [remainingTime, setRemainingTime] = useState(selectedTime); // Zbývající čas do konce cvičení
  const [phaseIndex, setPhaseIndex] = useState(0); // Index aktuální fáze dechového cyklu
  const [phaseTime, setPhaseTime] = useState(breathCycle[0].duration / 1000); // Čas aktuální fáze v sekundách
  const [breathing, setBreathing] = useState(false); // Určuje, zda právě probíhá cvičení
  const [textIndex, setTextIndex] = useState(0); // Index uklidňující zprávy
  const scaleAnim = useState(new Animated.Value(1))[0]; // Animace pro zvětšování/zmenšování kruhu

  useEffect(() => {
    let phaseTimer; // Interval pro střídání fází dýchání
    let countdown;  // Hlavní časovač odpočítávání

    if (breathing) {
      const { duration, scale } = breathCycle[phaseIndex]; // Načtení aktuální fáze

      // Spustí animaci kruhu podle fáze (zvětšení/zmenšení)
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: duration,
        useNativeDriver: true,
      }).start();

      setPhaseTime(duration / 1000); // Nastavení délky fáze v sekundách

      // Spuštění fázového časovače (odpočítává sekundy do konce fáze)
      phaseTimer = setInterval(() => {
        setPhaseTime((prev) => {
          if (prev <= 1) {
            clearInterval(phaseTimer); // Ukončí aktuální fázi
            setPhaseIndex((prevIndex) => (prevIndex + 1) % breathCycle.length); // Přechod na další fázi
            return breathCycle[(phaseIndex + 1) % breathCycle.length].duration / 1000; // Délka nové fáze
          }
          return prev - 1; // Snížení zbývajícího času fáze
        });
      }, 1000);

      // Hlavní odpočet do konce cvičení
      countdown = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(countdown); // Konec cvičení
            setBreathing(false); // Zastavení dechu
            return 0;
          }
          return prev - 1000; // Snížení zbývajícího celkového času
        });
      }, 1000);
    } else {
      // Pokud cvičení není aktivní, resetujeme všechny stavy
      clearInterval(countdown);
      clearInterval(phaseTimer);
      setRemainingTime(selectedTime); // Obnovení původního času
      setPhaseTime(breathCycle[0].duration / 1000); // Obnovení výchozí fáze
      scaleAnim.setValue(1); // Obnovení animace
      setPhaseIndex(0); // Vrácení na první fázi
    }

    // Vyčištění timerů při odchodu nebo změně fáze
    return () => {
      clearInterval(phaseTimer);
      clearInterval(countdown);
    };
  }, [breathing, phaseIndex]);

  useEffect(() => {
    // Mění uklidňující text každých 10 sekund
    if (breathing) {
      const textChangeInterval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % comfortingTexts.length);
      }, 10000);

      return () => clearInterval(textChangeInterval); // Vyčistí po zastavení
    } else {
      setTextIndex(0); // Reset při zastavení
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
          <Text style={styles.title}>ROZDÝCHÁNÍ {"\n"}PŘED POTÁPENÍM</Text>
        </View>

        {/* Zobrazení uklidňujícího textu a časovače */}
        <Text style={styles.comfortingText}>{comfortingTexts[textIndex]}</Text>
        <Text style={styles.timer}>{formatTime(remainingTime)}</Text>

        {/* Animovaný kruh s odpočtem fáze */}
        <View style={styles.circleContainer}>
          <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.circleText}>{phaseTime}</Text>
          </Animated.View>
        </View>

        {/* Název aktuální fáze dýchání */}
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
