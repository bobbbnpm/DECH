import React, { useState } from "react"; // Import Reactu a hooku useState
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z Expo knihovny
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Bezpečné okraje obrazovky

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky obrazovky

const RozdychaniPredBehemP = () => {
  const navigation = useNavigation(); // Navigační hook
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets(); // Okraje pro bezpečnou oblast

  return (
    <SafeAreaView style={[styles.safeContainer, { 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom, 
        paddingLeft: insets.left, 
        paddingRight: insets.right 
        }]}>
      
      <View style={styles.container}>

        {/* Hlavička s tlačítkem zpět a názvem */}
        <View style={styles.header}>
          {/* Tlačítko zpět */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Ikona zpět */}
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Nadpis obrazovky */}
          <Text style={styles.title}>ROZDÝCHÁNÍ{"\n"}PŘED BĚHEM</Text>
        </View>

        {/* Box s popisem cvičení */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Tato dechová technika se doporučuje při běhu. Dýchá se tak, že se nadechnete na dva kroky a vydechnete na další dva.
            {"\n\n"}
            Pomáhá zklidnit dech, zlepšit výkon, šetřit energii a snižuje napětí v těle. Díky pravidelnému rytmu se běží plynuleji a s větší lehkostí.
          </Text>
        </View>

        {/* Výběr délky cvičení */}
        <View style={styles.buttonGroup}>
          {[2, 5, 10].map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]}
              onPress={() => setSelectedTime(time)}>
              <Text style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
                {time} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tlačítko pro pokračování */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("RozdychaniPredBehemC", { selectedTime })}
        >
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zabírá celou výšku
    backgroundColor: "#F5F2F4" // Barva pozadí
  },
  container: {
    flex: 1, // Zabírá celý prostor
    backgroundColor: "#F5F2F4", // Barva pozadí
    alignItems: "center", // Zarovnání na střed
    justifyContent: "center", // Zarovnání na střed
    paddingHorizontal: width * 0.05, // Vnitřní mezera z boků
  },
  header: { 
    flexDirection: "row", // Prvky vedle sebe
    alignItems: "center", // Zarovnání na střed
    justifyContent: "center", // Na střed
    width: "100%", // Celá šířka
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Absolutní pozice
    left: width * 0.05, // Odsazení zleva
    backgroundColor: "#9B5DE5", // Barva pozadí
    borderRadius: 50, // Kulatý tvar
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Výška stínu pro Android
  },
  title: {
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Barva písma
    marginTop: height * 0.02, // Odsazení shora
  },
  description: {
    fontSize: width * 0.05, // Velikost textu
    textAlign: "center", // Zarovnání textu
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Barva okraje
    borderRadius: 12, // Zaoblení rohů
    padding: width * 0.05, // Vnitřní odsazení
    marginTop: height * 0.13, // Odsazení shora
    marginBottom: height * 0.05, // Odsazení zdola
    backgroundColor: "#EDE7F6", // Světle fialové pozadí
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed
  },
  buttonGroup: {
    flexDirection: "row", // Tlačítka vedle sebe
    justifyContent: "center", // Zarovnání na střed
    gap: width * 0.03, // Mezera mezi tlačítky
    marginBottom: height * 0.04, // Spodní mezera
  },
  timeButton: {
    paddingVertical: height * 0.015, // Svislé odsazení
    paddingHorizontal: width * 0.06, // Vodorovné odsazení
    backgroundColor: "#B39DDB", // Barva pozadí
    borderRadius: 12, // Zaoblení
    elevation: 3, // Stín pro Android
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Zvýraznění při výběru
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost písma
    fontWeight: "bold", // Tučné písmo
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Barva tlačítka
    paddingVertical: height * 0.02, // Vnitřní odsazení
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost
    shadowRadius: 5, // Rozmazání
    elevation: 4, // Výška stínu
  },
  startButtonText: {
    color: "#FFF", // Barva písma
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
  },
});

export default RozdychaniPredBehemP; // Export komponenty
