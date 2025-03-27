import React, { useState } from "react"; // Import Reactu a hooku useState pro práci se stavem
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"; // Import základních komponent z React Native
import { Ionicons } from "@expo/vector-icons"; // Import ikon z knihovny Expo
import { useNavigation } from "@react-navigation/native"; // Hook pro navigaci
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // Bezpečné zóny pro layout

const { width, height } = Dimensions.get("window"); // Získání šířky a výšky obrazovky

const JakSpravneDychatCelyDenP = () => {
  const navigation = useNavigation(); // Hook pro navigaci mezi obrazovkami
  const [selectedTime, setSelectedTime] = useState(5); // Výchozí hodnota 5 minut
  const insets = useSafeAreaInsets(); // Bezpečné okraje zařízení

  return (
    <SafeAreaView style={[styles.safeContainer, { 
        paddingTop: insets.top, // Bezpečné odsazení odshora
        paddingBottom: insets.bottom, // Bezpečné odsazení odspoda
        paddingLeft: insets.left, // Bezpečné odsazení zleva
        paddingRight: insets.right // Bezpečné odsazení zprava
        }]}>
      
      <View style={styles.container}>

        {/* Hlavička se šipkou zpět a nadpisem */}
        <View style={styles.header}>
          {/* Tlačítko zpět */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {/* Ikona zpět */}
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* Nadpis obrazovky */}
          <Text style={styles.title}>JAK SPRÁVNĚ DÝCHAT{"\n"}CELÝ DEN</Text>
        </View>

        {/* Box s popisem dechového cvičení */}
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>
            Tato dechová technika slouží k vytvoření zdravého dechového návyku. Ideální je dýchat výhradně nosem, který vzduch filtruje, zvlhčuje a ohřívá. Doporučený rytmus je nádech nosem po dobu 4 sekund, zadržení dechu na 4 sekundy a pomalý výdech po dobu 6 sekund.
            {"\n\n"}
            Tento způsob dýchání zpomaluje dech, dýcháte tak klidněji a víc do břicha, ne jen do hrudníku.
            Aby si tělo přirozeně zvyklo na nový dechový vzorec, je potřeba ho trénovat každý den několikrát.
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
          onPress={() => navigation.navigate("JakSpravneDychatCelyDenC", { selectedTime })}
        >
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
    backgroundColor: "#F5F2F4", // Pozadí
    alignItems: "center", // Zarovnání obsahu na střed
    justifyContent: "center", // Svislé zarovnání
    paddingHorizontal: width * 0.05, // Vnitřní mezera z boků
  },
  header: { 
    flexDirection: "row", // Rozložení prvků vedle sebe
    alignItems: "center", // Zarovnání na střed
    justifyContent: "center", // Zarovnání doprostřed
    width: "100%", // Celá šířka
    position: "absolute", // Absolutní pozice
    top: height * 0.03, // Odsazení shora
  },
  backButton: { 
    position: "absolute", // Umístění vlevo
    left: width * 0.05, // Odsazení od levého okraje
    backgroundColor: "#9B5DE5", // Barva pozadí
    borderRadius: 50, // Zaoblení
    padding: 12, // Vnitřní mezera
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.2, // Průhlednost stínu
    shadowRadius: 4, // Rozmazání stínu
    elevation: 3, // Výška stínu (Android)
  },
  title: {
    fontSize: width * 0.05, // Velikost textu
    fontWeight: "bold", // Tučnost
    textAlign: "center", // Zarovnání na střed
    color: "#333", // Barva textu
    marginLeft: width * 0.05, // Mezera vlevo
    marginTop: height * 0.02, // Mezera nahoře
  },
  description: {
    fontSize: width * 0.045, // Velikost písma
    textAlign: "center", // Zarovnání na střed
    color: "#444", // Barva textu
  },
  descriptionBox: {
    borderWidth: 2, // Tloušťka okraje
    borderColor: "#9B5DE5", // Barva okraje
    borderRadius: 12, // Zaoblení
    padding: width * 0.05, // Vnitřní odsazení
    marginTop: height * 0.15, // Vnější mezera nahoře
    marginBottom: height * 0.04, // Vnější mezera dole
    backgroundColor: "#EDE7F6", // Světle fialové pozadí
    width: "90%", // Šířka boxu
    alignSelf: "center", // Zarovnání na střed
  },
  buttonGroup: {
    flexDirection: "row", // Vedle sebe
    justifyContent: "center", // Na střed
    gap: width * 0.03, // Mezera mezi tlačítky
    marginBottom: height * 0.04, // Mezera dole
  },
  timeButton: {
    paddingVertical: height * 0.015, // Svislá mezera uvnitř
    paddingHorizontal: width * 0.06, // Vodorovná mezera uvnitř
    backgroundColor: "#B39DDB", // Barva pozadí
    borderRadius: 12, // Zaoblení
    elevation: 3, // Stín pro Android
  },
  timeButtonSelected: {
    backgroundColor: "#9B5DE5", // Zvýrazněná barva
  },
  timeButtonText: {
    color: "#FFF", // Barva textu
    fontSize: width * 0.04, // Velikost písma
    fontWeight: "bold", // Tučné písmo
  },
  startButton: {
    backgroundColor: "#9B5DE5", // Barva tlačítka
    paddingVertical: height * 0.02, // Svislé odsazení
    borderRadius: 12, // Zaoblení
    width: "85%", // Šířka
    alignItems: "center", // Zarovnání obsahu
    shadowColor: "#000", // Barva stínu
    shadowOffset: { width: 0, height: 2 }, // Směr stínu
    shadowOpacity: 0.3, // Průhlednost
    shadowRadius: 5, // Rozmazání
    elevation: 4, // Stín pro Android
  },
  startButtonText: {
    color: "#FFF", // Barva písma
    fontSize: width * 0.05, // Velikost písma
    fontWeight: "bold", // Tučný text
  },
});

export default JakSpravneDychatCelyDenP; // Export hlavní komponenty
