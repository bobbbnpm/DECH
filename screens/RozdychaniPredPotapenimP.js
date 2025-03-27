import React, { useState } from "react"; // Import Reactu a hooku useState
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Komponenta a hook pro bezpečné okraje

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky okna

const RozdychaniPredPotapenimP = () => {
  const navigation = useNavigation(); // Navigační hook
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets(); // Získání bezpečných okrajů

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
          <Text style={styles.title}>ROZDÝCHÁNÍ {"\n"}PŘED POTÁPENÍM</Text>
        </View>

        {/* Box s popisem dechového cvičení */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Tato dechová technika slouží k přípravě těla i mysli před potápěním. Pomáhá zklidnit dech, zpomalit srdeční rytmus a naladit se na potápění. Využívá se hluboké dýchání, kdy je nádech nosem po dobu 5 sekund, krátké zadržení dechu na 2 sekundy a pomalý výdech ústy po dobu 8 sekund. 
            {"\n\n"}
            Tím se snižuje potřeba kyslíku a tělo se lépe připraví na zadržení dechu pod hladinou.
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
          onPress={() => navigation.navigate("RozdychaniPredPotapenimC", { selectedTime })}>
          <Text style={styles.startButtonText}>Pokračovat</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, // Zabírá celou obrazovku
    backgroundColor: "#F5F2F4" // Světlé pozadí
  },
  container: {
    flex: 1, // Zabírá všechen prostor
    backgroundColor: "#F5F2F4", // Barva pozadí
    alignItems: "center", // Zarovnání na střed vodorovně
    justifyContent: "center", // Zarovnání na střed svisle
    paddingHorizontal: width * 0.05, // Vnitřní mezery zleva a zprava
  },
  header: { 
    flexDirection: "row", // Rozložení prvků vedle sebe
    alignItems: "center", // Svislé zarovnání na střed
    justifyContent: "center", // Zarovnání na střed vodorovně
    width: "100%", // Zabírá celou šířku
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Umístění vlevo
    left: width * 0.05, // Vzdálenost zleva
    backgroundColor: "#9B5DE5", // Fialové pozadí
    borderRadius: 50, // Kulatý tvar
    padding: 12, // Vnitřní odsazení
    shadowColor: "#000", // Stín barva
    shadowOffset: { width: 0, height: 2 }, // Posun stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Stín pro Android
  },
  title: {
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Barva textu
    marginLeft: width * 0.05, // Odsazení zleva
    marginTop: height * 0.02, // Odsazení shora
    marginBottom: height * 0.02, // Odsazení zdola
  },
  description: {
    fontSize: width * 0.045, // Velikost písma
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
    marginBottom: height * 0.04, // Spodní odsazení
  },
  timeButton: {
    paddingVertical: height * 0.015, // Svislé odsazení
    paddingHorizontal: width * 0.06, // Vodorovné odsazení
    backgroundColor: "#B39DDB", // Výchozí barva tlačítka
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
    paddingVertical: height * 0.02, // Svislé odsazení
    borderRadius: 12, // Zaoblení rohů
    width: "85%", // Šířka tlačítka
    alignItems: "center", // Zarovnání obsahu
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost stínu
    shadowRadius: 5, // Rozmazání stínu
    elevation: 4, // Výška stínu pro Android
  },
  startButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučný text
  },
});

export default RozdychaniPredPotapenimP; // Export komponenty
