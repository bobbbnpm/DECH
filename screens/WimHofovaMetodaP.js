import React, { useState } from "react"; // Import Reactu a hooku useState
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci mezi obrazovkami
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Komponenta a hook pro bezpečné zobrazení obsahu

const { width, height } = Dimensions.get("window"); // Získání rozměrů obrazovky

const WimHofovaMetodaP = () => {
  const navigation = useNavigation(); // Navigační hook
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets(); // Bezpečné okraje pro různé zařízení

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
            {/* Ikona šipky */}
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Název obrazovky */}
          <Text style={styles.title}>WIM HOFOVA METODA</Text>
        </View>

        {/* Box s popisem dechové techniky */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Wim Hofova dechová metoda je jednoduchá, ale velmi účinná technika, která pomáhá okysličit tělo, posílit imunitní systém a lépe zvládat stres. 
            {"\n\n"}
            Je založena na vědomém hlubokém dýchání a dlouhém zadržení dechu, což dohromady aktivuje přirozené obranné mechanismy těla a zlepšuje jeho odolnost.
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

        {/* Tlačítko pro spuštění cvičení */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("WimHofovaMetodaC", { selectedTime })}>
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zabírá celou výšku obrazovky
    backgroundColor: "#F5F2F4" // Světlé pozadí
  },
  container: {
    flex: 1, // Zabírá celý prostor
    backgroundColor: "#F5F2F4", // Stejná barva pozadí
    alignItems: "center", // Zarovnání obsahu na střed vodorovně
    justifyContent: "center", // Zarovnání na střed svisle
    paddingHorizontal: width * 0.05, // Vnitřní odsazení zleva a zprava
  },
  header: { 
    flexDirection: "row", // Prvky vedle sebe
    alignItems: "center", // Zarovnání na střed svisle
    justifyContent: "center", // Zarovnání na střed vodorovně
    width: "100%", // Zabírá celou šířku
    position: "absolute", // Umístění absolutně
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Umístění vlevo
    left: width * 0.05, // Odsazení zleva
    backgroundColor: "#9B5DE5", // Fialové pozadí
    borderRadius: 50, // Kulatý tvar
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Posun stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Výška stínu (Android)
  },
  title: {
    fontSize: width * 0.05, // Velikost písma
    fontWeight: "bold", // Tučný text
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Tmavě šedý text
    marginLeft: width * 0.05, // Odsazení zleva
    marginTop: height * 0.02, // Odsazení shora
    marginBottom: height * 0.02, // Odsazení zdola
  },
  description: {
    fontSize: width * 0.05, // Velikost textu
    textAlign: "center", // Zarovnání na střed
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Barva okraje
    borderRadius: 12, // Zaoblení rohů
    padding: width * 0.05, // Vnitřní mezera
    marginTop: height * 0.13, // Odsazení shora
    marginBottom: height * 0.05, // Odsazení zdola
    backgroundColor: "#EDE7F6", // Světle fialové pozadí
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed
  },
  buttonGroup: {
    flexDirection: "row", // Rozložení vedle sebe
    justifyContent: "center", // Zarovnání na střed
    gap: width * 0.03, // Mezera mezi tlačítky
    marginBottom: height * 0.04, // Spodní mezera
  },
  timeButton: {
    paddingVertical: height * 0.015, // Vnitřní odsazení svisle
    paddingHorizontal: width * 0.06, // Vnitřní odsazení vodorovně
    backgroundColor: "#B39DDB", // Barva tlačítka
    borderRadius: 12, // Zaoblení rohů
    elevation: 3, // Stín pro Android
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Barva při výběru
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost textu
    fontWeight: "bold", // Tučný text
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Barva tlačítka
    paddingVertical: height * 0.02, // Vnitřní odsazení svisle
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Posun stínu
    shadowOpacity: 0.3, // Průhlednost stínu
    shadowRadius: 5, // Rozmazání stínu
    elevation: 4, // Výška stínu pro Android
  },
  startButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.05, // Velikost písma
    fontWeight: "bold", // Tučný text
  },
});

export default WimHofovaMetodaP; // Export komponenty
